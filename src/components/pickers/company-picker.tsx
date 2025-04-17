import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'

import GenericPicker from './generic-picker'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'

import {
    useCompany,
    useFilteredPaginatedCompanies,
} from '@/hooks/api-hooks/use-company'

import {
    PAGINATION_INITIAL_INDEX,
    PAGINATION_INITIAL_PAGE_SIZE,
} from '@/constants'
import { ICompanyResource, TEntityId } from '@/server/types'
import useFilterState from '@/hooks/use-filter-state'

interface Props {
    value?: number | string
    placeholder?: string
    disabled?: boolean
    onSelect?: (selectedCompany: ICompanyResource) => void
}

const CompanyPicker = ({ value, disabled, placeholder, onSelect }: Props) => {
    const queryClient = useQueryClient()
    const [pickerState, setPickerState] = useState(false)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: PAGINATION_INITIAL_PAGE_SIZE,
    })

    const { finalFilterPayload, setFilter } = useFilterState({
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const { data, isPending, isLoading, isFetching } =
        useFilteredPaginatedCompanies({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    const company = useCompany({ companyId: value as TEntityId })

    return (
        <>
            <GenericPicker
                items={data.data}
                open={pickerState}
                listHeading={`Matched Results (${data.totalSize})`}
                searchPlaceHolder="Search company name..."
                isLoading={isPending || isLoading || isFetching}
                onSelect={(selectedCompany) => {
                    queryClient.setQueryData(
                        ['company', value],
                        selectedCompany
                    )
                    onSelect?.(selectedCompany)
                }}
                onOpenChange={setPickerState}
                onSearchChange={(searchValue) => {
                    setFilter('name', {
                        displayText: '',
                        mode: 'contains',
                        dataType: 'text',
                        value: searchValue,
                    })
                }}
                renderItem={(company) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <ImageDisplay src={company.media?.downloadURL} />
                            <span className="text-ellipsis text-foreground/80">
                                {company.name}
                            </span>
                        </div>
                        <span className="mr-2 font-mono text-xs italic text-foreground/40">
                            #{company.id}
                        </span>
                    </div>
                )}
            >
                <MiniPaginationBar
                    pagination={{
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                        totalPage: data.totalPage,
                        totalSize: data.totalSize,
                    }}
                    disablePageMove={isFetching}
                    onNext={({ pageIndex }) =>
                        setPagination((prev) => ({ ...prev, pageIndex }))
                    }
                    onPrev={({ pageIndex }) =>
                        setPagination((prev) => ({ ...prev, pageIndex }))
                    }
                />
            </GenericPicker>
            <Button
                type="button"
                variant="secondary"
                disabled={disabled}
                onClick={() => setPickerState((val) => !val)}
                className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
            >
                <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                    <span className="inline-flex w-full items-center gap-x-2">
                        <div>
                            {company.isFetching ? (
                                <LoadingSpinner />
                            ) : (
                                <ImageDisplay
                                    src={company.data?.media?.downloadURL}
                                />
                            )}
                        </div>
                        {!value ? (
                            <span className="text-foreground/70">
                                {placeholder}
                            </span>
                        ) : (
                            <span>{company.data?.name}</span>
                        )}
                    </span>
                    <span className="mr-1 font-mono text-sm text-foreground/30">
                        #{value ?? '?'}
                    </span>
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default CompanyPicker
