import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ReceiptTextIcon, FileTextIcon } from 'lucide-react'
import { EmptyIcon, ReceiptIcon, TrashIcon } from '@/components/icons'

import { cn } from '@/lib'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { commaSeparators } from '@/helpers'
import { Badge } from '@/components/ui/badge'
import { ITransactionEntryRequest } from '@/types'
import CopyTextButton from '@/components/copy-text-button'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { usePaymentsDataStore } from '@/store/transaction/payments-entry-store'

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

const PaymentsEntryItem = ({
    icon,
    label,
    value,
    className,
    badge,
    copyText,
}: PaymentsEntryItemProps) => {
    return (
        <>
            <div className={cn('my-1 flex w-full flex-grow', className)}>
                <div className="flex gap-x-2">
                    <span className="text-muted-foreground">{icon}</span>
                    <p className="text-sm text-muted-foreground">{label}</p>
                </div>
                <div className="grow gap-x-2 text-end text-sm text-accent-foreground">
                    {value}
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
        </>
    )
}

type CurrentPaymentsEntryListProps = {
    data: ITransactionEntryRequest[]
}

const CurrentPaymentsEntryList = ({ data }: CurrentPaymentsEntryListProps) => {
    const hasPayments = data.length > 0
    const { deletePaymentByIndex } = usePaymentsDataStore()
    const { onOpen } = useConfirmModalStore()

    return (
        <div className="h-full space-y-2" aria-live="polite">
            {hasPayments ? (
                data.map((payment, idx) => (
                    <Card key={idx} className="!bg-background/90 p-2">
                        <CardContent className={cn('w-full p-0 pr-1')}>
                            <div className="flex w-full items-center gap-x-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <ReceiptTextIcon className="size-5" />
                                </div>
                                <div className="w-full">
                                    <div className="b flex w-full items-center gap-x-2">
                                        <p className="grow">
                                            <span className="inline-flex items-center gap-x-2 text-sm font-semibold">
                                                {payment.account?.description}
                                                <TrashIcon
                                                    size={16}
                                                    onClick={() => {
                                                        onOpen({
                                                            title: 'Remove Transaction',
                                                            description: `Are you sure you want to delete this ${payment.account?.description} transaction?`,
                                                            onConfirm: () => {
                                                                deletePaymentByIndex(
                                                                    idx
                                                                )
                                                            },
                                                            confirmString:
                                                                'delete',
                                                        })
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                            </span>
                                        </p>
                                        <p className="text-primary">
                                            ₱{' '}
                                            {payment.amount
                                                ? commaSeparators(
                                                      payment.amount.toString()
                                                  )
                                                : '0.00'}
                                        </p>
                                    </div>
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
                                                className={cn('py-0 text-xs')}
                                            >
                                                view details
                                            </AccordionTrigger>
                                            <AccordionContent className="py-2">
                                                <PaymentsEntryItem
                                                    label="OR number"
                                                    copyText={
                                                        payment.reference_number
                                                    }
                                                    icon={<ReceiptIcon />}
                                                    value={
                                                        payment.reference_number
                                                    }
                                                />
                                                <PaymentsEntryItem
                                                    label="Accounts value"
                                                    icon={
                                                        <FileTextIcon className="size-4 text-muted-foreground" />
                                                    }
                                                    value={
                                                        payment.account
                                                            ?.description
                                                    }
                                                />
                                                <PaymentsEntryItem
                                                    label="Payment type"
                                                    icon={
                                                        <FileTextIcon className="size-4 text-muted-foreground" />
                                                    }
                                                    value={
                                                        payment.account
                                                            ?.general_ledger_type
                                                    }
                                                />
                                                {/* {payment.account && (
                                                    <PaymentsEntryItem
                                                        label="Print"
                                                        icon={
                                                            <PrinterIcon className="size-4" />
                                                        }
                                                        badge={{
                                                            text: 'yes',
                                                            type: 'outline',
                                                            className:
                                                                'py-0 bg-transparent text-primary border-primary',
                                                        }}
                                                    />
                                                )} */}
                                                {/* {payment.notes && (
                                                    <PaymentsEntryItem
                                                        label="Notes"
                                                        icon={
                                                            <StickyNoteIcon className="size-4 text-muted-foreground" />
                                                        }
                                                        value={payment.notes}
                                                        className="italic"
                                                    />
                                                )} */}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <NoCurrentPayment />
            )}
        </div>
    )
}

export default memo(CurrentPaymentsEntryList)
