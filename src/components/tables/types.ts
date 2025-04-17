import { IClassProps } from '@/types'
import { TFilterObject } from '@/contexts/filter-context'

export interface TableProps<T> extends IClassProps {
    defaultFilter?: TFilterObject
    onSelectData?: (selectedData: T[]) => void
}
