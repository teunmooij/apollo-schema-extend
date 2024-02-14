import { FragmentDefinitionNode, Kind, print } from 'graphql'
import gql from 'graphql-tag'

import { toDocumentNode } from '../toDocumentNode'
import { isNodeKind } from '../typeGuards'

describe('toDocumentNode tests', () => {
  it('should construct a documentNode from provided operation', () => {
    // Arrange
    const original = gql`
      query myQuery {
        selection {
          field
        }
      }
    `
    const operation = original.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!

    // Act
    const result = toDocumentNode({ operation, fragments: {} })

    // Assert
    expect(print(result)).toEqual(print(original))
  })

  it('should construct a documentNode from provided operation with fragments', () => {
    // Arrange
    const original = gql`
      query myQuery {
        selection {
          ...fr
        }
      }
      fragment fr on Selection {
        field
      }
    `
    const operation = original.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!
    const fragments = original.definitions.filter(isNodeKind(Kind.FRAGMENT_DEFINITION)).reduce(
      (total, next) => {
        total[next.name.value] = next
        return total
      },
      {} as Record<string, FragmentDefinitionNode>
    )

    // Act
    const result = toDocumentNode({ operation, fragments })

    // Assert
    expect(print(result)).toEqual(print(original))
  })

  it('should not include unused fragments', () => {
    // Arrange
    const original = gql`
      query myQuery {
        selection {
          ...one
        }
      }
      fragment one on Selection {
        field
      }
      fragment other on Selection {
        test
      }
    `
    const operation = original.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!
    const fragments = original.definitions.filter(isNodeKind(Kind.FRAGMENT_DEFINITION)).reduce(
      (total, next) => {
        total[next.name.value] = next
        return total
      },
      {} as Record<string, FragmentDefinitionNode>
    )

    // Act
    const result = toDocumentNode({ operation, fragments })

    // Assert
    const resultFragments = result.definitions.filter(isNodeKind(Kind.FRAGMENT_DEFINITION))
    expect(resultFragments).toHaveLength(1)
    expect(resultFragments[0].name.value).toEqual('one')
  })

  it('should not include unused variables', () => {
    // Arrange
    const original = gql`
      query myQuery($id: ID!, $var: ID!) {
        selection(id: $var) {
          field
        }
      }
    `
    const operation = original.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!

    // Act
    const result = toDocumentNode({ operation, fragments: {} })

    // Assert
    const resultOperation = result.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!
    expect(resultOperation.variableDefinitions).toHaveLength(1)
    expect(resultOperation.variableDefinitions![0].variable.name.value).toEqual('var')
  })
})
