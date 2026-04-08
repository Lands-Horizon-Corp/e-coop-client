import { useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'

import { Skeleton } from '@/components/ui/skeleton'

type TUseLoadingColumnsArgs<TData> = {
    columns: ColumnDef<TData>[]
    isLoading: boolean
    skeletonClassName?: string
}

const mapColumnsToLoading = <TData,>(
    columns: ColumnDef<TData>[],
    skeletonClassName: string
): ColumnDef<TData>[] => {
    return columns.map((column) => {
        if ('columns' in column && Array.isArray(column.columns)) {
            return {
                ...column,
                columns: mapColumnsToLoading(column.columns, skeletonClassName),
            }
        }

        return {
            ...column,
            cell: () => <Skeleton className={skeletonClassName} />,
        }
    })
}

export const useLoadingColumns = <TData,>({
    columns,
    isLoading,
    skeletonClassName = 'h-9 w-full rounded-xl opacity-0',
}: TUseLoadingColumnsArgs<TData>): ColumnDef<TData>[] => {
    return useMemo(() => {
        if (!isLoading) return columns
        return mapColumnsToLoading(columns, skeletonClassName)
    }, [columns, isLoading, skeletonClassName])
}
