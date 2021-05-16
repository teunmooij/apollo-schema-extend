import { buildASTSchema, GraphQLResolveInfo, Kind } from 'graphql'
import gql from 'graphql-tag'
import { clone } from 'ramda'
import { isNodeKind } from '../../ast'

import { getFilteredDefinition } from '../getFilteredDefinition'

describe('getFilteredDefinition tests', () => {
  const schema = buildASTSchema(gql`
    type Query {
      book(id: ID!): Book
      author(id: ID!): Author
    }

    interface Book {
      id: ID!
      title: String
      author: Author
    }

    type Author {
      id: ID!
      name: String
      books: [Book!]!
    }

    enum Genre {
      Detective
      SciFi
      Fantasy
    }

    type Novel implements Book {
      id: ID!
      title: String
      author: Author
      genre: Genre
    }

    type ReferenceBook implements Book {
      id: ID!
      title: String
      author: Author
      isbn: String
    }
  `)

  it('should remove fields that are not in the schema', () => {
    // Arrange
    const query = gql`
      query myQuery($bookId: ID!, $currency: String!) {
        book(id: $bookId) {
          id
          title
          prize(currency: $currency)
          __typename
        }
      }
    `

    const copy = clone(query.definitions)
    const operation = query.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!
    const resolveInfo = { fragments: {} } as GraphQLResolveInfo

    // Act
    const result = getFilteredDefinition(operation, resolveInfo, schema, {})

    // Assert
    const expected = gql`
      query myQuery($bookId: ID!, $currency: String!) {
        book(id: $bookId) {
          id
          title
          __typename
        }
      }
    `

    expect(result).toEqual({
      operation: expected.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!,
      fragments: {},
    })
    expect(query.definitions).toEqual(copy) // Make sure query has not been altered
  })
})
