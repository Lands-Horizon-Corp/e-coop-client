import { memo, useState } from 'react'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import { commaSeparators } from '@/helpers'
import { cn } from '@/lib'
import { dateAgo, toReadableDate } from '@/utils'
import { PaginationState } from '@tanstack/react-table'

import { LedgerSourceBadge } from '@/components/badges/ledger-source-badge'
import CopyTextButton from '@/components/copy-text-button'
import { EmptyIcon } from '@/components/icons'
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
import { Skeleton } from '@/components/ui/skeleton'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useFilteredPaginatedGeneralLedger } from '@/hooks/api-hooks/use-general-ledger'
import useFilterState from '@/hooks/use-filter-state'

import { TEntityId } from '@/types'

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

const NoCurrentPayment = () => {
    return (
        <Card
            className={cn(
                'flex h-full min-h-60 flex-col items-center justify-center gap-2 rounded-3xl bg-background p-2 shadow-md'
            )}
        >
            <div className="flex flex-col items-center gap-y-1">
                <EmptyIcon
                    size={23}
                    className="text-gray-400 dark:text-gray-300"
                />
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    No Payments Found
                </h2>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    There are currently no processed payments. Try reloading the
                    page.
                </p>
            </div>
        </Card>
    )
}

NoCurrentPayment.displayName = 'NoCurrentPayment'

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

type CurrentPaymentsEntryListProps = {
    transactionId: TEntityId
    totalAmount?: number
}

const PaymentsEntryListSkeleton = () => {
    return (
        <div className="h-full space-y-2">
            {[...Array(5)].map((_, idx) => (
                <Card key={idx} className="!bg-background/90 p-2">
                    <CardContent className={cn('w-full p-0 pr-1')}>
                        <div className="flex  px-2 w-full items-center gap-x-2">
                            <Skeleton className="size-8 rounded-full" />
                            <div className="w-full space-y-1">
                                <div className="mt-2 flex flex-col w-full items-start space-y-2">
                                    <Skeleton className="h-4 w-1/2 rounded" />
                                    <Skeleton className="h-4 w-1/4 rounded" />
                                </div>
                                <div className="h-3 w-1/3 rounded" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

const CurrentPaymentsEntryList = ({
    transactionId,
    totalAmount,
}: CurrentPaymentsEntryListProps) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 50,
    })

    const { finalFilterPayload } = useFilterState({
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
    } = useFilteredPaginatedGeneralLedger({
        filterPayload: finalFilterPayload,
        transactionId,
        pagination: pagination,
        mode: 'transaction',
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
                        <NoCurrentPayment />
                    )}
                </div>
            </ScrollArea>
            <MiniPaginationBar
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalPage: generalLedgerBasedTransaction.totalPage,
                    totalSize: generalLedgerBasedTransaction.totalSize,
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

export default memo(CurrentPaymentsEntryList)
