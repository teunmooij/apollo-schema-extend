import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { DocumentNode } from 'graphql'
import { VariableValues } from 'apollo-server-types'

export const createClient = (server: ApolloServer<ExpressContext>) => {
  return {
    async query({ query, variables }: { query: string | DocumentNode; variables?: VariableValues }) {
      const response = await server.executeOperation({ query, variables })
      return response
    },
    async mutate({ mutation, variables }: { mutation: string | DocumentNode; variables?: VariableValues }) {
      const response = await server.executeOperation({ query: mutation, variables })
      return response
    },
  }
}

export type Client = ReturnType<typeof createClient>
