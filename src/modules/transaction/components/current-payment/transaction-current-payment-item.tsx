import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { commaSeparators } from '@/helpers/common-helper'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { IGeneralLedgerResponse } from '@/modules/general-ledger'
import { LedgerSourceBadge } from '@/modules/general-ledger/components/ledger-source-badge'
import { useSingleReverseTransaction } from '@/modules/transaction'
import { useTransactionReverseSecurityStore } from '@/store/transaction-reverse-security-store'

import { RedoIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { TEntityId } from '@/types'

import PaymentsEntryListSkeleton from '../skeleton/transaction-payment-entry-skeleton'
import { PaymentsEntryItem } from './transaction-current-payment'
import TransactionNoCurrentPaymentFound from './transaction-no-current-payment-found'

type TTransactionCurrentPaymentItemProps = {
    isLoading: boolean
    hasPayments?: boolean
    currentPayment: IGeneralLedgerResponse[]
}

const TransactionCurrentPaymentItem = ({
    isLoading,
    hasPayments,
    currentPayment,
}: TTransactionCurrentPaymentItemProps) => {
    const queryClient = useQueryClient()
    const { onOpenReverseRequestAction } = useTransactionReverseSecurityStore()
    const { mutate: reverseSinglePayment } = useSingleReverseTransaction({
        options: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        'general-ledger',
                        'filtered-paginated',
                        'transaction',
                    ],
                    exact: false,
                })
            },
            onError: (error) => {
                toast.error(error.message)
            },
        },
    })

    const handleReversePayment = (general_ledger_id: TEntityId) => {
        onOpenReverseRequestAction({
            onSuccess: () => {
                reverseSinglePayment({ general_ledger_id })
            },
        })
    }

    return (
        <ScrollArea className="flex h-full max-h-[60vh] overflow-x-auto">
            {isLoading ? (
                <PaymentsEntryListSkeleton itemNumber={4} />
            ) : (
                <div className="space-y-1.5">
                    {hasPayments ? (
                        currentPayment.map((payment, idx) => (
                            <div>
                                <Card key={idx} className="!bg-background/90">
                                    <CardContent className={cn('w-full !p-0')}>
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem
                                                value="item-1"
                                                className={cn('border-0')}
                                            >
                                                <AccordionTrigger
                                                    className={cn(
                                                        'p-2 text-xs hover:!no-underline flex w-full gap-x-2'
                                                    )}
                                                >
                                                    <ActionTooltip
                                                        delayDuration={300}
                                                        tooltipContent="this will reverse the transaction by creating another payment but in reverse"
                                                    >
                                                        <div className="flex size-8 items-center border p-1 justify-center rounded-full bg-primary/10 text-primary">
                                                            <RedoIcon
                                                                size={20}
                                                                className="cursor-pointer hover:opacity-65"
                                                                title="Reverse Payment"
                                                                role="button"
                                                                aria-label="Reverse Payment"
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    event.stopPropagation()
                                                                    handleReversePayment(
                                                                        payment.id
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </ActionTooltip>
                                                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        <LedgerSourceBadge
                                                            source={
                                                                payment.source
                                                            }
                                                            className="rounded-lg size-10 flex items-center justify-center"
                                                            showValue={false}
                                                        />
                                                    </div>
                                                    <div className="b flex w-full items-center gap-x-2">
                                                        <div className="grow flex">
                                                            <div className="flex flex-col items-start">
                                                                <span className="items-center text-sm font-semibold">
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
                                                            </div>
                                                        </div>
                                                        <p className="text-primary text-sm">
                                                            <span className="text-xs mr-1 text-muted-foreground">
                                                                {payment.credit >
                                                                0
                                                                    ? 'Credit'
                                                                    : 'Debit'}
                                                            </span>
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
                                                </AccordionTrigger>
                                                <AccordionContent className="py-2 mr-3 pl-2">
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
                                                                    payment.bank
                                                                        ?.name
                                                                }
                                                            />
                                                            <PaymentsEntryItem
                                                                label="reference number"
                                                                value={
                                                                    payment.bank_reference_number
                                                                }
                                                            />

                                                            {payment.entry_date && (
                                                                <PaymentsEntryItem
                                                                    label="entry date"
                                                                    value={toReadableDate(
                                                                        payment.entry_date
                                                                    )}
                                                                />
                                                            )}
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
                        ))
                    ) : (
                        <TransactionNoCurrentPaymentFound />
                    )}
                </div>
            )}
        </ScrollArea>
    )
}

export default TransactionCurrentPaymentItem
