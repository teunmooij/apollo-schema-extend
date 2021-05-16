import {
  ExecutableDefinitionNode,
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
  InlineFragmentNode,
  isAbstractType,
  isInterfaceType,
  isObjectType,
  isUnionType,
  Kind,
  OperationDefinitionNode,
  SelectionNode,
} from 'graphql'
import { createField, DocumentDefinition, hasSelectionSet, isFieldNode, isNodeKind, withSelections } from '../ast'
import { toNamedType } from '../definition'
import { RemapRule } from '../withExternalSchema.types'

interface Context<TCurrent extends GraphQLNamedType> {
  schema: GraphQLSchema
  currentType: TCurrent
  fragments: Partial<Record<string, FragmentDefinitionNode>>
  remapRules: Partial<Record<string, RemapRule>>
  resolveInfo: GraphQLResolveInfo
}

/**
 * Filters the given operation based on the provided schema.
 * @param operation The operation to be filtered.
 * @param fragments Available fragments of the query
 * @param schema The schema to be used for the filtering
 */
export const getFilteredDefinition = (
  operation: OperationDefinitionNode,
  resolveInfo: GraphQLResolveInfo,
  schema: GraphQLSchema,
  remapRules: Partial<Record<string, RemapRule>>
): DocumentDefinition => {
  const fragments = Object.entries(resolveInfo.fragments).reduce((total, next) => {
    if (next[1]) {
      const filteredFragment = getFilteredFragment(next[1], schema, remapRules, resolveInfo)
      if (filteredFragment) {
        total[next[0]] = filteredFragment
      }
    }
    return total
  }, {} as Partial<Record<string, FragmentDefinitionNode>>)

  const filteredOperation = getFilteredOperation(operation, fragments, schema, remapRules, resolveInfo)
  return { operation: filteredOperation, fragments }
}

const getFilteredOperation = (
  operation: OperationDefinitionNode,
  fragments: Partial<Record<string, FragmentDefinitionNode>>,
  schema: GraphQLSchema,
  remapRules: Partial<Record<string, RemapRule>>,
  resolveInfo: GraphQLResolveInfo
): OperationDefinitionNode => {
  const currentType = operation.operation === 'query' ? schema.getQueryType() : schema.getMutationType()

  if (!currentType) {
    throw new Error(`operation ${operation.operation} is not supported by the schema`)
  }

  return filterNode(operation, { currentType, schema, fragments, remapRules, resolveInfo })
}

const getFilteredFragment = (
  fragment: FragmentDefinitionNode,
  schema: GraphQLSchema,
  remapRules: Partial<Record<string, RemapRule>>,
  resolveInfo: GraphQLResolveInfo
): FragmentDefinitionNode | null => {
  const currentType = schema.getType(fragment.typeCondition.name.value)
  if (!currentType) {
    return null
  }

  return filterNode(fragment, { currentType, schema, fragments: resolveInfo.fragments, remapRules, resolveInfo })
}


const filterNode = <TNode extends ExecutableDefinitionNode | SelectionNode>(
  node: TNode,
  { currentType, ...context }: Context<GraphQLNamedType>
): TNode => {
  let filteredNode = node
  if (isObjectType(currentType) || isInterfaceType(currentType)) {
    filteredNode = filterObjectLikeType(node, { currentType, ...context })
  } else if (isUnionType(currentType)) {
    filteredNode = filterUnionType(node, { currentType, ...context })
  }

  if (isFieldNode(node)) {
    const remapRule = context.remapRules[currentType.name]
    if (remapRule) {
      filteredNode = remapRule(filteredNode as FieldNode, {
        unfilteredNode: node,
        resolveInfo: context.resolveInfo,
      }) as TNode
    }
  }

  return filteredNode
}

const typeNameKey = '__typename'
const isFragmentSpread = isNodeKind(Kind.FRAGMENT_SPREAD)

const filterObjectLikeType = <TNode extends ExecutableDefinitionNode | SelectionNode>(
  node: TNode,
  { currentType, ...context }: Context<GraphQLObjectType | GraphQLInterfaceType>
): TNode => {
  if (hasSelectionSet(node)) {
    const fields = currentType.getFields()
    const selections: SelectionNode[] = []
    node.selectionSet.selections.forEach(selection => {
      if (isFieldNode(selection)) {
        const field = fields[selection.name.value]
        const selectionType = field && toNamedType(field.type)
        if (selectionType && isValidFieldSelection(selection, selectionType)) {
          selections.push(filterNode(selection, { ...context, currentType: selectionType }))
        } else if (selection.name.value === typeNameKey) {
          selections.push(selection)
        }
      } else {
        const filteredFragment = filterFragmentNode(selection, { currentType, ...context })
        if (filteredFragment) {
          selections.push(filteredFragment)
        }
      }
    })

    if (isInterfaceType(currentType) || !selections.length) {
      ensureTypename(selections)
    }

    return withSelections(node, selections)
  }
  return node
}

const isValidFieldSelection = (selection: FieldNode, selectionType: GraphQLNamedType): boolean =>
  selectionType instanceof GraphQLScalarType || selectionType instanceof GraphQLEnumType
    ? !selection.selectionSet
    : !!selection.selectionSet

const filterUnionType = <TNode extends ExecutableDefinitionNode | SelectionNode>(
  node: TNode,
  { currentType, ...context }: Context<GraphQLUnionType>
): TNode => {
  if (hasSelectionSet(node)) {
    const selections: SelectionNode[] = []
    node.selectionSet.selections.forEach(selection => {
      if (isFieldNode(selection)) {
        if (selection.name.value === typeNameKey) {
          selections.push(selection)
        }
      } else {
        const filteredFragment = filterFragmentNode(selection, { currentType, ...context })
        if (filteredFragment) {
          selections.push(selection)
        }
      }
    })

    ensureTypename(selections)
    return withSelections(node, selections)
  }
  return node
}

const filterFragmentNode = (
  node: FragmentSpreadNode | InlineFragmentNode,
  { currentType, ...context }: Context<GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType>
): FragmentSpreadNode | InlineFragmentNode | null => {
  if (isFragmentSpread(node)) {
    const fragment = context.fragments[node.name.value]
    return fragment && isFragmentAllowed(fragment, currentType, context.schema) ? node : null
  }

  if (isFragmentAllowed(node, currentType, context.schema)) {
    const fragmentType = context.schema.getType(node.typeCondition!.name.value)!
    const filteredNode = filterNode(node, { currentType: fragmentType, ...context })
    return filteredNode.selectionSet.selections.length ? filteredNode : null
  }

  return null
}

const isFragmentAllowed = (
  fragment: FragmentDefinitionNode | InlineFragmentNode,
  currentType: GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType,
  schema: GraphQLSchema
) => {
  const fragmentType = fragment.typeCondition && schema.getType(fragment.typeCondition.name.value)

  if (!fragmentType) {
    return false
  }

  return (
    currentType.name === fragmentType.name ||
    (isAbstractType(currentType) && schema.isSubType(currentType, fragmentType)) ||
    (isAbstractType(fragmentType) && schema.isSubType(fragmentType, currentType))
  )
}

const ensureTypename = (selections: SelectionNode[]) => {
  if (!selections.some(selection => isFieldNode(selection) && selection.name.value === typeNameKey)) {
    selections.push(createField(typeNameKey))
  }
}
