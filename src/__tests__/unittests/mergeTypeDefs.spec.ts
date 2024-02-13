import { buildASTSchema, print } from 'graphql'
import gql from 'graphql-tag'

import { mergeTypeDefs } from '../../mergeTypeDefs'

describe('mergeTypeDefs tests', () => {
  it('should merge the schemas', () => {
    // Arrange
    const original = [
      gql`
        type Query {
          hello: Greeting
        }
      `,
      `
        type Greeting {
          value: String
        }
      `,
    ]

    const external = buildASTSchema(gql`
      type Query {
        ping: String
      }
    `)

    // Act
    const result = mergeTypeDefs(original, external)

    console.log(print(result))

    // Assert
    const expected = gql`
      type Query {
        hello: Greeting
        ping: String
      }
      type Greeting {
        value: String
      }
      schema {
        query: Query
      }
    `

    expect(print(result)).toEqual(print(expected))
  })

  it('should merge the schemas where original is single document node', () => {
    // Arrange
    const original = gql`
      type Query {
        hello: Greeting
      }
      type Greeting {
        value: String
      }
    `

    const external = buildASTSchema(gql`
      type Query {
        ping: String
      }
    `)

    // Act
    const result = mergeTypeDefs(original, external)

    // Assert
    const expected = gql`
      type Query {
        hello: Greeting
        ping: String
      }
      type Greeting {
        value: String
      }
      schema {
        query: Query
      }
    `

    expect(print(result)).toEqual(print(expected))
  })
})
