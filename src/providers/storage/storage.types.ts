export interface IStorage {
    getItem<T>(key: string, fallback?: T): Promise<T | null>
    setItem<T>(key: string, value: T): Promise<void>
    removeItem(key: string): Promise<void>
}
