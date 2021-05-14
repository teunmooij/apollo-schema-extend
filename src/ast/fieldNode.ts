import {
  FieldNode,
  FragmentDefinitionNode,
  InlineFragmentNode,
  Kind,
  OperationDefinitionNode,
  SelectionNode,
} from 'graphql'

const createName = (name?: string) => (name ? { kind: Kind.NAME, value: name } : undefined)

/**
 * Creates a field AST
 * @param {string} name
 * @param {string|undefined} alias
 */
export const createField = (name: string, alias?: string): FieldNode => ({
  alias: createName(alias),
  directives: [],
  kind: Kind.FIELD,
  name: createName(name)!,
  selectionSet: undefined,
})

export const withSelections = <
  TNode extends FieldNode | InlineFragmentNode | OperationDefinitionNode | FragmentDefinitionNode
>(
  node: TNode,
  selections: SelectionNode[]
): TNode => ({
  ...node,
  selectionSet: {
    ...node.selectionSet,
    kind: 'SelectionSet',
    selections,
  },
})

export const addSelections = <
  TNode extends FieldNode | InlineFragmentNode | OperationDefinitionNode | FragmentDefinitionNode
>(
  node: TNode,
  ...selections: SelectionNode[]
): TNode => withSelections(node, [...(node.selectionSet?.selections ?? []), ...selections])
