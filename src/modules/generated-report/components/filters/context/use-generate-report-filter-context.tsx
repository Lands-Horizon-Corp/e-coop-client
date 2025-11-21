import { createContext, useContext, useState } from 'react'

import {
    TFilterLogic,
    TFilterPayload,
    TFinalFilter,
} from '@/contexts/filter-context'
import { toBase64 } from '@/helpers/encoding-utils'

import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'

import { TSortingState } from '@/types'

type TGenerateReportProps = {
    defaultFilter: TFinalFilter
}

export const useDataGenerateReportFilter = ({
    defaultFilter,
}: TGenerateReportProps): IFilterState => {
    const [filterLogic, setFilterLogic] = useState<TFilterLogic>('AND')

    const { sortingStateBase64, sortingState, setSortingState } =
        useDataTableSorting()
    const [filter, setFilter] = useState<TFinalFilter[]>([defaultFilter])

    const filterPayload: TFilterPayload = {
        filters: filter,
        logic: filterLogic,
    }

    const payload = {
        filter: filterPayload,
        sort: sortingState,
    }

    const setFilters = (filter: TFinalFilter[]) => {
        setFilter(filter)
    }
    const finalFilterPayloadBase64 = toBase64(payload)

    return {
        setFilter: setFilters,
        setFilterLogic,
        finalFilterPayloadBase64,
        filterLogic,
        filter,
        filterPayload,
        payload,
        sortingState,
        setSortingState,
        sortingStateBase64,
    }
}

export interface IFilterState {
    setFilter: (filter: TFinalFilter[]) => void
    finalFilterPayloadBase64: string
    filterLogic: TFilterLogic
    filter: TFinalFilter[]
    setFilterLogic: (newFilterLogic: TFilterLogic) => void
    filterPayload: TFilterPayload
    payload: {
        filter: TFilterPayload
        sort: TSortingState<unknown>
    }
    sortingStateBase64: string
    sortingState: TSortingState<unknown>
    setSortingState: React.Dispatch<
        React.SetStateAction<TSortingState<unknown>>
    >
}

export const GenerateReportFilterContext = createContext<IFilterState>(
    {} as IFilterState
)

export const useGeneratedReportFilter = () => {
    const context = useContext(GenerateReportFilterContext) as IFilterState

    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider')
    }

    return context
}
