import { FragmentDefinitionNode, OperationDefinitionNode } from 'graphql'
import { ReadonlyDictionary } from '../utilities/types'

export interface DocumentDefinition {
  readonly operation: OperationDefinitionNode
  readonly fragments: ReadonlyDictionary<string, FragmentDefinitionNode>
}
