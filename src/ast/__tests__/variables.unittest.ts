import { gql } from 'apollo-server-express'
import { Kind } from 'graphql'
import { isNodeKind } from '../../../../ast'
import { cleanVariables } from '../variables'

describe('ast variables', () => {
  describe('clean variables', () => {
    it('should keep only variables that are used', () => {
      // Arrange
      const query = gql`
        query myQuery(
          $var1: ID! # used in root
          $var2: ID! # used in child
          $var3: ID! # used in fragment
          $var4: ID! # used in inline fragment
          $var5: ID! # NOT USED
          $var6: Boolean! # used in directive
        ) {
          root(id: $var1) {
            child(id: $var2) {
              ...myFragment
              ... on Test {
                inlineFragment(id: $var4) {
                  conditional @include(if: $var6)
                }
              }
            }
          }
        }
        fragment myFragment on Type {
          field {
            child(id: $var3) {
              prop
            }
          }
        }
      `

      const operation = query.definitions.find(isNodeKind(Kind.OPERATION_DEFINITION))!
      const fragments = query.definitions.filter(isNodeKind(Kind.FRAGMENT_DEFINITION))

      // Act
      const result = cleanVariables(operation, fragments)

      // Assert
      const variables = result.variableDefinitions?.map(definition => definition.variable.name.value)
      expect(variables).toEqual(['var1', 'var2', 'var3', 'var4', 'var6'])
    })
  })
})
