import {
  ArgumentNode,
  ASTNode,
  DirectiveDefinitionNode,
  DirectiveNode,
  DocumentNode,
  EnumTypeDefinitionNode,
  EnumTypeExtensionNode,
  EnumValueDefinitionNode,
  EnumValueNode,
  FieldDefinitionNode,
  FieldNode,
  FloatValueNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  InputObjectTypeDefinitionNode,
  InputObjectTypeExtensionNode,
  InputValueDefinitionNode,
  InterfaceTypeDefinitionNode,
  InterfaceTypeExtensionNode,
  IntValueNode,
  Kind,
  ListTypeNode,
  ListValueNode,
  NamedTypeNode,
  NameNode,
  NonNullTypeNode,
  NullValueNode,
  ObjectFieldNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
  ObjectValueNode,
  OperationDefinitionNode,
  OperationTypeDefinitionNode,
  ScalarTypeDefinitionNode,
  ScalarTypeExtensionNode,
  SchemaDefinitionNode,
  SchemaExtensionNode,
  SelectionSetNode,
  StringValueNode,
  UnionTypeDefinitionNode,
  UnionTypeExtensionNode,
  VariableDefinitionNode,
  VariableNode,
} from 'graphql'

export * from 'graphql/language/predicates'

// @internal
export const createNodeGuard = <T extends ASTNode>(kind: string) => (node: ASTNode): node is T => node.kind === kind

export const isNameNode = createNodeGuard<NameNode>(Kind.NAME)

export const isDocumentNode = createNodeGuard<DocumentNode>(Kind.DOCUMENT)

export const isOperationDefinitionNode = createNodeGuard<OperationDefinitionNode>(Kind.OPERATION_DEFINITION)

export const isVariableDefinitionNode = createNodeGuard<VariableDefinitionNode>(Kind.VARIABLE_DEFINITION)

export const isVariableNode = createNodeGuard<VariableNode>(Kind.VARIABLE)

export const isSelectionSetNode = createNodeGuard<SelectionSetNode>(Kind.SELECTION_SET)

export const isFieldNode = createNodeGuard<FieldNode>(Kind.FIELD)

export const isArgumentNode = createNodeGuard<ArgumentNode>(Kind.ARGUMENT)

export const isFragmentSpreadNode = createNodeGuard<FragmentSpreadNode>(Kind.FRAGMENT_SPREAD)

export const isInlineFragmentNode = createNodeGuard<InlineFragmentNode>(Kind.INLINE_FRAGMENT)

export const isFragmentDefinitionNode = createNodeGuard<FragmentDefinitionNode>(Kind.FRAGMENT_DEFINITION)

export const isIntValueNode = createNodeGuard<IntValueNode>(Kind.INT)

export const isFloatValueNode = createNodeGuard<FloatValueNode>(Kind.FLOAT)

export const isStringValueNode = createNodeGuard<StringValueNode>(Kind.STRING)

export const isBooleanValueNode = createNodeGuard(Kind.BOOLEAN)

export const isNullValueNode = createNodeGuard<NullValueNode>(Kind.NULL)

export const isEnumValueNode = createNodeGuard<EnumValueNode>(Kind.ENUM)

export const isListValueNode = createNodeGuard<ListValueNode>(Kind.LIST)

export const isObjectValueNode = createNodeGuard<ObjectValueNode>(Kind.OBJECT)

export const isObjectFieldNode = createNodeGuard<ObjectFieldNode>(Kind.OBJECT_FIELD)

export const isDirectiveNode = createNodeGuard<DirectiveNode>(Kind.DIRECTIVE)

export const isNamedTypeNode = createNodeGuard<NamedTypeNode>(Kind.NAMED_TYPE)

export const isListTypeNode = createNodeGuard<ListTypeNode>(Kind.LIST_TYPE)

export const isNonNullTypeNode = createNodeGuard<NonNullTypeNode>(Kind.NON_NULL_TYPE)

export const isSchemaDefinitionNode = createNodeGuard<SchemaDefinitionNode>(Kind.SCHEMA_DEFINITION)

export const isOperationTypeDefinitionNode = createNodeGuard<OperationTypeDefinitionNode>(Kind.OPERATION_DEFINITION)

export const isScalarTypeDefinitionNode = createNodeGuard<ScalarTypeDefinitionNode>(Kind.SCALAR_TYPE_DEFINITION)

export const isObjectTypeDefinitionNode = createNodeGuard<ObjectTypeDefinitionNode>(Kind.OBJECT_TYPE_DEFINITION)

export const isFieldDefinitionNode = createNodeGuard<FieldDefinitionNode>(Kind.FIELD_DEFINITION)

export const isInputValueDefinitionNode = createNodeGuard<InputValueDefinitionNode>(Kind.INPUT_VALUE_DEFINITION)

export const isInterfaceTypeDefinitionNode = createNodeGuard<InterfaceTypeDefinitionNode>(
  Kind.INTERFACE_TYPE_DEFINITION
)

export const isUnionTypeDefinitionNode = createNodeGuard<UnionTypeDefinitionNode>(Kind.UNION_TYPE_DEFINITION)

export const isEnumTypeDefinitionNode = createNodeGuard<EnumTypeDefinitionNode>(Kind.ENUM_TYPE_DEFINITION)

export const isEnumValueDefinitionNode = createNodeGuard<EnumValueDefinitionNode>(Kind.ENUM_VALUE_DEFINITION)

export const isInputObjectTypeDefinitionNode = createNodeGuard<InputObjectTypeDefinitionNode>(
  Kind.INPUT_OBJECT_TYPE_DEFINITION
)

export const isDirectiveDefinitionNode = createNodeGuard<DirectiveDefinitionNode>(Kind.DIRECTIVE_DEFINITION)

export const isSchemaExtensionNode = createNodeGuard<SchemaExtensionNode>(Kind.SCHEMA_EXTENSION)

export const isScalarTypeExtensionNode = createNodeGuard<ScalarTypeExtensionNode>(Kind.SCALAR_TYPE_EXTENSION)

export const isObjectTypeExtensionNode = createNodeGuard<ObjectTypeExtensionNode>(Kind.OBJECT_TYPE_EXTENSION)

export const isInterfaceTypeExtensionNode = createNodeGuard<InterfaceTypeExtensionNode>(Kind.INTERFACE_TYPE_EXTENSION)

export const isUnionTypeExtensionNode = createNodeGuard<UnionTypeExtensionNode>(Kind.UNION_TYPE_EXTENSION)

export const isEnumTypeExtensionNode = createNodeGuard<EnumTypeExtensionNode>(Kind.ENUM_TYPE_EXTENSION)

export const isInputObjectTypeExtensionNode = createNodeGuard<InputObjectTypeExtensionNode>(
  Kind.INPUT_OBJECT_TYPE_EXTENSION
)
