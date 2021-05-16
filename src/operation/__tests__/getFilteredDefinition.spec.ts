import { buildASTSchema, DocumentNode, FieldNode, FragmentDefinitionNode, GraphQLResolveInfo, Kind } from 'graphql'
import gql from 'graphql-tag'
import { clone } from 'ramda'
import { createField, DocumentDefinition, isFieldNode, isNodeKind } from '../../ast'

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

  const toDocumentDefinition = (document: DocumentNode): DocumentDefinition => ({
    operation: document.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!,
    fragments: document.definitions.filter(isNodeKind(Kind.FRAGMENT_DEFINITION)).reduce((total, next) => {
      total[next.name.value] = next
      return total
    }, {} as Partial<Record<string, FragmentDefinitionNode>>),
  })

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
    const { operation, fragments } = toDocumentDefinition(query)
    const resolveInfo = { fragments } as GraphQLResolveInfo

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

    expect(result).toEqual(toDocumentDefinition(expected))
    expect(query.definitions).toEqual(copy) // Make sure query has not been altered
  })

  it('should remove fields that are not in the schema from fragment', () => {
    // Arrange
    const query = gql`
      query myQuery($bookId: ID!, $currency: String!) {
        book(id: $bookId) {
          id
          title
          ...novel
          __typename
        }
      }
      fragment novel on Novel {
        genre
        prize(currency: $currency)
      }
    `

    const { operation, fragments } = toDocumentDefinition(query)
    const resolveInfo = {
      fragments,
    } as GraphQLResolveInfo

    // Act
    const result = getFilteredDefinition(operation, resolveInfo, schema, {})

    // Assert
    const expected = gql`
      query myQuery($bookId: ID!, $currency: String!) {
        book(id: $bookId) {
          id
          title
          ...novel
          __typename
        }
      }
      fragment novel on Novel {
        genre
      }
    `

    expect(result).toEqual(toDocumentDefinition(expected))
  })

  it('should query __typename on abstract type', () => {
    // Arrange
    const query = gql`
      query myQuery($bookId: ID!) {
        book(id: $bookId) {
          id
          title
        }
      }
    `

    const { operation, fragments } = toDocumentDefinition(query)
    const resolveInfo = { fragments } as GraphQLResolveInfo

    // Act
    const result = getFilteredDefinition(operation, resolveInfo, schema, {})

    // Assert
    const expected = gql`
      query myQuery($bookId: ID!) {
        book(id: $bookId) {
          id
          title
          __typename
        }
      }
    `
    expect(result).toEqual(toDocumentDefinition(expected))
  })

  it('should add __typename to fragment spread that does not include schema field', () => {
    // Arrange
    const query = gql`
      query myQuery($bookId: ID!, $currency: String!) {
        book(id: $bookId) {
          id
          title
          ...novel
          __typename
        }
      }
      fragment novel on Novel {
        prize(currency: $currency)
      }
    `

    const { operation, fragments } = toDocumentDefinition(query)
    const resolveInfo = {
      fragments,
    } as GraphQLResolveInfo

    // Act
    const result = getFilteredDefinition(operation, resolveInfo, schema, {})

    // Assert
    const expected = gql`
      query myQuery($bookId: ID!, $currency: String!) {
        book(id: $bookId) {
          id
          title
          ...novel
          __typename
        }
      }
      fragment novel on Novel {
        __typename
      }
    `

    expect(result).toEqual(toDocumentDefinition(expected))
  })

  it('should filter inline fragment', () => {
    const query = gql`
      query myQuery($bookId: ID!, $currency: String!) {
        book(id: $bookId) {
          id
          title
          ... on Novel {
            genre
            prize(currency: $currency)
          }
        }
      }
    `

    const { operation, fragments } = toDocumentDefinition(query)
    const resolveInfo = { fragments } as GraphQLResolveInfo

    // Act
    const result = getFilteredDefinition(operation, resolveInfo, schema, {})

    // Assert
    const expected = gql`
      query myQuery($bookId: ID!, $currency: String!) {
        book(id: $bookId) {
          id
          title
          ... on Novel {
            genre
          }
          __typename
        }
      }
    `

    expect(result).toEqual(toDocumentDefinition(expected))
  })

  it('should remove fragment that is for unsupported type', () => {
    // Arrange
    const query = gql`
      query myQuery($bookId: ID!) {
        book(id: $bookId) {
          id
          ...dictionary
        }
      }
      fragment dictionary on Dictionary {
        title
        languages
      }
    `

    const { operation, fragments } = toDocumentDefinition(query)
    const resolveInfo = {
      fragments,
    } as GraphQLResolveInfo

    // Act
    const result = getFilteredDefinition(operation, resolveInfo, schema, {})

    // Assert
    const expected = gql`
      query myQuery($bookId: ID!) {
        book(id: $bookId) {
          id
          __typename
        }
      }
    `

    expect(result).toEqual(toDocumentDefinition(expected))
  })

  it('should throw error if operation is not in schema', () => {
    // Arrange
    const mutation = gql`
    mutation addBookMutation($book: BookInput!){
      addBook(book: $book) {
        id
      }
    }
    `

    const { operation, fragments } = toDocumentDefinition(mutation)
    const resolveInfo = {
      fragments,
    } as GraphQLResolveInfo

    // Act
    const action = () => getFilteredDefinition(operation, resolveInfo, schema, {})

    // Assert
    expect(action).toThrow('operation mutation is not supported by the schema')
  })
})
