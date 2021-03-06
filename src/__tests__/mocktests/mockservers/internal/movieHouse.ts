import { ApolloServer } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-testing'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'

import { withExternalSchema } from '../../../../'
import { movieDatabase } from '../external/movieDatabase'
import { TestDataSource } from './TestDataSource'

import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'

export const getMovieHouseServer = async () => {
  const movieDatabaseClient = createTestClient(movieDatabase)
  const introspectionResult = await movieDatabaseClient.query({
    query: getIntrospectionQuery(),
  })

  const movieSchema = buildClientSchema(introspectionResult.data)
  const withMovieDatabase = withExternalSchema(movieSchema, {
    dataSource: {
      name: 'movieDatabase',
      factory: () => new TestDataSource(movieDatabaseClient),
    },
  })

  return new ApolloServer(withMovieDatabase({ typeDefs, resolvers, dataSources: () => ({}) }))
}
