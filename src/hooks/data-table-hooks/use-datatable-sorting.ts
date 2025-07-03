import { useMemo } from 'react'

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

    return { sortingState, setSortingState, tableSorting, setTableSorting }
}
