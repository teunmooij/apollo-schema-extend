import { Kind } from 'graphql'
import { createField } from '../fieldNode'

describe('ast fields', () => {
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

    it('should create a field ast', () => {
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
})
