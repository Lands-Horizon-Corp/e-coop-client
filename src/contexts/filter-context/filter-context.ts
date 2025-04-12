import { createContext } from 'react'
import { KeysOfOrString } from '@/types'

export type TFilterLogic = 'AND' | 'OR'

export type TColumnDataTypes = 'number' | 'text' | 'date' | 'boolean' | 'time'

export type TFilterModes =
    | 'equal'
    | 'nequal'
    | 'contains'
    | 'ncontains'
    | 'startswith'
    | 'endswith'
    | 'isempty'
    | 'isnotempty'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'range'
    | 'before'
    | 'after'

export const filterModeMap: {
    [K in Exclude<TColumnDataTypes, 'boolean'>]: {
        value: TFilterModes
        label: string
    }[]
} = {
    text: [
        { value: 'equal', label: 'Equals' },
        { value: 'nequal', label: 'Does Not Equal' },
        { value: 'contains', label: 'Contains' },
        { value: 'ncontains', label: 'Does Not Contain' },
        { value: 'startswith', label: 'Starts With' },
        { value: 'endswith', label: 'Ends With' },
        { value: 'isempty', label: 'Is Empty' },
        { value: 'isnotempty', label: 'Is Not Empty' },
    ],
    number: [
        { value: 'equal', label: '(=) Equal' },
        { value: 'nequal', label: 'Not equal' },
        { value: 'gt', label: '(>) Greater Than' },
        { value: 'gte', label: '(>=) Greater Than or Equal' },
        { value: 'lt', label: '(<) Less than' },
        { value: 'lte', label: '(<=) Less than or Equal to' },
        { value: 'range', label: 'Range' },
    ],
    date: [
        { value: 'equal', label: 'On' },
        { value: 'nequal', label: 'Not On' },
        { value: 'before', label: 'Before' },
        { value: 'after', label: 'After' },
        { value: 'gte', label: 'On or After' },
        { value: 'lte', label: 'On or Before' },
        { value: 'range', label: 'Range' },
    ],
    time: [
        { value: 'equal', label: 'On' },
        { value: 'nequal', label: 'Not On' },
        { value: 'before', label: 'Before' },
        { value: 'after', label: 'After' },
        { value: 'gte', label: 'On or After' },
        { value: 'lte', label: 'On or Before' },
        { value: 'range', label: 'Range' },
    ],
}

export type TSearchFilter<T = unknown, TValue = T> = {
    to?: TValue
    from?: TValue
    value?: TValue
    mode: TFilterModes
    displayText: string
    isStaticFilter?: boolean
    dataType: TColumnDataTypes
}

export type TFinalFilter<T = unknown, TValue = T> = {
    field: string | keyof T
    value: TValue | { from: TValue; to: TValue }
} & Omit<TSearchFilter, 'value' | 'from' | 'to' | 'displayText'>

export type TFilterPayload = { filters: TFinalFilter[]; logic: TFilterLogic }

export type TFilterObject<T = unknown, TValue = T> = {
    [key: string]: TSearchFilter<T, TValue> | undefined
}

export interface IFilterState<T = unknown, TField = string, TValue = T> {
    filterLogic: TFilterLogic
    filters: TFilterObject<T, TValue>
    finalFilterPayload: TFilterPayload
    setFilterLogic: (newFilterLogic: TFilterLogic) => void
    setFilter: (field: TField, filter?: TSearchFilter<TValue, TValue>) => void
    bulkSetFilter: (
        field: { field: TField; displayText: string }[],
        filterValue?: TSearchFilter<TValue, TValue>
    ) => void
    resetFilter: () => void
    removeFilter: (field: TField) => void
}

export interface IFilterComponentProps<
    T,
    F extends keyof typeof filterModeMap = 'text',
> {
    field: KeysOfOrString<T>
    displayText: string
    defaultMode?: (typeof filterModeMap)[F][number]['value']
}

const FilterContext = createContext<IFilterState<unknown> | undefined>(
    undefined
)

export default FilterContext
