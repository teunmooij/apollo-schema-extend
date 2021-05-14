import { DocumentNode, GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { getFilteredDefinition } from './getFilteredDefinition'
import { getResolerScopedOperation } from './getResolerScopedOperation'
import { toDocumentNode } from '../ast'
import { RemapRule } from '../withExternalSchema.types'

export const createOperation = (
  info: GraphQLResolveInfo,
  schema: GraphQLSchema,
  remapRules: Partial<Record<string, RemapRule>>
): DocumentNode => {
  const operation = getResolerScopedOperation(info)
  const filteredOperation = getFilteredDefinition(operation, info, schema, remapRules)
  return toDocumentNode(filteredOperation)
}
