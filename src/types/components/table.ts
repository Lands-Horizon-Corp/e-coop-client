import { TFilterObject } from '@/contexts/filter-context'
import { ReactNode } from '@tanstack/react-router'
import { ColumnDef, Row } from '@tanstack/react-table'

import { IChildProps, IClassProps } from '@/types'

export interface TableProps<T> extends IClassProps {
    defaultFilter?: TFilterObject
    defaultColumnSort?: string[]
    excludeColumnIds?: string[]
    tableColumns?: ColumnDef<T>[]
    RowContextComponent?: (rowProps: { row: Row<T> } & IChildProps) => ReactNode
    onRowClick?: (row: Row<T>) => void
    onDoubleClick?: (row: Row<T>) => void
    onSelectData?: (selectedData: T[]) => void
}
