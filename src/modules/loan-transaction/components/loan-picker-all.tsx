import { forwardRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { type TFilterObject } from '@/contexts/filter-context'
import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { PaginationState } from '@tanstack/react-table'

import {
    ChevronDownIcon,
    CreditCardIcon,
    RefreshIcon,
} from '@/components/icons'
import GenericPicker from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'
import { useShortcut } from '@/hooks/use-shorcuts'

import { TEntityId } from '@/types'

import {
    ILoanTransaction,
    TLoanTransactionHookModeGetAll,
    useGetAllLoanTransaction,
} from '..'

interface Props extends IPickerBaseProps<ILoanTransaction> {
    mode?: TLoanTransactionHookModeGetAll
    memberProfileId?: TEntityId
    defaultFilter?: TFilterObject
    allowShorcutCommand?: boolean
    accountId?: TEntityId
}

const LoanPickerAll = forwardRef<
    HTMLButtonElement,
    Props &
        (
            | { mode: 'branch' }
            | {
                  mode: 'member-profile'
                  memberProfileId: TEntityId
              }
            | {
                  mode: 'member-profile-loan-account'
                  memberProfileId: TEntityId
                  accountId: TEntityId
              }
        )
>(
    (
        {
            value,
            disabled,
            modalState,
            placeholder,
            mode = 'branch',
            memberProfileId,
            allowShorcutCommand = false,
            triggerClassName,
            accountId,
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
            data = [],
            isPending,
            isLoading,
            isFetching,
            refetch,
        } = useGetAllLoanTransaction({
            mode,
            memberProfileId,
            loanAccountId: accountId,
            query: {
                filter: finalFilterPayloadBase64,
                ...pagination,
            },
            options: {
                enabled:
                    !disabled &&
                    (mode === 'branch' || !!memberProfileId) &&
                    state,
                retry: 0,
            },
        })

        useShortcut(
            'Enter',
            (event) => {
                event?.preventDefault()
                if (
                    !value &&
                    !disabled &&
                    !isPending &&
                    !isLoading &&
                    !isFetching &&
                    allowShorcutCommand
                ) {
                    setState(true)
                }
            },
            { disableTextInputs: true }
        )

        const displayLoanInfo = (loan: ILoanTransaction) => {
            return `${loan.account?.name || 'Unknown Loan'} - ${loan.applied_1?.toLocaleString() || '0'}`
        }

        return (
            <>
                <GenericPicker
                    isLoading={isPending || isLoading || isFetching}
                    items={data}
                    listHeading={`Matched Results (${data.length})`}
                    onOpenChange={setState}
                    onSearchChange={(searchValue) => {
                        bulkSetFilter(
                            [
                                {
                                    displayText: 'loan type',
                                    field: 'loan_type',
                                },
                                {
                                    displayText: 'OR number',
                                    field: 'official_receipt_number',
                                },
                                {
                                    displayText: 'applied amount',
                                    field: 'applied_1',
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
                    onSelect={(loan) => {
                        queryClient.setQueryData(
                            ['loan-transaction', value],
                            loan
                        )
                        onSelect?.(loan)
                        setState(false)
                    }}
                    open={state}
                    otherSearchInputChild={
                        <Button
                            className="size-fit p-2 text-muted-foreground "
                            disabled={isFetching || disabled}
                            onClick={() => refetch()}
                            size="icon"
                            variant="ghost"
                        >
                            {isFetching ? (
                                <LoadingSpinner className="inline" />
                            ) : (
                                <RefreshIcon className="size-4" />
                            )}
                        </Button>
                    }
                    renderItem={(loan) => (
                        <div className="flex w-full items-end justify-between py-1">
                            <div className="flex items-center gap-x-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                                    <CreditCardIcon className="size-4 text-primary" />
                                </div>

                                <div className="flex flex-col gap-y-1">
                                    <span className="text-sm text-foreground/80 capitalize">
                                        {`${loan.account?.name || 'unknown account'}`}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {loan.member_profile?.full_name ||
                                            'No member'}
                                    </span>
                                    <div className="text-xs items-center flex gap-x-4">
                                        <div className="flex items-center gap-x-2">
                                            <span>Amount: </span>{' '}
                                            <p className="font-medium text-primary-foreground bg-primary px-1 py-0.5 rounded-md">
                                                {loan.applied_1?.toLocaleString() ||
                                                    '0'}
                                            </p>
                                        </div>
                                        {loan.balance !== undefined && (
                                            <div className="flex items-center gap-x-2">
                                                <span>Balance: </span>{' '}
                                                <p className="font-medium text-warning-foreground bg-warning px-1 py-0.5 rounded-md">
                                                    {loan.applied_1?.toLocaleString() ||
                                                        '0'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                    {loan.official_receipt_number || 'No OR'}
                                </p>
                                {loan.released_date && (
                                    <span className="text-muted-foreground/60 text-xs">
                                        Released{' '}
                                        {toReadableDate(loan.released_date)} -
                                        {dateAgo(loan.released_date)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    searchPlaceHolder="Search loan type, amount, or OR number..."
                />
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
                            {isFetching && (
                                <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                                    <LoadingSpinner className="size-3" />
                                    {/* <CreditCardIcon className="size-3 text-primary" /> */}
                                </div>
                            )}
                            {!value ? (
                                <span className="text-foreground/70">
                                    {placeholder || 'Select loan'}
                                </span>
                            ) : (
                                <span className="capitalize">
                                    {displayLoanInfo(value)}
                                </span>
                            )}
                        </span>
                        {allowShorcutCommand && (
                            <span className="mr-2 text-sm">⌘ ↵ </span>
                        )}
                        <span className="mr-1 font-mono text-xs text-muted-foreground">
                            {value?.official_receipt_number || ''}
                        </span>
                    </span>
                    <ChevronDownIcon />
                </Button>
            </>
        )
    }
)

LoanPickerAll.displayName = 'Loan Picker'

export default LoanPickerAll
