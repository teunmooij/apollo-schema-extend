import { mergeSchemas } from 'apollo-server-express'
import { DocumentNode, GraphQLSchema, parse, printSchema } from 'graphql'

export const mergeTypeDefs = (
  original: string | DocumentNode | readonly (string | DocumentNode)[],
  external: GraphQLSchema
) => {
  const internal = Array.isArray(original) ? original : [original]
  const mergedSchema = mergeSchemas({ schemas: [...internal, external] })
  return parse(printSchema(mergedSchema))
}
