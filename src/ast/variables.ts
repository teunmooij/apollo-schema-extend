import {
  ArgumentNode,
  DefinitionNode,
  DirectiveNode,
  FragmentDefinitionNode,
  Kind,
  OperationDefinitionNode,
  SelectionNode,
} from 'graphql'
import { includes } from 'ramda'
import { hasArguments, hasDirectives, hasSelectionSet } from './typeGuards'

const isNotNull = (value: string | null): value is string => Boolean(value)

const getVariableName = (argumentNode: ArgumentNode) =>
  argumentNode.value.kind === Kind.VARIABLE ? argumentNode.value.name.value : null

export const getArgumentVariables = <TNode extends DefinitionNode | SelectionNode | DirectiveNode>(node: TNode) => {
  const variables = hasArguments(node) ? node.arguments.map(getVariableName).filter<string>(isNotNull) : []
  if (hasDirectives(node)) {
    variables.push(...node.directives.flatMap(getArgumentVariables).filter(arg => !variables.includes(arg)))
  }

  if (hasSelectionSet(node)) {
    variables.push(
      ...node.selectionSet!.selections.flatMap(getArgumentVariables).filter(arg => !variables.includes(arg))
    )
  }

  return variables
}

/**
 * Returns a shallow copy of the operation containing only variables that are used in the operation
 */
export const cleanVariables = (
  operation: OperationDefinitionNode,
  fragments: FragmentDefinitionNode[]
): OperationDefinitionNode => {
  if (operation && operation.variableDefinitions) {
    const definitions = [operation, ...fragments]
    const usedVariables = definitions.flatMap(getArgumentVariables)

    return {
      ...operation,
      variableDefinitions: operation.variableDefinitions.filter(definition =>
        includes(definition.variable.name.value, usedVariables)
      ),
    }
  }

  return operation
}
