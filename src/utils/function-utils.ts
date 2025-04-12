export const withCatchAsync = async <
    T,
    E extends new (message?: string) => Error,
>(
    promise: Promise<T>,
    knownErrors?: E[]
): Promise<[undefined, T] | [InstanceType<E>]> => {
    return promise
        .then((data) => {
            return [undefined, data] as [undefined, T]
        })
        .catch((err) => {
            if (knownErrors == undefined) return [err]

            if (knownErrors.some((e) => err instanceof e)) return [err]

            throw err
        })
}

export const isObjectEmpty = <T extends Record<string, unknown>>(
    obj: T
): boolean => {
    return Object.keys(obj).length === 0
}
