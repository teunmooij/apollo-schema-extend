import { ASTNode, DocumentNode, FieldNode, Kind } from 'graphql'
import { createNodeGuard } from '../nodeTypeGuards'

describe('nodeTypeGuards', () => {
  it('should create a typeguard for the given node type', () => {
    // Arrange
    const fieldNode: ASTNode = {
      kind: Kind.FIELD,
      name: {
        kind: Kind.NAME,
        value: 'myField',
      },
    } as ASTNode

    const documentNode: ASTNode = {
      kind: Kind.DOCUMENT,
      definitions: [],
    }

    // Act
    const fieldGuard = createNodeGuard<FieldNode>(Kind.FIELD)

    // Assert
    expect(fieldGuard(fieldNode)).toBe(true)
    expect(fieldGuard(documentNode)).toBe(false)

    if (!fieldGuard(fieldNode)) {
      throw 'This should never happen'
    }

    //If the guard is just a normal function that returns a boolean, next line gives a compile error
    expect(fieldNode.name.value).toBeDefined()
  })
})
