import { Kind } from 'graphql'
import gql from 'graphql-tag'
import { clone } from 'ramda'
import { isNodeKind, createField, isFieldNode } from '../../ast'
import { getResolverScopedOperation } from '../getResolverScopedOperation'

describe('getResolverScopedOperation tests', () => {
  it('should return an operation scoped to the current resolver', () => {
    // Arrange
    const inScope = 'myOtherField'
    const query = gql`
      query {
        myField
        ${inScope}
      }
    `
    const operation = query.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!
    const copy = clone(operation)
    const field = createField(inScope)

    // Act
    const result = getResolverScopedOperation({ operation, fieldNodes: [field] })

    // Assert
    expect(result.selectionSet!.selections).toHaveLength(1)
    const selection = result.selectionSet!.selections[0]

    if (isFieldNode(selection)) {
      expect(selection.name.value).toEqual(inScope)
    } else {
      fail()
    }

    expect(operation).toEqual(copy) // Make sure operation has not been altered
  })
})
