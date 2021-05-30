import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'

export const movieDatabase = new ApolloServer({ typeDefs, resolvers })
