import { zodResolver } from '@hookform/resolvers/zod'

import {
    commaSeparators,
    formatNumberOnBlur,
    isValidDecimalInput,
    sanitizeNumberInput,
} from '@/helpers'
import logger from '@/helpers/loggers/logger'
import { cn } from '@/lib'
import { usePaymentsDataStore } from '@/store/transaction/payments-entry-store'
import { toInputDateString } from '@/utils'
import { useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import {
    TransactionEntryFormValues,
    TransactionEntrySchema,
} from '@/validations/transactions/transaction-entry'

import {
    useGetAllpaymentTypes,
} from '@/hooks/api-hooks/use-payment-type'
import { useCreateTransactionEntry } from '@/hooks/api-hooks/use-transaction-entry'

import {
    GENERAL_LEDGER_SOURCE,
    IClassProps,
    IForm,
    ITransactionEntry,
    ITransactionEntryRequest,
} from '@/types'

interface TransactionEntryFormProps
    extends IClassProps,
        IForm<
            Partial<ITransactionEntryRequest>,
            ITransactionEntry,
            string,
            TransactionEntryFormValues
        > {}

const PaymentsEntryForm = ({ defaultValues }: TransactionEntryFormProps) => {
    const { focusTypePayment, setFocusTypePayment } = usePaymentsDataStore()

    const form = useForm<TransactionEntryFormValues>({
        resolver: zodResolver(TransactionEntrySchema),
        defaultValues: {
            ...defaultValues,
            general_ledger_source: GENERAL_LEDGER_SOURCE[3],
            payment_date: toInputDateString(
                defaultValues?.payment_date ?? new Date()
            ),
        },
    })

    const { isPending, error } = useCreateTransactionEntry()
    const { data: paymentType } = useGetAllpaymentTypes()

    const handleSubmit = form.handleSubmit(
        (data: TransactionEntryFormValues) => {
            logger.log(data)
        }
    )
    let transactionButtonTitle = ''
    const paymentsEntryOnly = GENERAL_LEDGER_SOURCE.filter(
        (source) => source !== 'withdraw' && source !== 'deposit'
    )

    if (
        focusTypePayment &&
        paymentsEntryOnly.includes(
            focusTypePayment as (typeof paymentsEntryOnly)[number]
        )
    ) {
        transactionButtonTitle = 'Pay'
    } else if (focusTypePayment === 'withdraw') {
        transactionButtonTitle = 'Withdraw'
    } else if (focusTypePayment === 'deposit') {
        transactionButtonTitle = 'Deposit'
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit}>
                <FormErrorMessage errorMessage={error} />
                <div>
                    {!['deposit', 'withdraw'].includes(
                        focusTypePayment ?? ''
                    ) && (
                        <FormFieldWrapper
                            control={form.control}
                            label="Source"
                            name="general_ledger_source"
                            className="col-span-4"
                            render={({ field }) => (
                                <FormControl>
                                    <Select
                                        onValueChange={(selectedValue) => {
                                            field.onChange(selectedValue)
                                            setFocusTypePayment(selectedValue)
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            {field.value ||
                                                'select Account Type'}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentType?.map((payment) => {
                                                return (
                                                    <SelectItem
                                                        key={payment.id}
                                                        value={payment.name}
                                                    >
                                                        {payment.name}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    )}
                    <FormFieldWrapper
                        control={form.control}
                        name="amount"
                        label="Amount"
                        render={({ field }) => {
                            return (
                                <div className="relative w-full">
                                    <Input
                                        {...field}
                                        id={field.name}
                                        className={cn(
                                            'h-16 rounded-2xl pl-8 pr-10 text-lg font-bold text-primary placeholder:text-sm placeholder:font-normal placeholder:text-foreground/40'
                                        )}
                                        type="text"
                                        placeholder="Enter the payment amount"
                                        value={
                                            field.value !== undefined &&
                                            field.value !== null
                                                ? commaSeparators(
                                                      field.value.toString()
                                                  )
                                                : ''
                                        }
                                        onChange={(e) => {
                                            const rawValue =
                                                sanitizeNumberInput(
                                                    e.target.value
                                                )
                                            if (isValidDecimalInput(rawValue)) {
                                                field.onChange(rawValue)
                                            }
                                        }}
                                        onBlur={(e) =>
                                            formatNumberOnBlur(
                                                e.target.value,
                                                field.onChange
                                            )
                                        }
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary after:content-['₱']"></span>
                                </div>
                            )
                        }}
                    />
                    {!['payment', 'deposit', 'withdraw'].includes(
                        focusTypePayment ?? 'payment'
                    ) && (
                        <FormFieldWrapper
                            control={form.control}
                            name="payment_date"
                            label="Check Date"
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    {...field}
                                    className="block [&::-webkit-calendar-picker-indicator]:hidden"
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                    )}

                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            cancel
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : (
                                transactionButtonTitle
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

const TransactionEntryModal = ({
    title = 'Create Transaction Entry',
    description = 'Fill up the form to create transaction entry',
    titleClassName,
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<TransactionEntryFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            title={title}
            description={description}
            titleClassName={titleClassName}
            {...props}
        >
            <PaymentsEntryForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionEntryModal
