import { ApolloServerExpressConfig, IResolvers } from 'apollo-server-express'
import { DataSource } from 'apollo-datasource'
import { DocumentNode, GraphQLSchema } from 'graphql'
import { mergeResolvers } from './mergeResolvers'
import { mergeTypeDefs } from './mergeTypeDefs'
import { Options } from './withExternalSchema.types'

export const withExternalSchema = <TContext = unknown>(schema: GraphQLSchema, options: Options<TContext>) => (
  config: ApolloServerExpressConfig
): ApolloServerExpressConfig => {
  if (!isSupportedConfig(config)) {
    throw new Error('This config is not supported')
  }

  const { dataSource } = options

  const dataSources = () => {
    const sources = config.dataSources()
    return {
      ...sources,
      [dataSource.name]: dataSource.factory(sources) as DataSource<object>,
    }
  }

  return {
    ...config,
    typeDefs: mergeTypeDefs(config.typeDefs, schema),
    resolvers: mergeResolvers(config.resolvers, schema, options),
    dataSources,
  }
}

const isSupportedConfig = (
  config: ApolloServerExpressConfig
): config is ApolloServerExpressConfig &
  Required<Pick<ApolloServerExpressConfig, 'dataSources'>> & {
    resolvers: IResolvers
    typeDefs: DocumentNode[]
  } => {
  const requiredFieldsProvided = !!config.resolvers && !!config.typeDefs && !!config.dataSources
  return requiredFieldsProvided && !Array.isArray(config.resolvers)
}
