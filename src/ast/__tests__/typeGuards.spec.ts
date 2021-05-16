import { ASTKindToNode, ASTNode, FieldNode, Kind } from 'graphql'
import { createField } from '../fieldNode'
import { hasArguments, hasDirectives, hasSelectionSet, isNodeKind } from '../typeGuards'

describe('typeGuards tests', () => {
  describe('isNodeKind', () => {
    it('should be true when given a node of the required kind', () => {
      Object.keys(Kind).forEach(kind => {
        // Arrange
        const node = ({ kind } as unknown) as ASTNode

        // Act
        const result = isNodeKind(kind as keyof ASTKindToNode, node)

        // Assert
        expect(result).toBe(true)
      })
    })

    it('should be true when created typeguard is given a node of the required kind', () => {
      Object.keys(Kind).forEach(kind => {
        // Arrange
        const node = ({ kind } as unknown) as ASTNode

        // Act
        const guard = isNodeKind(kind as keyof ASTKindToNode)
        const result = guard(node)

        // Assert
        expect(result).toBe(true)
      })
    })

    it('should be false when given a node that is not of the required kind', () => {
      Object.keys(Kind).forEach(kind => {
        Object.keys(Kind).forEach(nodeKind => {
          // Arrange
          const node = ({ kind: nodeKind } as unknown) as ASTNode

          // Act
          const result = isNodeKind(kind as keyof ASTKindToNode, node)

          // Assert
          expect(result).toBe(kind === nodeKind)
        })
      })
    })

    it('should be false when created typeguard is given a node that is not of the required kind', () => {
      Object.keys(Kind).forEach(kind => {
        Object.keys(Kind).forEach(nodeKind => {
          // Arrange
          const node = ({ kind: nodeKind } as unknown) as ASTNode

          // Act
          const guard = isNodeKind(kind as keyof ASTKindToNode)
          const result = guard(node)

          // Assert
          expect(result).toBe(kind === nodeKind)
        })
      })
    })
  })

  describe('hasArguments', () => {
    it('should be true when given node has arguments', () => {
      // Arrange
      const node: FieldNode = {
        ...createField('myNode'),
        arguments: [
          {
            kind: Kind.ARGUMENT,
            name: { kind: Kind.NAME, value: 'myArgument' },
            value: { kind: Kind.STRING, value: 'abc' },
          },
        ],
      }

      // Act
      const result = hasArguments(node)

      // Assert
      expect(result).toBe(true)
    })

    it('should be false when given node has empty list of arguments', () => {
      // Arrange
      const node: FieldNode = {
        ...createField('myNode'),
        arguments: [],
      }

      // Act
      const result = hasArguments(node)

      // Assert
      expect(result).toBe(false)
    })

    it('should be false when given node has no arguments', () => {
      // Arrange
      const node: FieldNode = {
        ...createField('myNode'),
        arguments: undefined,
      }

      // Act
      const result = hasArguments(node)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('hasDirectives', () => {
    it('should be true when given node has directives', () => {
      // Arrange
      const node: FieldNode = {
        ...createField('myNode'),
        directives: [
          {
            kind: Kind.DIRECTIVE,
            name: { kind: Kind.NAME, value: 'myDirective' },
          },
        ],
      }

      // Act
      const result = hasDirectives(node)

      // Assert
      expect(result).toBe(true)
    })

    it('should be false when given node has empty list of directives', () => {
      // Arrange
      const node: FieldNode = {
        ...createField('myNode'),
        directives: [],
      }

      // Act
      const result = hasDirectives(node)

      // Assert
      expect(result).toBe(false)
    })

    it('should be false when given node has no directives', () => {
      // Arrange
      const node: FieldNode = {
        ...createField('myNode'),
        directives: undefined,
      }

      // Act
      const result = hasDirectives(node)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('hasSelectionSet', () => {
    it('should be true when given node has selectionSet', () => {
      // Arrange
      const node: FieldNode = {
        ...createField('myNode'),
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [createField('myChild')],
        },
      }

      // Act
      const result = hasSelectionSet(node)

      // Assert
      expect(result).toBe(true)
    })

    it('should be true when given node has empty selectionSet', () => {
      // Arrange
      const node: FieldNode = {
        ...createField('myNode'),
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [],
        },
      }

      // Act
      const result = hasSelectionSet(node)

      // Assert
      expect(result).toBe(true)
    })

    it('should be false when given node has no selectionSet', () => {
      // Arrange
      const node: FieldNode = {
        ...createField('myNode'),
        selectionSet: undefined,
      }

      // Act
      const result = hasSelectionSet(node)

      // Assert
      expect(result).toBe(false)
    })
  })
})
