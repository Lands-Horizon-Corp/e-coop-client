import { useEffect, useMemo } from 'react'

import { APP_VERSION } from '@/constants'
import { toBase64 } from '@/helpers/encoding-utils'
import { OnChangeFn, SortingState } from '@tanstack/react-table'

import { getIDB, setIDB } from '@/hooks/use-indexdb-storage'
import { useSortingState } from '@/hooks/use-sorting-state'

export const buildTableKeySorting = (key: string[]) => {
    return `data-table.${APP_VERSION}.${key.join('.')}.sorting`
}

interface UseDataTableSortingProps {
    persistKey?: (string | undefined | null)[]
}

export const useDataTableSorting = ({
    persistKey,
}: UseDataTableSortingProps = {}) => {
    const finalKeys = useMemo(
        () => persistKey?.filter((k): k is string => Boolean(k)),
        [persistKey]
    )

    const storageKey = useMemo(
        () => (finalKeys ? buildTableKeySorting(finalKeys) : null),
        [finalKeys]
    )

    // Initialize with useSortingState
    const { sortingState, setSortingState } = useSortingState()

    // 1. HYDRATION: Load from IndexedDB on mount
    useEffect(() => {
        if (storageKey) {
            getIDB<any[]>(storageKey).then((persisted) => {
                if (
                    persisted &&
                    Array.isArray(persisted) &&
                    persisted.length > 0
                ) {
                    setSortingState(persisted)
                }
            })
        }
    }, [storageKey, setSortingState])

    useEffect(() => {
        if (storageKey && sortingState.length > 0) {
            setIDB(storageKey, sortingState)
        }
    }, [storageKey, sortingState])

    const tableSorting: SortingState = useMemo(() => {
        return sortingState.map((sortItem) => ({
            id: sortItem.field,
            desc: sortItem.order === 'desc',
        }))
    }, [sortingState])

    const setTableSorting: OnChangeFn<SortingState> = (updaterOrValue) => {
        setSortingState((prev) => {
            const newSortingState =
                typeof updaterOrValue === 'function'
                    ? updaterOrValue(
                          prev.map((s) => ({
                              id: s.field,
                              desc: s.order === 'desc',
                          }))
                      )
                    : updaterOrValue

            return newSortingState.map((s) => ({
                field: s.id,
                order: s.desc ? 'desc' : 'asc',
            }))
        })
    }

    return {
        sortingState,
        sortingStateBase64: toBase64(sortingState),
        setSortingState,
        tableSorting,
        setTableSorting,
    }
}
