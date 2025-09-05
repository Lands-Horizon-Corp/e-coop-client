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
            if (knownErrors === undefined) {
                return [err]
            }

            if (knownErrors.some((e) => err instanceof e)) {
                return [err]
            }

            throw err
        })
}

export const isObjectEmpty = <T extends Record<string, unknown>>(
    obj: T
): boolean => {
    return Object.keys(obj).length === 0
}

export const groupBy = <T, K extends PropertyKey>(
    array: T[],
    keyGetter: (item: T) => K
): Record<K, T[]> => {
    return array.reduce(
        (acc, item) => {
            const key = keyGetter(item)
            ;(acc[key] ||= []).push(item)
            return acc
        },
        {} as Record<K, T[]>
    )
}

const slugify = (str: string) =>
    str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^[-]+|[-]+$/g, '')

export const getOrgBranchSafeURLNames = (
    orgName: string,
    branchName: string
) => {
    return { orgName: slugify(orgName), branchName: slugify(branchName) }
}
