import { ApolloError, IFieldResolver, IResolvers } from 'apollo-server-express'
import { GraphQLInterfaceType, GraphQLSchema, GraphQLUnionType } from 'graphql'
import { mapObjIndexed, mergeDeepLeft, objOf } from 'ramda'
import { createOperation } from './operation/createOperation'
import { DataSource, Options, PostOperationFn, RemapRule } from './withExternalSchema.types'

export const mergeResolvers = (original: IResolvers, schema: GraphQLSchema, options: Options): IResolvers => {
  return mergeDeepLeft(original, {
    ...getQueryResolvers(schema, options),
    ...getMutationResolvers(schema, options),
    ...getTypeResolvers(schema),
  })
}

const getQueryResolvers = (schema: GraphQLSchema, options: Options) => {
  const queryFields = schema.getQueryType()?.getFields()
  return queryFields
    ? {
        Query: mapObjIndexed(
          (_, field) =>
            createResolver(
              schema,
              field,
              options.dataSource.name,
              (options.postQuery && options.postQuery[field]) || options.defaultPostQuery,
              options.remapRules
            ),
          queryFields
        ),
      }
    : {}
}

const getMutationResolvers = (schema: GraphQLSchema, options: Options) => {
  const mutationFields = schema.getMutationType()?.getFields()
  return mutationFields
    ? {
        Mutation: mapObjIndexed(
          (_, field) =>
            createResolver(
              schema,
              field,
              options.dataSource.name,
              (options.postMutation && options.postMutation[field]) || options.defaultPostMutation,
              options.remapRules
            ),
          mutationFields
        ),
      }
    : {}
}

const defaultPostOperation: PostOperationFn = ({ errors, data }, { field }) => {
  if (errors || !data) {
    throw new ApolloError(`Cannot resolve field ${field}.`, undefined, { errors })
  }

  return data[field]
}

const createResolver = <TField extends string, TDataSource extends string>(
  schema: GraphQLSchema,
  field: TField,
  dataSourceName: TDataSource,
  postOperation: PostOperationFn = defaultPostOperation,
  remapRules: Partial<Record<string, RemapRule>> = {}
): IFieldResolver<unknown, { dataSources: Record<TDataSource, DataSource<unknown>> }> => async (
  _,
  __,
  context,
  info
) => {
  if (info.operation.operation === 'subscription') {
    throw new Error('Operations of type subscription are not yet supported')
  }

  const fetchResult = await context.dataSources[dataSourceName][info.operation.operation](
    createOperation(info, schema, remapRules),
    {
      variables: info.variableValues,
    }
  )

  return postOperation(fetchResult, { context, info, field })
}

const getTypeResolvers = (schema: GraphQLSchema) => {
  const typeMap = schema.getTypeMap()
  const typeResolvers = Object.entries(typeMap)
    .filter(entry => entry[1] instanceof GraphQLInterfaceType || entry[1] instanceof GraphQLUnionType)
    .reduce((total, next) => {
      total[next[0]] = {
        __resolveType(entity) {
          return entity.__typename
        },
      }
      return total
    }, {} as Record<string, { __resolveType: (entity: { __typename: string }) => string }>)
  return typeResolvers
}
