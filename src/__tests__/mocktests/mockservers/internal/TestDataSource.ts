import { DataSource as ApolloDataSource } from 'apollo-datasource'
import { FetchResult, GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'
import { TestClient } from '../createMockClient'

export class TestDataSource extends ApolloDataSource {
  private client: TestClient

  public constructor(client: TestClient) {
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
