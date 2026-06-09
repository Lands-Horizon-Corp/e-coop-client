import { ReactNode } from 'react'

import { TFilterObject } from '@/contexts/filter-context'
import { ColumnDef, Row, SortingState } from '@tanstack/react-table'

import { IChildProps, IClassProps } from '@/types'

export interface TableProps<T> extends IClassProps {
    persistKey?: string[]
    defaultFilter?: TFilterObject
    defaultColumnSort?: string[]
    excludeColumnIds?: string[]
    defaultColumnSortingState?: SortingState
    tableColumns?: ColumnDef<T>[]
    RowContextComponent?: (rowProps: { row: Row<T> } & IChildProps) => ReactNode
    onRowClick?: (row: Row<T>) => void
    onDoubleClick?: (row: Row<T>) => void
    onSelectData?: (selectedData: T[]) => void
}
