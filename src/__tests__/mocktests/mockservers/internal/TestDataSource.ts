import { DataSource as ApolloDataSource } from 'apollo-datasource'
import { ApolloServerTestClient } from 'apollo-server-testing'
import { FetchResult, GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'

export class TestDataSource extends ApolloDataSource {
  private client: ApolloServerTestClient

  public constructor(client: ApolloServerTestClient) {
    super()
    this.client = client
  }

  public query(query: DocumentNode, options?: Omit<GraphQLRequest, 'query'>): Promise<FetchResult> {
    return this.client.query({ query, ...options }) as Promise<FetchResult>
  }

  public mutation(mutation: DocumentNode, options?: Omit<GraphQLRequest, 'query'>): Promise<FetchResult> {
    return this.client.mutate({ mutation, ...options }) as Promise<FetchResult>
  }
}
