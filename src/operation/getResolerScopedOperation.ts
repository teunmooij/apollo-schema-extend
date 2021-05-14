import { GraphQLResolveInfo, OperationDefinitionNode } from 'graphql'
import { isFieldNode } from '../ast'

export const getResolerScopedOperation = ({ operation, fieldNodes }: GraphQLResolveInfo): OperationDefinitionNode => {
  const resolvingFieldNames = fieldNodes.map(node => node.name.value)
  const selections = operation.selectionSet.selections.filter(
    selection => isFieldNode(selection) && resolvingFieldNames.includes(selection.name.value)
  )

  return {
    ...operation,
    selectionSet: {
      ...operation.selectionSet,
      selections,
    },
  }
}
