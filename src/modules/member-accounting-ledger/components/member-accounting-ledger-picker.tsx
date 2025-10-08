import { forwardRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { type TFilterObject } from '@/contexts/filter-context'
import { cn, formatNumber } from '@/helpers'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { PaginationState } from '@tanstack/react-table'

import { BookIcon, ChevronDownIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericPicker from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'

import { TEntityId } from '@/types'

import {
    TMemberAccountingLedgerHookMode,
    useFilteredPaginatedMemberAccountingLedger,
} from '../member-accounting-ledger.service'
import { IMemberAccountingLedger } from '../member-accounting-ledger.types'

interface Props extends IPickerBaseProps<IMemberAccountingLedger> {
    mode?: TMemberAccountingLedgerHookMode
    memberProfileId?: TEntityId
    defaultFilter?: TFilterObject
    allowShorcutCommand?: boolean
}

const MemberAccountingLedgerPicker = forwardRef<
    HTMLButtonElement,
    Props &
        ({ mode: 'branch' } | { mode: 'member'; memberProfileId: TEntityId })
>(
    (
        {
            value,
            disabled,
            modalState,
            placeholder,
            mode = 'branch',
            memberProfileId,
            triggerClassName,
            onSelect,
        },
        ref
    ) => {
        const queryClient = useQueryClient()
        const [state, setState] = useInternalState(
            false,
            modalState?.open,
            modalState?.onOpenChange
        )

        const [pagination, setPagination] = useState<PaginationState>({
            pageIndex: 0,
            pageSize: PICKERS_SELECT_PAGE_SIZE,
        })

        const { finalFilterPayloadBase64, bulkSetFilter } = useFilterState({
            defaultFilterMode: 'OR',
            onFilterChange: () =>
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: PAGINATION_INITIAL_INDEX,
                })),
        })

        const {
            data: { data = [], totalPage = 1, totalSize = 0 } = {},
            isPending,
            isLoading,
            isFetching,
        } = useFilteredPaginatedMemberAccountingLedger({
            mode,
            memberProfileId,
            query: {
                filter: finalFilterPayloadBase64,
                ...pagination,
            },
            options: {
                enabled: !disabled && (mode === 'branch' || !!memberProfileId),
            },
        })

        const displayLedgerInfo = (ledger: IMemberAccountingLedger) => {
            return `${ledger.account?.name || 'Unknown Account'} - ${ledger.balance ? formatNumber(ledger.balance) : '0'}`
        }

        return (
            <>
                <GenericPicker
                    isLoading={isPending || isLoading || isFetching}
                    items={data}
                    listHeading={`Matched Results (${totalSize})`}
                    onOpenChange={setState}
                    onSearchChange={(searchValue) => {
                        bulkSetFilter(
                            [
                                {
                                    displayText: 'account name',
                                    field: 'account.name',
                                },
                                {
                                    displayText: 'member name',
                                    field: 'member_profile.full_name',
                                },
                                {
                                    displayText: 'amount',
                                    field: 'amount',
                                },
                                {
                                    displayText: 'description',
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
                    onSelect={(ledger) => {
                        queryClient.setQueryData(
                            ['member-accounting-ledger', value],
                            ledger
                        )
                        onSelect?.(ledger)
                        setState(false)
                    }}
                    open={state}
                    renderItem={(ledger) => (
                        <div className="flex w-full items-center justify-between py-1">
                            <div className="flex items-center gap-x-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                                    <BookIcon className="size-4 text-primary" />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm text-foreground/80">
                                        {ledger.account?.name ||
                                            'Unknown Account'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {ledger.member_profile?.full_name ||
                                            'No member'}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-medium text-foreground">
                                    {ledger.balance
                                        ? formatNumber(ledger.balance)
                                        : '0'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {ledger.account.name || 'No description'}
                                </p>
                            </div>
                        </div>
                    )}
                    searchPlaceHolder="Search account name, member, or amount..."
                >
                    <MiniPaginationBar
                        disablePageMove={isFetching}
                        onNext={({ pageIndex }) =>
                            setPagination((prev) => ({ ...prev, pageIndex }))
                        }
                        onPrev={({ pageIndex }) =>
                            setPagination((prev) => ({ ...prev, pageIndex }))
                        }
                        pagination={{
                            pageIndex: pagination.pageIndex,
                            pageSize: pagination.pageSize,
                            totalPage: totalPage,
                            totalSize: totalSize,
                        }}
                    />
                </GenericPicker>

                <Button
                    className={cn(
                        'w-full items-center justify-between rounded-md border p-0 px-2',
                        triggerClassName
                    )}
                    disabled={disabled}
                    onClick={() => setState(true)}
                    ref={ref}
                    type="button"
                    variant="secondary"
                >
                    <span className="inline-flex w-full items-center justify-between text-sm text-foreground/90">
                        <span className="inline-flex w-full items-center gap-x-2">
                            <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                                {isFetching ? (
                                    <LoadingSpinner className="size-3" />
                                ) : (
                                    <BookIcon className="size-3 text-primary" />
                                )}
                            </div>
                            {!value ? (
                                <span className="text-foreground/70">
                                    {placeholder || 'Select accounting ledger'}
                                </span>
                            ) : (
                                <span>{displayLedgerInfo(value)}</span>
                            )}
                        </span>
                    </span>
                    <ChevronDownIcon />
                </Button>
            </>
        )
    }
)

MemberAccountingLedgerPicker.displayName = 'MemberAccountingLedgerPicker'

export default MemberAccountingLedgerPicker
