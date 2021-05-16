import { GraphQLBoolean, GraphQLList, GraphQLNonNull } from 'graphql'

import { toNamedType } from '../toNamedType'

describe('toNamedType tests', () => {
  it('should return the named type', () => {
    // Arrange
    const namedType = GraphQLBoolean

    // Act
    const result = toNamedType(namedType)

    // Assert
    expect(result).toBe(namedType)
  })

  it('should return the named type from a wrapped type', () => {
    // Arrange
    const namedType = GraphQLBoolean
    const wrappedType = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(namedType)))

    // Act
    const result = toNamedType(wrappedType)

    // Assert
    expect(result).toBe(namedType)
  })
})
