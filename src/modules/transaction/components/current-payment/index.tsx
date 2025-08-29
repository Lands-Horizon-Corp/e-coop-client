import { useCallback, useState } from 'react'

import { toast } from 'sonner'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import { cn } from '@/helpers'
import { commaSeparators } from '@/helpers/common-helper'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { useFilteredPaginatedGeneralLedger } from '@/modules/general-ledger'
import { PaginationState } from '@tanstack/react-table'

import { LedgerSourceBadge } from '@/components/badges/ledger-source-badge'
import CopyTextButton from '@/components/copy-text-button'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import useFilterState from '@/hooks/use-filter-state'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { TEntityId } from '@/types'

import PaymentsEntryListSkeleton from '../skeleton/transaction-payment-entry-skeleton'
import TransactionNoCurrentPaymentFound from './transaction-no-current-payment-found'

type itemgBadgeTypeProps = {
    text: string
    type?:
        | 'default'
        | 'success'
        | 'warning'
        | 'secondary'
        | 'destructive'
        | 'outline'
        | null
        | undefined
    className?: string
}

type CurrentPaymentsEntryListProps = {
    transactionId: TEntityId
    totalAmount?: number
}
const TransactionCurrentPaymentEntry = ({
    transactionId,
    totalAmount,
}: CurrentPaymentsEntryListProps) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 50,
    })
    const { sortingStateBase64 } = useDataTableSorting()

    const { finalFilterPayloadBase64 } = useFilterState({
        defaultFilterMode: 'OR',
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const {
        data: generalLedgerBasedTransaction,
        isLoading,
        isFetching,
        isError,
        error,
        isSuccess,
    } = useFilteredPaginatedGeneralLedger({
        transactionId,
        mode: 'transaction',
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: finalFilterPayloadBase64,
        },
    })

    const handleError = useCallback(
        (error: Error) => {
            toast.error(error?.message || 'Something went wrong')
        },
        [error]
    )

    useQeueryHookCallback({
        data: generalLedgerBasedTransaction,
        error: handleError,
        isError: isError,
        isSuccess: isSuccess,
    })

    if (isLoading) {
        return <PaymentsEntryListSkeleton />
    }

    const hasPayments =
        generalLedgerBasedTransaction &&
        generalLedgerBasedTransaction.data.length > 0
    return (
        <div className="h-full flex flex-col gap-y-2 shadow-md">
            <div className="flex items-center gap-x-2">
                <div className="to-indigo-background/10 flex-grow rounded-xl border-[0.1px] border-primary/30 bg-gradient-to-br from-primary/10 p-2">
                    <div className="flex items-center justify-between gap-x-2">
                        <label className="text-sm font-bold uppercase text-muted-foreground">
                            Total Amount
                        </label>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            ₱{' '}
                            {totalAmount
                                ? commaSeparators(totalAmount.toString())
                                : '0.00'}
                        </p>
                    </div>
                </div>
            </div>
            <ScrollArea className="flex h-[60vh] max-h-[60vh] overflow-x-auto">
                <div className="space-y-1.5">
                    {hasPayments ? (
                        generalLedgerBasedTransaction.data.map(
                            (payment, idx) => (
                                <div>
                                    <Card
                                        key={idx}
                                        className="!bg-background/90 p-3"
                                    >
                                        <CardContent
                                            className={cn('w-full p-0 pr-1')}
                                        >
                                            <div className="flex w-full items-center gap-x-2">
                                                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <LedgerSourceBadge
                                                        source={payment.source}
                                                        className="rounded-lg size-10 flex items-center justify-center"
                                                        showValue={false}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <div className="b flex w-full items-center gap-x-2">
                                                        <p className="grow flex flex-col">
                                                            <span className="inline-flex items-center gap-x-2 text-sm font-semibold">
                                                                {
                                                                    payment
                                                                        .account
                                                                        ?.name
                                                                }
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground">
                                                                {dateAgo(
                                                                    payment.created_at
                                                                )}
                                                            </span>
                                                        </p>

                                                        <p className="text-primary">
                                                            ₱{' '}
                                                            {commaSeparators(
                                                                (
                                                                    payment.credit ||
                                                                    payment.debit ||
                                                                    0
                                                                ).toString()
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Accordion
                                                type="single"
                                                collapsible
                                                className="w-full mt-2"
                                            >
                                                <AccordionItem
                                                    value="item-1"
                                                    className={cn('border-0')}
                                                >
                                                    <AccordionTrigger
                                                        className={cn(
                                                            'py-0 text-xs'
                                                        )}
                                                    >
                                                        view details
                                                    </AccordionTrigger>
                                                    <AccordionContent className="py-2">
                                                        <PaymentsEntryItem
                                                            label="reference number"
                                                            copyText={
                                                                payment.reference_number
                                                            }
                                                            value={
                                                                payment.reference_number
                                                            }
                                                        />
                                                        <PaymentsEntryItem
                                                            label="payment type"
                                                            value={
                                                                payment.type_of_payment_type
                                                            }
                                                        />
                                                        <PaymentsEntryItem
                                                            label="print number"
                                                            value={String(
                                                                payment.print_number
                                                            )}
                                                        />
                                                        <PaymentsEntryItem
                                                            label="note"
                                                            value={
                                                                payment.description
                                                            }
                                                        />
                                                        {[
                                                            'online',
                                                            'bank',
                                                            'check',
                                                        ].includes(
                                                            payment.payment_type
                                                                ?.type ?? ''
                                                        ) && (
                                                            <>
                                                                <Separator className="my-2" />
                                                                <PaymentsEntryItem
                                                                    label="Bank Details"
                                                                    className="font-bold"
                                                                />
                                                                <PaymentsEntryItem
                                                                    label="name"
                                                                    value={
                                                                        payment
                                                                            .bank
                                                                            ?.name
                                                                    }
                                                                />
                                                                <PaymentsEntryItem
                                                                    label="reference number"
                                                                    value={
                                                                        payment.bank_reference_number
                                                                    }
                                                                />
                                                                <PaymentsEntryItem
                                                                    label="entry date"
                                                                    value={toReadableDate(
                                                                        payment.entry_date
                                                                    )}
                                                                />
                                                                <PaymentsEntryItem
                                                                    label="Proof of Payment"
                                                                    className="font-bold"
                                                                />
                                                                <PreviewMediaWrapper
                                                                    media={
                                                                        payment.proof_of_payment_media ||
                                                                        undefined
                                                                    }
                                                                >
                                                                    <ImageDisplay
                                                                        className="size-20 w-full rounded-xl"
                                                                        src={
                                                                            payment
                                                                                .proof_of_payment_media
                                                                                ?.download_url
                                                                        }
                                                                    />
                                                                </PreviewMediaWrapper>
                                                                <Separator className="my-5" />
                                                            </>
                                                        )}
                                                        <PaymentsEntryItem
                                                            label="Signature"
                                                            className="font-bold"
                                                        />
                                                        <div>
                                                            <PreviewMediaWrapper
                                                                media={
                                                                    payment.signature_media ||
                                                                    undefined
                                                                }
                                                            >
                                                                <ImageDisplay
                                                                    className="size-20 w-full rounded-xl"
                                                                    src={
                                                                        payment
                                                                            .signature_media
                                                                            ?.download_url
                                                                    }
                                                                />
                                                            </PreviewMediaWrapper>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        )
                    ) : (
                        <TransactionNoCurrentPaymentFound />
                    )}
                </div>
            </ScrollArea>
            <MiniPaginationBar
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalPage: generalLedgerBasedTransaction?.totalPage || 0,
                    totalSize: generalLedgerBasedTransaction?.totalSize || 0,
                }}
                disablePageMove={isFetching}
                onNext={({ pageIndex }) =>
                    setPagination((prev) => ({ ...prev, pageIndex }))
                }
                onPrev={({ pageIndex }) =>
                    setPagination((prev) => ({ ...prev, pageIndex }))
                }
            />
        </div>
    )
}

type PaymentsEntryItemProps = {
    icon?: React.ReactNode
    label?: string
    value?: string
    className?: string
    badge?: itemgBadgeTypeProps
    copyText?: string
    labelClassName?: string
    valueClassName?: string
}

export const PaymentsEntryItem = ({
    icon,
    label,
    value,
    className,
    badge,
    copyText,
    labelClassName,
    valueClassName,
}: PaymentsEntryItemProps) => {
    return (
        <div className={cn('my-1 flex w-full flex-grow', className)}>
            <div className="flex gap-x-2">
                <span className="text-muted-foreground">{icon}</span>
                <p
                    className={cn(
                        'text-xs text-muted-foreground',
                        labelClassName
                    )}
                >
                    {label}
                </p>
            </div>
            <div className="grow gap-x-2 text-end text-sm text-accent-foreground">
                <span
                    className={cn(
                        'text-sm text-accent-foreground',
                        valueClassName
                    )}
                >
                    {value}
                </span>
                {badge && (
                    <Badge
                        className={cn('', badge.className)}
                        variant={badge.type || 'default'}
                    >
                        {badge.text}
                    </Badge>
                )}
                {copyText && (
                    <CopyTextButton
                        className="ml-2"
                        textContent={value ?? ''}
                    />
                )}
            </div>
        </div>
    )
}

export default TransactionCurrentPaymentEntry
