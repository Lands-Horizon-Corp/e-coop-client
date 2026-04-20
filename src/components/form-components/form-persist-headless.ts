import { useEffect, useRef } from 'react'

import { FieldValues, UseFormReturn } from 'react-hook-form'

import { getIDB, setIDB } from '../../hooks/use-indexdb-storage'

type PersistFormHeadlessProps<T extends FieldValues> = {
    persistKey?: string | null
    form: UseFormReturn<T>
    debounceMs?: number
}

export const PersistFormHeadless = <T extends FieldValues>({
    persistKey,
    form,
    debounceMs = 300,
}: PersistFormHeadlessProps<T>) => {
    const isEnabled = !!persistKey

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const hydratedRef = useRef(false)

    useEffect(() => {
        if (!isEnabled) return

        const subscription = form.watch((values) => {
            const { isLoading, isSubmitting } = form.formState

            if (isLoading) return

            if (!hydratedRef.current) {
                hydratedRef.current = true
                return
            }

            if (isSubmitting) return

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(async () => {
                await setIDB(persistKey, values as T)
            }, debounceMs)
        })

        return () => {
            subscription.unsubscribe()
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [form, persistKey, debounceMs, isEnabled])

    return null
}

export const getFormPersistedData = async <T>(key?: string | null) => {
    if (!key) return {} as T

    const result = (await getIDB<T>(key)) ?? {}
    return result as T
}

type CreatePersistedDefaultsParams<T> = {
    persistKey?: string | null
    baseDefaults: T
    overrideDefaults?: Partial<T>
    transform?: (data: T) => T
}

export const createPersistedDefaults = async <T>({
    persistKey,
    baseDefaults,
    overrideDefaults,
    transform,
}: CreatePersistedDefaultsParams<T>): Promise<T> => {
    const persisted = persistKey
        ? await getFormPersistedData<T>(persistKey)
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
