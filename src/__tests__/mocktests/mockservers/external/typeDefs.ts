import gql from 'graphql-tag'

export const typeDefs = gql`
  type Query {
    movies: [Movie!]!
  }

  type Movie {
    id: ID!
    title: String!
    genre: MovieGenre!
    description: String
  }

  enum MovieGenre {
    Action
    Comedy
    Horror
    ScienceFiction
  }
`
