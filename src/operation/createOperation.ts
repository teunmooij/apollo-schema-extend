import { DocumentNode, GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { getFilteredDefinition } from './getFilteredDefinition'
import { getResolverScopedOperation } from './getResolverScopedOperation'
import { toDocumentNode } from '../ast'
import { RemapRule } from '../withExternalSchema.types'

export const createOperation = (
  info: GraphQLResolveInfo,
  schema: GraphQLSchema,
  remapRules: Partial<Record<string, RemapRule>>
): DocumentNode => {
  const operation = getResolverScopedOperation(info)
  const filteredOperation = getFilteredDefinition(operation, info, schema, remapRules)
  return toDocumentNode(filteredOperation)
}
