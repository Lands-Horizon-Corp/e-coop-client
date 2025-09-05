import { useState } from 'react'

import type { KeysOfOrString } from '@/types'

export interface ISortItem<T = unknown> {
    field: KeysOfOrString<T>
    order: 'asc' | 'desc'
}

export type TSortingState<T = unknown> = ISortItem<T>[]

export const useSortingState = <T = unknown>() => {
    const [sortingState, setSortingState] = useState<TSortingState<T>>([])
    return { sortingState, setSortingState }
}
