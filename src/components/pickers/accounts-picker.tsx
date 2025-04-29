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
import { IAccountsResource } from '@/types'
import { useFilteredPaginatedAccounts } from '@/hooks/api-hooks/accounting/use-accounting'
import useIsFocused from '../ui/use-isFocused'
import { useShortcut } from '../use-shorcuts'

interface Props {
    value?: TEntityId
    placeholder?: string
    disabled?: boolean
    leftIcon?: React.ReactNode
    onSelect?: (selectedAccounts: IAccountsResource) => void
}

const AccountsPicker = ({
    value,
    disabled,
    placeholder,
    onSelect,
    leftIcon,
}: Props) => {
    const [pickerState, setPickerState] = useState(false)
    const [selectedAccounts, setSelectedAccounts] =
        useState<IAccountsResource>()
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: PAGINATION_INITIAL_PAGE_SIZE,
    })

    const { isFocused, ref } = useIsFocused()

    const { finalFilterPayload, setFilter } = useFilterState({
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const { data, isPending, isLoading, isFetching } =
        useFilteredPaginatedAccounts({
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
                searchPlaceHolder="Search accounts..."
                isLoading={isPending || isLoading || isFetching}
                onSelect={(selectedAccounts) => {
                    onSelect?.(selectedAccounts)
                    setSelectedAccounts(selectedAccounts)
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
                renderItem={(accounts) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <span className="text-ellipsis text-foreground/80">
                                {accounts.description}
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
                className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
            >
                <span className="flex w-full items-center justify-between text-sm text-foreground/90">
                    {leftIcon && (
                        <span className="mr-2 flex-shrink-0">{leftIcon}</span>
                    )}
                    <span className="flex w-full items-center gap-x-2 overflow-hidden">
                        {!value ? (
                            <span className="truncate text-xs text-foreground/40">
                                {placeholder}
                            </span>
                        ) : (
                            <span className="truncate font-mono text-sm text-foreground">
                                {selectedAccounts?.description}
                            </span>
                        )}
                    </span>
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default AccountsPicker
