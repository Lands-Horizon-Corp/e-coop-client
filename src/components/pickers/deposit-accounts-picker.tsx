import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'

import GenericPicker from './generic-picker'
import { Button } from '@/components/ui/button'
import { BadgeCheckFillIcon, ChevronDownIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import { TEntityId } from '@/types'

import useFilterState from '@/hooks/use-filter-state'
import { abbreviateUUID } from '@/utils/formatting-utils'
import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { useFilteredPaginatedAccounts } from '@/hooks/api-hooks/accounting/use-accounting'
import { IAccountsResource } from '@/types'

interface Props {
    value?: TEntityId
    placeholder?: string
    disabled?: boolean
    onSelect?: (selectedAccount: IAccountsResource) => void
    pickerState?: boolean
    setPickerState?: React.Dispatch<React.SetStateAction<boolean>> | undefined
    disabledButton?: boolean
}

const DepositAccountPicker = ({
    value,
    disabled,
    placeholder,
    onSelect,
    pickerState,
    setPickerState,
    disabledButton,
}: Props) => {
    const queryClient = useQueryClient()
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
        useFilteredPaginatedAccounts({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    const selectedAccount = data.data.find((account) => account.id === value)

    return (
        <>
            <GenericPicker
                items={data.data}
                open={pickerState}
                listHeading={`Matched Results (${data.totalSize})`}
                searchPlaceHolder="Search deposit account name"
                isLoading={isPending || isLoading || isFetching}
                onSelect={(account) => {
                    queryClient.setQueryData(
                        ['deposit-account', value],
                        account
                    )
                    onSelect?.(account)
                    setPickerState?.(false)
                }}
                onOpenChange={setPickerState}
                onSearchChange={(searchValue) => {
                    bulkSetFilter(
                        [
                            {
                                displayText: 'Type',
                                field: 'type',
                            },
                            {
                                displayText: 'Type',
                                field: 'description',
                            },
                        ],
                        {
                            displayText: '',
                            mode: 'equal',
                            dataType: 'text',
                            value: searchValue,
                        }
                    )
                }}
                renderItem={(account) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <span className="text-ellipsis text-foreground/80">
                                {account.description}{' '}
                                {account.description && (
                                    <BadgeCheckFillIcon className="ml-2 inline size-2 text-primary" />
                                )}
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
            {!disabledButton && (
                <Button
                    type="button"
                    variant="secondary"
                    disabled={disabled}
                    onClick={() => setPickerState?.(true)}
                    className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
                >
                    <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                        <span className="inline-flex w-full items-center gap-x-2">
                            <div>{isFetching ? <LoadingSpinner /> : ''}</div>
                            {!selectedAccount ? (
                                <span className="text-foreground/70">
                                    {value ||
                                        placeholder ||
                                        'Select deposit account'}
                                </span>
                            ) : (
                                <span>{selectedAccount.description}</span>
                            )}
                        </span>
                        <span className="mr-1 font-mono text-sm text-foreground/30">
                            #
                            {selectedAccount?.id
                                ? abbreviateUUID(selectedAccount.id)
                                : '?'}
                        </span>
                    </span>
                    <ChevronDownIcon />
                </Button>
            )}
        </>
    )
}

export default DepositAccountPicker
