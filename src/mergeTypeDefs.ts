import { mergeSchemas } from 'apollo-server-express'
import { DocumentNode, GraphQLSchema, Kind, parse, printSchema } from 'graphql'

export const mergeTypeDefs = (
  original: string | DocumentNode | readonly (string | DocumentNode)[],
  external: GraphQLSchema
) => {
  const internal = Array.isArray(original) ? original : [original]
  const mergedSchema = mergeSchemas({ schemas: [...internal, external] })
  const mergedTypeDefs = parse(printSchema(mergedSchema))
  return withoutApolloTypes(mergedTypeDefs)
}

const apolloTypes = [
  { name: 'CacheControlScope', kind: Kind.ENUM_TYPE_DEFINITION },
  { name: 'Upload', kind: Kind.SCALAR_TYPE_DEFINITION },
]

const withoutApolloTypes = (typeDefs: DocumentNode): DocumentNode => ({
  ...typeDefs,
  definitions: typeDefs.definitions.filter(
    definition => !apolloTypes.some(type => definition.kind === type.kind && definition.name.value === type.name)
  ),
})
