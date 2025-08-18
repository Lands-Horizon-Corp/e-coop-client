export type KeysOfType<T, ValueType> = {
    [K in keyof T]: T[K] extends ValueType ? K : never
}[keyof T]

export type KeysOfOrString<T> = (string & {}) | keyof T
