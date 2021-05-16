import { GraphQLResolveInfo, OperationDefinitionNode } from 'graphql'
import { isFieldNode, withSelections } from '../ast'

export const getResolverScopedOperation = ({
  operation,
  fieldNodes,
}: Pick<GraphQLResolveInfo, 'operation' | 'fieldNodes'>): OperationDefinitionNode => {
  const resolvingFieldNames = fieldNodes.map(node => node.name.value)
  const selections = operation.selectionSet.selections.filter(
    selection => isFieldNode(selection) && resolvingFieldNames.includes(selection.name.value)
  )

  return withSelections(operation, selections)
}
