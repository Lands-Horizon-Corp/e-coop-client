import { useCallback, useEffect, useState } from 'react'

import { del, get, set } from 'idb-keyval'

export async function getIDB<T>(key: string, fallback?: T): Promise<T | null> {
    try {
        const item = await get<T>(key)
        return item !== undefined ? item : (fallback ?? null)
    } catch (error) {
        console.error(`Error reading IndexedDB key "${key}":`, error)
        return fallback ?? null
    }
}

export async function setIDB<T>(key: string, value: T): Promise<void> {
    await set(key, value)
}

export async function removeIDB(key: string): Promise<void> {
    await del(key)
}

export function useIndexedDB<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue)

    useEffect(() => {
        getIDB(key, initialValue).then((value) => {
            if (value !== null) setStoredValue(value)
        })
    }, [key, initialValue])

    const setValue = useCallback(
        async (value: T | ((val: T) => T)) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value

                setStoredValue(valueToStore)
                await setIDB(key, valueToStore)
            } catch (error) {
                console.error(`Error setting IndexedDB key "${key}":`, error)
            }
        },
        [key, storedValue]
    )

    const removeValue = useCallback(async () => {
        await removeIDB(key)
        setStoredValue(initialValue)
    }, [key, initialValue])

    return [storedValue, setValue, removeValue] as const
}
