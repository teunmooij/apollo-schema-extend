import {
  DocumentNode,
  FieldNode,
  FragmentDefinitionNode,
  InlineFragmentNode,
  Kind,
  OperationDefinitionNode,
} from 'graphql'
import { DocumentDefinition } from './astTypes'
import { isNodeKind } from './typeGuards'
import { cleanVariables } from './variables'

export const toDocumentNode = ({ operation, fragments }: Required<DocumentDefinition>): DocumentNode => {
  const usedFragments = getUsedFragments(operation, fragments)
  const definitions = [cleanVariables(operation, usedFragments), ...usedFragments]

  return {
    kind: 'Document',
    definitions,
  }
}

const getUsedFragments = (
  operation: OperationDefinitionNode,
  fragments: Partial<Record<string, FragmentDefinitionNode>>
) => {
  return getUsedFragmentNames(operation, fragments)
    .filter((fragmentName, index, self) => self.indexOf(fragmentName) === index)
    .map(name => fragments[name]!)
}

const isFragmentSpread = isNodeKind(Kind.FRAGMENT_SPREAD)

const getUsedFragmentNames = (
  node: OperationDefinitionNode | FragmentDefinitionNode | FieldNode | InlineFragmentNode,
  fragments: Partial<Record<string, FragmentDefinitionNode>>
): string[] => {
  return (
    node.selectionSet?.selections.flatMap(selection =>
      isFragmentSpread(selection)
        ? [selection.name.value, ...getUsedFragmentNamesFromFragment(selection.name.value, fragments)]
        : getUsedFragmentNames(selection, fragments)
    ) ?? []
  )
}

const getUsedFragmentNamesFromFragment = (
  fragmentName: string,
  fragments: Partial<Record<string, FragmentDefinitionNode>>
): string[] => {
  const { [fragmentName]: fragment, ...remaining } = fragments
  return fragment ? getUsedFragmentNames(fragment, remaining) : []
}
