import { DeepPartial } from 'react-hook-form'

import { getIDB } from '@/hooks/use-indexdb-storage'

export const getPersistedForm = async <T>(key: string) => {
    const result = await getIDB<T>(key)

    return (result ?? {}) as T
}

type BuildFormDefaultsParams<T> = {
    persistKey?: string
    baseDefaults: DeepPartial<T>
    overrideDefaults?: Partial<T>
    transform?: (data: T) => T
}

export const buildFormDefaults = async <T>({
    persistKey,
    baseDefaults, // its this mother fucker causing it!
    overrideDefaults,
    transform,
}: BuildFormDefaultsParams<T>): Promise<T> => {
    const persisted = persistKey
        ? await getPersistedForm<T>(persistKey)
        : ({} as T)

    let merged = {
        ...baseDefaults,
        ...persisted,
        ...overrideDefaults,
    } as T

    if (transform) {
        merged = transform(merged)
    }

    return merged
}
