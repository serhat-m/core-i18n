type DistributiveFlattenObjectKeys<Obj, Key, Prefix extends string = ""> = Obj extends Record<string, unknown>
  ? Key extends string
    ? Obj[Key] extends Record<string, unknown>
      ? DistributiveFlattenObjectKeys<Obj[Key], keyof Obj[Key], `${Prefix}${Key}.`>
      : `${Prefix}${Key}`
    : never
  : never

export type FlattenObjectKeys<Obj, Prefix extends string = ""> = Obj extends Record<string, unknown>
  ? DistributiveFlattenObjectKeys<Obj, keyof Obj, Prefix>
  : never

export type ExtractPrefix<Value extends string> = Value extends `${infer Prefix}#${string}` ? Prefix : Value

export type IsPlural<Value extends string, Prefix extends ExtractPrefix<Value>> = Value extends `${Prefix}#${string}` ? true : never

export type ExtractPluralKeys<T, Key extends string, Keys = keyof T> = Keys extends `${Key}#${string}` ? Keys : never

export type GetObjectKeyValue<Obj, Key extends ExtractPrefix<FlattenObjectKeys<Obj>>> = Obj extends Record<string, unknown>
  ? Key extends `${infer Prefix}.${infer Rest}`
    ? Rest extends ExtractPrefix<FlattenObjectKeys<Obj[Prefix]>>
      ? GetObjectKeyValue<Obj[Prefix], Rest>
      : never
    : Key extends keyof Obj
      ? Obj[Key]
      : ExtractPluralKeys<Obj, Key> extends keyof Obj
        ? Obj[ExtractPluralKeys<Obj, Key>]
        : never
  : never

export type ExtractPlaceholders<Value> = Value extends `${infer _Start}{${infer Param}}${infer Rest}`
  ? Param | ExtractPlaceholders<Rest>
  : never

export type Count = { count: number; ordinal?: true }

export type AddCount<T> = T extends [] ? Count : T extends [infer R] ? [Count & R] : never

export type GetParams<Keys extends string, Key extends ExtractPrefix<Keys>, KeyValue> = IsPlural<Keys, Key> extends never
  ? ExtractPlaceholders<KeyValue> extends never
    ? []
    : [Record<ExtractPlaceholders<KeyValue>, string>]
  : AddCount<[Omit<Record<ExtractPlaceholders<KeyValue>, string>, "count">]>
