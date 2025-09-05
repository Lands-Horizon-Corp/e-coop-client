import { useMemo } from 'react'

import { toBase64 } from '@/helpers/encoding-utils'
import { OnChangeFn, SortingState } from '@tanstack/react-table'

import { useSortingState } from '@/hooks/use-sorting-state'

export const useDataTableSorting = () => {
    const { sortingState, setSortingState } = useSortingState()

    const tableSorting: SortingState = useMemo(() => {
        return sortingState.map((sortItem) => ({
            id: sortItem.field,
            desc: sortItem.order === 'desc',
        }))
    }, [sortingState])

    const setTableSorting: OnChangeFn<SortingState> = (updaterOrValue) => {
        setSortingState((prevSortingState) => {
            const newSortingState =
                typeof updaterOrValue === 'function'
                    ? updaterOrValue(
                          prevSortingState.map((sortItem) => ({
                              id: sortItem.field,
                              desc: sortItem.order === 'desc',
                          }))
                      )
                    : updaterOrValue

            return newSortingState.map((sortItem) => ({
                field: sortItem.id,
                order: sortItem.desc ? 'desc' : 'asc',
            }))
        })
    }

    const sortingStateBase64 = toBase64(sortingState)

    return {
        sortingState,
        sortingStateBase64,
        setSortingState,
        tableSorting,
        setTableSorting,
    }
}
