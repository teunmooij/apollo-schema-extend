import { FragmentDefinitionNode, OperationDefinitionNode } from 'graphql'

export interface DocumentDefinition {
  operation: OperationDefinitionNode
  fragments: Partial<Record<string, FragmentDefinitionNode>>
}

export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>
