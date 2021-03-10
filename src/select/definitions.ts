import { DocumentNode, OperationDefinitionNode, FragmentDefinitionNode, getOperationAST } from 'graphql'
import { isOperationDefinitionNode, isFragmentDefinitionNode, DocumentDefinition } from '../types'
import { filterByType, findByType, ReadonlyDictionary } from '../utilities'
import { reduce } from 'ramda'

/**
 * Gets the operation AST of the document.
 * If the document contains multiple operations, the first one is returned.
 * @param {DocumentNode} document
 */
export const getOperation = ({ definitions }: DocumentNode): OperationDefinitionNode | undefined =>
  findByType(isOperationDefinitionNode, definitions)

/**
 * Gets a dictionary containing the fragment ASTs of the document by their name
 * @param {DocumentNode} document
 */
export const getFragments = ({ definitions }: DocumentNode): ReadonlyDictionary<string, FragmentDefinitionNode> =>
  reduce(
    (current, next) => {
      current[next.name.value] = next
      return current
    },
    {} as Record<string, FragmentDefinitionNode>,
    filterByType(isFragmentDefinitionNode, definitions)
  )

/**
 * Gets the document definitions.
 * @param {DocumentNode} document
 * @returns Returns structure similar to resolver info parameter
 * @throws when document doesn't contain exactly one operation
 */
export const getDefinitions = (document: DocumentNode): DocumentDefinition => {
  const operation = getOperationAST(document)

  if (!operation) {
    throw new Error('Document does not contain exactly one operation')
  }

  return {
    operation,
    fragments: getFragments(document),
  }
}
