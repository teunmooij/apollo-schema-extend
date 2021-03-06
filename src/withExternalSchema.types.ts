import { DataSource as ApolloDataSource } from 'apollo-datasource'
import { FetchResult, GraphQLRequest } from 'apollo-link'
import { DocumentNode, FieldNode, GraphQLResolveInfo } from 'graphql'

export type PostOperationFn<TData = unknown, TContext = unknown> = (
  fetchResult: FetchResult<Record<string, TData>>,
  info: {
    context: TContext
    info: GraphQLResolveInfo
    field: string
  }
) => TData

export type RemapRule = (
  node: FieldNode,
  info: {
    unfilteredNode: FieldNode
    resolveInfo: GraphQLResolveInfo
  }
) => FieldNode

export type DataSource<TContext> = ApolloDataSource<TContext> & {
  query: (query: DocumentNode, options?: Omit<GraphQLRequest, 'query'>) => Promise<FetchResult>
  mutation: (mutation: DocumentNode, options?: Omit<GraphQLRequest, 'query'>) => Promise<FetchResult>
}

export interface Options<TContext = any> {
  dataSource: {
    name: string
    factory: (dataSources: { [name: string]: ApolloDataSource }) => DataSource<TContext>
  }
  postQuery?: { [field: string]: PostOperationFn<unknown, TContext> }
  postMutation?: { [field: string]: PostOperationFn<unknown, TContext> }
  defaultPostQuery?: PostOperationFn<unknown, TContext>
  defaultPostMutation?: PostOperationFn<unknown, TContext>
  remapRules?: Partial<Record<string, RemapRule>>
}
