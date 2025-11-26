import { IStorage } from './storage.types'

export class IndexedDBStrategy implements IStorage {
    private dbName = 'e-cooperatives-suite'
    private storeName = 'storage'

    private async getDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1)

            request.onupgradeneeded = () => {
                request.result.createObjectStore(this.storeName)
            }

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    async getItem<T>(key: string, fallback?: T): Promise<T | null> {
        const db = await this.getDB()
        return new Promise((resolve) => {
            const transaction = db.transaction(this.storeName, 'readonly')
            const store = transaction.objectStore(this.storeName)
            const request = store.get(key)

            request.onsuccess = () =>
                resolve(request.result ?? fallback ?? null)
            request.onerror = () => resolve(fallback ?? null)
        })
    }

    async setItem<T>(key: string, value: T): Promise<void> {
        const db = await this.getDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite')
            const store = transaction.objectStore(this.storeName)
            const request = store.put(value, key)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    async removeItem(key: string): Promise<void> {
        const db = await this.getDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite')
            const store = transaction.objectStore(this.storeName)
            const request = store.delete(key)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }
}
