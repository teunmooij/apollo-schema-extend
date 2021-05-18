import { buildASTSchema, GraphQLResolveInfo, Kind, print } from 'graphql'
import gql from 'graphql-tag'
import { createField, isNodeKind } from '../../ast'
import { createOperation } from '../createOperation'

describe('createOperation tests', () => {
  const schema = buildASTSchema(gql`
    type Query {
      ping: String
      book(id: ID!): Book
    }

    type Book {
      id: ID!
      title: String
    }

    input BookInput {
      title: String
    }

    type Mutation {
      addBook(book: BookInput): Book!
    }
  `)

  it('should create filter query scoped to the current resolver', () => {
    // Arrange
    const resolverField = 'book'
    const query = gql`
      query myQuery {
        ping
        book(id: "123") {
          id
          title
          genre
        }
      }
    `

    const info = ({
      operation: query.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!,
      fieldNodes: [createField(resolverField)],
      fragments: {},
    } as unknown) as GraphQLResolveInfo

    // Act
    const result = createOperation(info, schema, {})

    // Assert
    const expected = gql`
      query myQuery {
        book(id: "123") {
          id
          title
        }
      }
    `

    expect(print(result)).toEqual(print(expected))
  })

  it('should create filter query scoped to the current resolver', () => {
    // Arrange
    const resolverField = 'addBook'
    const mutation = gql`
      mutation myMutation {
        addBook(book: { title: "GraphQL for dummies" }) {
          id
          title
          genre
        }
      }
    `

    const info = ({
      operation: mutation.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!,
      fieldNodes: [createField(resolverField)],
      fragments: {},
    } as unknown) as GraphQLResolveInfo

    // Act
    const result = createOperation(info, schema, {})

    // Assert
    const expected = gql`
      mutation myMutation {
        addBook(book: { title: "GraphQL for dummies" }) {
          id
          title
        }
      }
    `

    expect(print(result)).toEqual(print(expected))
  })
})
