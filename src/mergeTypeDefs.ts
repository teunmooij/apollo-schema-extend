import { mergeSchemas } from 'apollo-server-express'
import { DocumentNode, GraphQLSchema, parse, printSchema } from 'graphql'

export const mergeTypeDefs = (original: readonly DocumentNode[], external: GraphQLSchema) => {
  const mergedSchema = mergeSchemas({ schemas: [...original, external] })
  return parse(printSchema(mergedSchema))
}
