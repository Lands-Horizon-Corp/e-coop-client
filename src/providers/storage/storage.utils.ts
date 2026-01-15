import { IndexedDBStrategy } from './storage.index-storage'
import { LocalStorageStrategy } from './storage.local-storage'
import { IStorage } from './storage.types'

type StorageType = 'local' | 'indexeddb'

export function createStorage(type: StorageType = 'local'): IStorage {
    return type === 'indexeddb'
        ? new IndexedDBStrategy()
        : new LocalStorageStrategy()
}
