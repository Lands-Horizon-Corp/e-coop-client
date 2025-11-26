import { IStorage } from './storage.types'

export class LocalStorageStrategy implements IStorage {
    async getItem<T>(key: string, fallback?: T): Promise<T | null> {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : (fallback ?? null)
        } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error)
            return fallback ?? null
        }
    }

    async setItem<T>(key: string, value: T): Promise<void> {
        localStorage.setItem(key, JSON.stringify(value))
    }

    async removeItem(key: string): Promise<void> {
        localStorage.removeItem(key)
    }
}
