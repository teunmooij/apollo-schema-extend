import gql from 'graphql-tag'
import { FieldNode, Kind } from 'graphql'
import { getDefinitions, getFragments, getOperation } from '../definitions'

describe('ast-definitions', () => {
  it('should get the operation', () => {
    // Arrange
    const queryName = 'myQuery'
    const rootName = 'test'

    const ast = gql`
            query ${queryName} {
                ${rootName} {
                    id
                }
            }
        `

    // Act
    const operation = getOperation(ast)

    // Assert
    expect(operation).toBeDefined()
    expect(operation!.name!.value).toBe(queryName)
    expect(operation!.selectionSet.selections).toHaveLength(1)
    expect(operation!.kind).toBe(Kind.OPERATION_DEFINITION)
    const field = operation!.selectionSet.selections[0] as FieldNode
    expect(field.kind).toBe(Kind.FIELD)
    expect(field.name.value).toBe(rootName)
  })

  it('should get the fragments', () => {
    // Arrange
    const fragmentName = 'myFragment'
    const typeName = 'Test'

    const ast = gql`
        fragment ${fragmentName} on ${typeName}  {
          id
        }
        `
    // Act
    const fragments = getFragments(ast)

    // Assert
    expect(Object.keys(fragments)).toHaveLength(1)
    const fragment = fragments[fragmentName]!
    expect(fragment).toBeDefined()
    expect(fragment.kind).toBe(Kind.FRAGMENT_DEFINITION)
    expect(fragment.name.value).toBe(fragmentName)
    expect(fragment.typeCondition.name.value).toBe(typeName)
  })

  it('should get the definitions', () => {
    // Arrange
    const queryName = 'myQuery'
    const rootName = 'test'
    const fragmentName = 'myFragment'
    const typeName = 'Test'

    const ast = gql`
            query ${queryName} {
                ${rootName} {
                  ...${fragmentName}
                }
            }
            fragment ${fragmentName} on ${typeName}  {
                id
            }
        `

    // Act
    const { operation, fragments } = getDefinitions(ast)

    // Assert
    expect(operation).toBeDefined()
    expect(operation!.name!.value).toBe(queryName)
    expect(operation!.selectionSet.selections).toHaveLength(1)
    expect(operation!.kind).toBe(Kind.OPERATION_DEFINITION)
    const field = operation!.selectionSet.selections[0] as FieldNode
    expect(field.kind).toBe(Kind.FIELD)
    expect(field.name.value).toBe(rootName)

    expect(Object.keys(fragments)).toHaveLength(1)
    const fragment = fragments[fragmentName]!
    expect(fragment).toBeDefined()
    expect(fragment.kind).toBe(Kind.FRAGMENT_DEFINITION)
    expect(fragment.name.value).toBe(fragmentName)
    expect(fragment.typeCondition.name.value).toBe(typeName)
  })

  it('should throw if document has no operation', () => {
    // Arrange
    const fragmentName = 'myFragment'
    const typeName = 'Test'

    const ast = gql`
            fragment ${fragmentName} on ${typeName}  {
                id
            }
        `

    // Act
    const action = () => getDefinitions(ast)

    // Assert
    expect(action).toThrow('Document does not contain exactly one operation')
  })

  it('should throw if document has multiple operations', () => {
    // Arrange
    const queryName = 'myQuery'
    const rootName = 'test'
    const fragmentName = 'myFragment'
    const typeName = 'Test'

    const ast = gql`
            query ${queryName} {
                ${rootName} {
                  ...${fragmentName}
                }
            }
            query ${queryName} {
                ${rootName} {
                  ...${fragmentName}
                }
            }
            fragment ${fragmentName} on ${typeName}  {
                id
            }
        `

    // Act
    const action = () => getDefinitions(ast)

    // Assert
    expect(action).toThrow('Document does not contain exactly one operation')
  })
})
