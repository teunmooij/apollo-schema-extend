import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Movie {
    rating: String
  }
`
