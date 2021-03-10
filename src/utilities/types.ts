export type ReadonlyRecord<K extends string | number | symbol, V> = { readonly [P in K]: V }

export type ReadonlyDictionary<K extends string | number | symbol, V> = Partial<ReadonlyRecord<K, V>>
