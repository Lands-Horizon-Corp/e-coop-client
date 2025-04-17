import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
    EmptyIcon,
    PrinterIcon,
    ReceiptIcon,
    TrashIcon,
} from '@/components/icons'
import { IPaymentsEntry } from '@/server/types/transactions/payments-entry'
import { ReceiptTextIcon, FileTextIcon } from 'lucide-react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib'
import { commaSeparators } from '@/helpers'
import { Badge } from '@/components/ui/badge'
import CopyTextButton from '@/components/copy-text-button'
import { usePaymentsDataStore } from '@/store/transaction/payments-entry-store'
import useConfirmModalStore from '@/store/confirm-modal-store'

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

const PaymentsEntryItem = ({
    icon,
    label,
    value,
    className,
    badge,
    copyText,
    valueClassName,
}: PaymentsEntryItemProps) => {
    return (
        <>
            <div className={cn('my-1 flex w-full flex-grow', className)}>
                <div className="flex grow items-center gap-x-2">
                    <span className="text-muted-foreground">{icon}</span>
                    <p className="text-sm text-sidebar-foreground dark:text-muted-foreground">
                        {label}
                    </p>
                </div>
                <div
                    className={cn(
                        'flex items-center gap-x-2 text-end text-sm text-accent-foreground'
                    )}
                >
                    <div className={cn('grow', valueClassName)}>{value}</div>
                    <div className="">
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
                                className=""
                                textContent={value ?? ''}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

type CurrentPaymentsEntryListProps = {
    data: IPaymentsEntry[]
}

const CurrentPaymentsEntryList = ({ data }: CurrentPaymentsEntryListProps) => {
    const hasPayments = data.length > 0
    const { deletePaymentByIndex } = usePaymentsDataStore()
    const { onOpen } = useConfirmModalStore()

    return (
        <div className="h-full space-y-2" aria-live="polite">
            {hasPayments ? (
                data.map((payment, idx) => (
                    <Card
                        key={`${payment.ORNumber}-${idx}`}
                        className="!bg-background/90"
                    >
                        <CardContent
                            className={cn(
                                'w-full p-2 px-4 pr-1 hover:bg-secondary/50'
                            )}
                        >
                            <div className="flex w-full items-center gap-x-2">
                                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <ReceiptTextIcon className="size-5" />
                                </div>
                                <div className="w-full">
                                    <div className="b flex w-full items-center gap-x-2">
                                        <p className="grow">
                                            <span className="inline-flex items-center gap-x-2 text-sm font-semibold">
                                                {payment.account.description}
                                                <TrashIcon
                                                    size={16}
                                                    onClick={() => {
                                                        onOpen({
                                                            title: 'Remove Transaction',
                                                            description: `Are you sure you want to delete this ${payment.account.description} transaction?`,
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
                                                    copyText={payment.ORNumber.toString()}
                                                    valueClassName="rounded-lg px-2 text-lg font-semibold tracking-wide bg-secondary/30"
                                                    icon={<ReceiptIcon />}
                                                    value={payment.ORNumber.toString()}
                                                />
                                                <PaymentsEntryItem
                                                    label="Accounts Name"
                                                    icon={
                                                        <FileTextIcon className="size-4 text-muted-foreground" />
                                                    }
                                                    value={
                                                        payment.account
                                                            .description
                                                    }
                                                />
                                                <PaymentsEntryItem
                                                    label="Payment Type"
                                                    icon={
                                                        <FileTextIcon className="size-4 text-muted-foreground" />
                                                    }
                                                    value={payment.paymentType}
                                                />
                                                {payment.isPrinted && (
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
                                                )}
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
