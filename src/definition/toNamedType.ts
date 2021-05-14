import { GraphQLNamedType, GraphQLOutputType, isWrappingType } from 'graphql'

export const toNamedType = (field: GraphQLOutputType): GraphQLNamedType => {
  if (isWrappingType(field)) {
    return toNamedType(field.ofType)
  }
  return field
}
