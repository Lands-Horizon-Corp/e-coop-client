import { IClassProps } from '@/types'
import { TFilterObject } from '@/contexts/filter-context'
import { Row } from '@tanstack/react-table'

export interface TableProps<T> extends IClassProps {
    defaultFilter?: TFilterObject
    onSelectData?: (selectedData: T[]) => void
    onRowClick?: (row: Row<T>) => void
}
