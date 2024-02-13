import { ApolloServer } from 'apollo-server-express'
import { IntrospectionQuery, buildClientSchema, getIntrospectionQuery } from 'graphql'

import { withExternalSchema } from '../../../../'
import { movieDatabase } from '../external/movieDatabase'
import { TestDataSource } from './TestDataSource'

import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import { createClient } from '../createMockClient'

export const getMovieHouseServer = async () => {
  const movieDatabaseClient = createClient(movieDatabase)
  const introspectionResult = await movieDatabaseClient.query({
    query: getIntrospectionQuery(),
  })

  const movieSchema = buildClientSchema(introspectionResult.data as IntrospectionQuery)
  const withMovieDatabase = withExternalSchema(movieSchema, {
    dataSource: {
      name: 'movieDatabase',
      factory: () => new TestDataSource(movieDatabaseClient),
    },
  })

  return new ApolloServer(withMovieDatabase({ typeDefs, resolvers, dataSources: () => ({}) }))
}
