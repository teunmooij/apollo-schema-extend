import {
  ASTKindToNode,
  ASTNode,
  DirectiveNode,
  ExecutableDefinitionNode,
  FieldNode,
  InlineFragmentNode,
  Kind,
  SelectionNode,
} from 'graphql'
import { WithRequired } from './astTypes'

/**
 * Curried TypeGuard for any kind of node
 * @param kind the kind of node
 * @param node the node to verify
 */
export function isNodeKind<TKind extends keyof ASTKindToNode>(
  kind: TKind
): (node: ASTNode) => node is ASTKindToNode[TKind]
export function isNodeKind<TKind extends keyof ASTKindToNode>(kind: TKind, node: ASTNode): node is ASTKindToNode[TKind]
export function isNodeKind<TKind extends keyof ASTKindToNode>(kind: TKind, node?: ASTNode) {
  return node ? node.kind === kind : (n: ASTNode) => n.kind === kind
}

export const hasArguments = (node: ASTNode): node is FieldNode | DirectiveNode =>
  !!(node as FieldNode | DirectiveNode).arguments

export const hasDirectives = (node: ASTNode): node is SelectionNode | ExecutableDefinitionNode =>
  !!(node as SelectionNode | ExecutableDefinitionNode).directives

export const hasSelectionSet = (
  node: ASTNode
): node is WithRequired<ExecutableDefinitionNode | FieldNode | InlineFragmentNode, 'selectionSet'> =>
  !!(node as ExecutableDefinitionNode | FieldNode | InlineFragmentNode).selectionSet

export const isFieldNode = isNodeKind(Kind.FIELD)
