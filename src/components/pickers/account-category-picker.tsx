import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'

import GenericPicker from './generic-picker'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'

import useFilterState from '@/hooks/use-filter-state'
import { abbreviateUUID } from '@/utils/formatting-utils'
import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'

import { useShortcut } from '../use-shorcuts'
import { TEntityId } from '@/types'
import { useFilteredPaginatedAccountClassification } from '@/hooks/api-hooks/use-account-classification'
import LoadingSpinner from '../spinners/loading-spinner'
import { IAccountCategory } from '@/types/coop-types/account-category'

interface Props {
    value?: TEntityId
    disabled?: boolean
    placeholder?: string
    onSelect?: (selectedAccountCategory: IAccountCategory) => void
    allowShorcutCommand?: boolean
}

const AccountCategoryPicker = ({
    value,
    disabled,
    allowShorcutCommand = false,
    placeholder,
    onSelect,
}: Props) => {
    const queryClient = useQueryClient()
    const [state, setState] = useState(false)

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: PICKERS_SELECT_PAGE_SIZE,
    })

    const { finalFilterPayload, bulkSetFilter } = useFilterState({
        defaultFilterMode: 'OR',
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const { data, isPending, isLoading, isFetching } =
        useFilteredPaginatedAccountClassification({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    const selectedAccountCategory = data.data.find(
        (accountCategory) => accountCategory.id === value
    )

    useShortcut(
        'Enter',
        (event) => {
            event?.preventDefault()
            if (
                !selectedAccountCategory &&
                !disabled &&
                !isPending &&
                !isLoading &&
                !isFetching &&
                allowShorcutCommand
            ) {
                setState((prev) => !prev)
            }
        },
        { disableTextInputs: true }
    )

    return (
        <>
            <GenericPicker
                items={data.data}
                open={state}
                listHeading={`Matched Results (${data.totalSize})`}
                searchPlaceHolder="Search name"
                isLoading={isPending || isLoading || isFetching}
                onSelect={(selectedAccountCategory) => {
                    queryClient.setQueryData(
                        ['account-category', value],
                        selectedAccountCategory
                    )
                    onSelect?.(selectedAccountCategory)
                    setState(false)
                }}
                onOpenChange={setState}
                onSearchChange={(searchValue) => {
                    bulkSetFilter([{ displayText: 'name', field: 'Name' }], {
                        displayText: '',
                        mode: 'equal',
                        dataType: 'text',
                        value: searchValue,
                    })
                }}
                renderItem={(account) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <span className="text-ellipsis text-foreground/80">
                                {account.name}{' '}
                            </span>
                        </div>

                        <p className="mr-2 font-mono text-xs italic text-foreground/40">
                            <span>#{abbreviateUUID(account.id)}</span>
                        </p>
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
                onClick={() => setState((prev) => !prev)}
                className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
            >
                <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                    <span className="inline-flex w-full items-center gap-x-2">
                        {isFetching && <LoadingSpinner />}
                        {!selectedAccountCategory ? (
                            <span className="text-foreground/70">
                                {value ||
                                    placeholder ||
                                    'Select Account Category'}
                            </span>
                        ) : (
                            <span>{selectedAccountCategory.name}</span>
                        )}
                    </span>
                    {allowShorcutCommand && (
                        <span className="mr-2 text-sm">⌘ ↵ </span>
                    )}
                </span>
                <ChevronDownIcon />
            </Button>
        </>
    )
}

export default AccountCategoryPicker
