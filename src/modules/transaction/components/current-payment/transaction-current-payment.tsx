import { useCallback } from 'react'

import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { cn } from '@/helpers'
import { currencyFormat } from '@/modules/currency'
import { useGetAllGeneralLedger } from '@/modules/general-ledger'
import { useGetUserSettings } from '@/modules/user-profile'

import CopyTextButton from '@/components/copy-text-button'
import { RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { TEntityId } from '@/types'

import {
    ITransaction,
    TransactionFromSchema,
    useGetTransactionById,
} from '../..'
import { paymentORResolver } from '../../transaction.utils'
import TransactionHistory from '../history'
import ReferenceNumber from '../input/transaction-reference-number-field'
import TransactionCurrentPaymentItem from './transaction-current-payment-item'

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
    transaction: ITransaction
    totalAmount?: number
    fullPath: string

    form: UseFormReturn<z.infer<typeof TransactionFromSchema>>
}
const TransactionCurrentPaymentEntry = ({
    fullPath,
    transactionId,
    transaction,
    totalAmount,
    form,
}: CurrentPaymentsEntryListProps) => {
    const { payment_or_allow_user_input, userOrganization } =
        useGetUserSettings()

    const {
        data: generalLedgerBasedTransaction,
        isLoading,
        isError,
        isSuccess,
        isRefetching,
        refetch: refetchGeneralLedger,
    } = useGetAllGeneralLedger({
        transactionId,
        mode: 'transaction',
        options: {
            retry: 0,
            enabled: !!transactionId,
        },
    })

    const {
        data: getTransaction,
        isSuccess: isSuccessGetTransaction,
        isError: isErrorGetTransaction,
    } = useGetTransactionById({
        id: transactionId,
    })

    const handleError = useCallback((error: Error) => {
        toast.error(error?.message || 'Something went wrong')
    }, [])

    useQeueryHookCallback({
        data: getTransaction,
        error: handleError,
        isError: isErrorGetTransaction,
        isSuccess: isSuccessGetTransaction,
        onSuccess: (data) => {
            form.setValue('member_profile', data.member_profile)
            form.setValue('member_profile_id', data.member_profile_id)
        },
    })

    useQeueryHookCallback({
        data: generalLedgerBasedTransaction,
        error: handleError,
        isError: isError,
        isSuccess: isSuccess,
    })

    return (
        <div className="flex min-h-full h-fit flex-col gap-y-2 mb-2 p-4 overflow-hidden rounded-2xl bg-card/50">
            <div className="flex space-x-2">
                <div className="flex gap-1 bg-linear-to-br from-primary/10 to-background border border-primary/10  rounded-lg p-2">
                    <div>
                        <Form {...form}>
                            <div className="flex flex-wrap gap-3 items-start w-full">
                                <FormFieldWrapper
                                    control={form.control}
                                    labelClassName="text-xs font-medium relative text-muted-foreground"
                                    name="reference_number"
                                    render={({ field }) => (
                                        <ReferenceNumber
                                            {...field}
                                            disabled={
                                                !payment_or_allow_user_input
                                            }
                                            id={field.name}
                                            onChange={field.onChange}
                                            placeholder="Reference Number"
                                            ref={field.ref}
                                            value={field.value}
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    className=""
                                    control={form.control}
                                    labelClassName="text-xs font-medium text-muted-foreground"
                                    name="or_auto_generated"
                                    render={({ field }) => (
                                        <div className="flex items-center">
                                            <Switch
                                                checked={field.value}
                                                className="mr-2 max-h-4 max-w-9"
                                                onCheckedChange={(value) => {
                                                    field.onChange(value)
                                                    if (value) {
                                                        form.setValue(
                                                            'reference_number',
                                                            paymentORResolver(
                                                                userOrganization
                                                            ),
                                                            {
                                                                shouldDirty: true,
                                                            }
                                                        )
                                                    }
                                                }}
                                                thumbClassName="size-3"
                                            />
                                            <Label className="text-xs font-medium text-muted-foreground mr-1">
                                                OR Auto Generated
                                            </Label>
                                            <Label className="text-xs font-medium text-muted-foreground">
                                                Press Alt{' '}
                                                <KbdGroup>
                                                    <Kbd>Alt</Kbd>
                                                    <span>+</span>
                                                    <Kbd>E</Kbd>
                                                </KbdGroup>
                                            </Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </Form>
                    </div>

                    <Button
                        disabled={isRefetching}
                        onClick={(e) => {
                            e.preventDefault()
                            refetchGeneralLedger()
                        }}
                        size="icon-sm"
                        variant="ghost"
                    >
                        {isRefetching ? <LoadingSpinner /> : <RefreshIcon />}
                    </Button>
                    <TransactionHistory fullPath={fullPath} />
                </div>
                <div className="flex-1 flex py-5 flex-col min-w-[8rem] items-center justify-center bg-linear-to-br from-primary/10 to-background/10 border border-primary/10 rounded-lg h-full w-full gap-x-1">
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                        Total Amount
                    </p>
                    <p className="text-lg font-bold text-primary dark:text-primary">
                        {currencyFormat(totalAmount || 0, {
                            currency: transaction?.currency,
                            showSymbol: !!transaction?.currency,
                        })}
                    </p>
                </div>
            </div>
            {/* <Separator /> */}
            <TransactionCurrentPaymentItem
                currentPayment={generalLedgerBasedTransaction || []}
                handleRefetchTransaction={() => refetchGeneralLedger()}
                isLoading={isLoading}
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
        <div className={cn('my-1 flex w-full grow', className)}>
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
            <div className="grow gap-x-2 text-end text-sm ">
                <span className={cn('text-sm ', valueClassName)}>{value}</span>
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
