import { useState } from 'react'
import { PaginationState } from '@tanstack/react-table'

import GenericPicker from './generic-picker'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'

import {
    PAGINATION_INITIAL_INDEX,
    PAGINATION_INITIAL_PAGE_SIZE,
} from '@/constants'
import useFilterState from '@/hooks/use-filter-state'
import { TEntityId } from '@/types'
import { IBankResponse } from '@/types'
import { useFilteredPaginatedBanks } from '@/hooks/api-hooks/use-bank'
import { useShortcut } from '../use-shorcuts'
import useIsFocused from '../ui/use-isFocused'
import { cn } from '@/lib'

interface Props {
    value?: TEntityId
    placeholder?: string
    disabled?: boolean
    onSelect?: (selectedBank: IBankResponse) => void
    ButtonClassName?: string
}

const BankPicker = ({
    value,
    disabled,
    placeholder,
    onSelect,
    ButtonClassName,
}: Props) => {
    const [pickerState, setPickerState] = useState(false)
    const [selectedBank, setSelectedBank] = useState<IBankResponse>()
    const { isFocused, ref } = useIsFocused()
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
        useFilteredPaginatedBanks({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    useShortcut('Enter', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (isFocused && !isLoading && !isFetching && !isPending) {
            setPickerState((val) => !val)
        }
    })

    return (
        <>
            <GenericPicker
                items={data.data}
                open={pickerState}
                listHeading={`Matched Results (${data.totalSize})`}
                searchPlaceHolder="Search banks..."
                isLoading={isPending || isLoading || isFetching}
                onSelect={(selectedBank) => {
                    onSelect?.(selectedBank)
                    setSelectedBank(selectedBank)
                }}
                onOpenChange={setPickerState}
                onSearchChange={(searchValue) => {
                    setFilter('title', {
                        displayText: '',
                        mode: 'contains',
                        dataType: 'text',
                        value: searchValue,
                    })
                }}
                renderItem={(bank) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <span className="text-ellipsis text-foreground/80">
                                {bank.name}
                            </span>
                        </div>
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
                ref={ref}
                onClick={() => setPickerState((val) => !val)}
                className={cn(
                    'w-full items-center justify-between rounded-md border bg-background p-0 px-2',
                    ButtonClassName
                )}
            >
                <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                    <span className="inline-flex w-full items-center gap-x-2">
                        {!value ? (
                            <span className="text-foreground/70">
                                {placeholder}
                            </span>
                        ) : (
                            <span className="mr-1 font-mono text-sm text-foreground/30">
                                {selectedBank?.name}
                            </span>
                        )}
                    </span>
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default BankPicker
