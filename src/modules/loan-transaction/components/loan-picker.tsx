import { forwardRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { type TFilterObject } from '@/contexts/filter-context'
import { cn } from '@/helpers'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { PaginationState } from '@tanstack/react-table'

import { ChevronDownIcon, CreditCardIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericPicker from '@/components/pickers/generic-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import useFilterState from '@/hooks/use-filter-state'
import { useInternalState } from '@/hooks/use-internal-state'
import { useShortcut } from '@/hooks/use-shorcuts'

import { TEntityId } from '@/types'

import {
    ILoanTransaction,
    TLoanTransactionHookMode,
    useGetPaginatedLoanTransaction,
} from '..'

interface Props extends IPickerBaseProps<ILoanTransaction> {
    mode?: TLoanTransactionHookMode
    memberProfileId?: TEntityId
    defaultFilter?: TFilterObject
    allowShorcutCommand?: boolean
}

const LoanPicker = forwardRef<
    HTMLButtonElement,
    Props &
        (
            | { mode: 'branch' }
            | { mode: 'member-profile'; memberProfileId: TEntityId }
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
        } = useGetPaginatedLoanTransaction({
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
            return `${loan.loan_type || 'Unknown'} - ₱${loan.applied_1?.toLocaleString() || '0'}`
        }

        return (
            <>
                <GenericPicker
                    items={data}
                    open={state}
                    listHeading={`Matched Results (${totalSize})`}
                    searchPlaceHolder="Search loan type, amount, or OR number..."
                    isLoading={isPending || isLoading || isFetching}
                    onSelect={(loan) => {
                        queryClient.setQueryData(
                            ['loan-transaction', value],
                            loan
                        )
                        onSelect?.(loan)
                        setState(false)
                    }}
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
                    renderItem={(loan) => (
                        <div className="flex w-full items-center justify-between py-1">
                            <div className="flex items-center gap-x-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                                    <CreditCardIcon className="size-4 text-primary" />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm text-foreground/80 capitalize">
                                        {loan.loan_type || 'Unknown Loan Type'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {loan.member_profile?.full_name ||
                                            'No member'}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-medium text-foreground">
                                    ₱{loan.applied_1?.toLocaleString() || '0'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {loan.official_receipt_number || 'No OR'}
                                </p>
                            </div>
                        </div>
                    )}
                >
                    <MiniPaginationBar
                        pagination={{
                            pageIndex: pagination.pageIndex,
                            pageSize: pagination.pageSize,
                            totalPage: totalPage,
                            totalSize: totalSize,
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
                    ref={ref}
                    type="button"
                    variant="secondary"
                    disabled={disabled}
                    onClick={() => setState(true)}
                    className={cn(
                        'w-full items-center justify-between rounded-md border p-0 px-2',
                        triggerClassName
                    )}
                >
                    <span className="inline-flex w-full items-center justify-between text-sm text-foreground/90">
                        <span className="inline-flex w-full items-center gap-x-2">
                            <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                                {isFetching ? (
                                    <LoadingSpinner className="size-3" />
                                ) : (
                                    <CreditCardIcon className="size-3 text-primary" />
                                )}
                            </div>
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

LoanPicker.displayName = 'Loan Picker'

export default LoanPicker
