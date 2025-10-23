import { useCallback, useEffect, useState } from 'react'

export function getLocalStorage<T>(key: string, fallback?: T): T | null {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : (fallback ?? null)
}

export function setLocalStorage<T>(key: string, value: T) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeLocalStorage(key: string) {
    window.localStorage.removeItem(key)
}

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        return getLocalStorage(key, initialValue)!
    })

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                // Allow value to be a function so we have same API as useState
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value

                setStoredValue(valueToStore)
                setLocalStorage(key, valueToStore)
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error)
            }
        },
        [key, storedValue]
    )

    const removeValue = useCallback(() => {
        removeLocalStorage(key)
        setStoredValue(initialValue)
    }, [key, initialValue])

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue))
                } catch (error) {
                    console.error(
                        `Error parsing storage event for key "${key}":`,
                        error
                    )
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [key])

    return [storedValue, setValue, removeValue] as const
}
