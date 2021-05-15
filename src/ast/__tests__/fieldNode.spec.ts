import { Kind } from 'graphql'
import { clone } from 'ramda'
import { createField, withSelections } from '../fieldNode'

describe('fieldNode tests', () => {
  describe('create field', () => {
    it('should create a field ast', () => {
      // Arrange
      const fieldName = 'myField'

      // Act
      const field = createField(fieldName)

      // Assert
      expect(field.alias).toBeUndefined()
      expect(field.kind).toBe(Kind.FIELD)
      expect(field.name).toBeDefined()
      expect(field.name.value).toBe(fieldName)
      expect(field.name.kind).toBe(Kind.NAME)
      expect(field.selectionSet).toBeUndefined()
    })

    it('should create a field ast with alias', () => {
      // Arrange
      const fieldName = 'myOtherField'
      const alias = 'myFIeldAlias'

      // Act
      const field = createField(fieldName, alias)

      // Assert
      expect(field.alias).toBeDefined()
      expect(field.alias!.value).toBe(alias)
      expect(field.alias!.kind).toBe(Kind.NAME)
      expect(field.kind).toBe(Kind.FIELD)
      expect(field.name).toBeDefined()
      expect(field.name.value).toBe(fieldName)
      expect(field.name.kind).toBe(Kind.NAME)
      expect(field.selectionSet).toBeUndefined()
    })
  })

  describe('with selections', () => {
    it('should replace the selections', () => {
      // Arrange
      const node = createField('root')
      const copy = clone(node)
      const selections = [createField('child1'), createField('child2')]

      // Act
      const result = withSelections(node, selections)

      // Assert
      expect(result.selectionSet).toBeDefined()
      expect(result.selectionSet?.selections).toBe(selections)

      expect(node.selectionSet).toBeUndefined()
      expect(node).toEqual(copy) //Make sure node has not been altered
    })
  })
})
