import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'

import GenericPicker from './generic-picker'

import { useShortcut } from '../use-shorcuts'
import useFilterState from '@/hooks/use-filter-state'
import { abbreviateUUID } from '@/utils/formatting-utils'
import { useFilteredPaginatedAccount } from '@/hooks/api-hooks/use-account'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'

import { TEntityId } from '@/types'
import { IAccount } from '@/types/coop-types/accounts/account'

import { useQueryClient } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'

import { useState } from 'react'

interface Props {
    value?: TEntityId
    disabled?: boolean
    placeholder?: string
    onSelect?: (selectedAccount: IAccount) => void
    allowShorcutCommand?: boolean
    modalOnly?: boolean
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?(open: boolean): void
}

const AccountPicker = ({
    value,
    disabled,
    allowShorcutCommand = false,
    placeholder,
    onSelect,
    modalOnly = false,
    onOpenChange,
    open,
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
        useFilteredPaginatedAccount({
            filterPayload: finalFilterPayload,
            pagination,
            enabled: !disabled,
            showMessage: false,
        })

    const selectedAccount = data.data.find((account) => account.id === value)

    useShortcut(
        'Enter',
        (event) => {
            event?.preventDefault()
            if (
                !selectedAccount &&
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
                open={modalOnly ? open : state}
                listHeading={`Matched Results (${data.totalSize})`}
                searchPlaceHolder="Search account name"
                isLoading={isPending || isLoading || isFetching}
                onSelect={(account) => {
                    queryClient.setQueryData(['account', value], account)
                    onSelect?.(account)
                    setState(false)
                }}
                onOpenChange={modalOnly ? onOpenChange : setState}
                onSearchChange={(searchValue) => {
                    bulkSetFilter(
                        [
                            { displayText: 'name', field: 'Name' },
                            {
                                displayText: 'alternative-code',
                                field: 'Alternative Code',
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
                renderItem={(Account) => (
                    <div className="flex w-full items-center justify-between py-1">
                        <div className="flex items-center gap-x-2">
                            <span className="text-ellipsis text-foreground/80">
                                {Account.name}
                            </span>
                        </div>

                        <p className="mr-2 font-mono text-xs italic text-foreground/40">
                            <span>#{abbreviateUUID(Account.id)}</span>
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
            {!modalOnly && (
                <Button
                    type="button"
                    variant="secondary"
                    disabled={disabled}
                    onClick={() => setState((prev) => !prev)}
                    className="w-full items-center justify-between rounded-md border bg-background p-0 px-2"
                >
                    <span className="justify-betweentext-sm inline-flex w-full items-center text-foreground/90">
                        <span className="inline-flex w-full items-center gap-x-2">
                            <div>{isFetching ? <LoadingSpinner /> : ''}</div>
                            {!selectedAccount ? (
                                <span className="text-foreground/70">
                                    {value || placeholder || 'Select Account'}
                                </span>
                            ) : (
                                <span>{selectedAccount.name}</span>
                            )}
                        </span>
                        {allowShorcutCommand && (
                            <span className="mr-2 text-sm">⌘ ↵ </span>
                        )}
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

export default AccountPicker
