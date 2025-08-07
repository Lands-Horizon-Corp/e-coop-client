import { TFilterObject } from '@/contexts/filter-context'
import { ColumnDef, Row } from '@tanstack/react-table'

import { IClassProps } from '@/types'

export interface TableProps<T> extends IClassProps {
    defaultFilter?: TFilterObject
    defaultColumnSort?: string[]
    excludeColumnIds?: string[]
    tableColumns?: ColumnDef<T>[]
    onRowClick?: (row: Row<T>) => void
    onSelectData?: (selectedData: T[]) => void
}
