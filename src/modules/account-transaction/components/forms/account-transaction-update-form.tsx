import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IAccountTransactionEntry } from '@/modules/account-transaction-entry'
import { currencyFormat } from '@/modules/currency'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { ACCOUNT_TRANSACTION_SOURCE_LABEL_MAP } from '../../account-transaction-constants'
import { useUpdateAccountTransactionById } from '../../account-transaction.service'
import {
    IAccountTransaction,
    IAccountTransactionRequest,
    TAccountTransactionSource,
} from '../../account-transaction.types'
import { AccountTransactionSchema } from '../../account-transaction.validation'

export interface AccountTransactionUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<IAccountTransactionRequest>,
            IAccountTransaction,
            Error,
            IAccountTransactionRequest
        > {
    accountTransactionId: TEntityId
}

const AccountTransactionUpdateForm = ({
    accountTransactionId,
    className,
    ...formProps
}: AccountTransactionUpdateFormProps) => {
    const form = useForm<IAccountTransactionRequest>({
        resolver: standardSchemaResolver(AccountTransactionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            debit: 0,
            credit: 0,
            entries: [],
            ...formProps.defaultValues,
        },
    })

    const updateMutation = useUpdateAccountTransactionById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<IAccountTransactionRequest>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        toast.promise(
            updateMutation.mutateAsync({
                id: accountTransactionId,
                payload: formData,
            }),
            {
                loading: 'Updating account transaction...',
                success: 'Account transaction updated successfully.',
                error: (err) =>
                    serverRequestErrExtractor({ error: err }) ||
                    'Failed to update account transaction.',
            }
        )
    }, handleFocusError)

    const { error: rawError, isPending, reset } = updateMutation
    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3 bg-popover p-4 rounded-xl gap-x-4 grid grid-cols-12">
                        <FormFieldWrapper
                            className="col-span-4"
                            control={form.control}
                            label="J.V. Number *"
                            name="jv_number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled
                                    id={field.name}
                                    placeholder="J.V. Number"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            className="relative col-span-2"
                            control={form.control}
                            description="mm/dd/yyyy"
                            descriptionClassName="absolute top-0 right-0"
                            label="Date *"
                            name="date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled
                                    value={field.value ?? ''}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            className="relative col-span-6"
                            control={form.control}
                            label="Source *"
                            name="source"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled
                                    id={field.name}
                                    placeholder="Source"
                                    value={
                                        ACCOUNT_TRANSACTION_SOURCE_LABEL_MAP[
                                            field.value as TAccountTransactionSource
                                        ]
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            className="relative col-span-full"
                            control={form.control}
                            label="Particulars / Description *"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    placeholder="Particulars or Description"
                                />
                            )}
                        />
                    </fieldset>
                    <TransactionEntriesTable
                        className="mt-4 bg-popover/40"
                        entries={
                            (form.watch('entries') ||
                                []) as unknown as IAccountTransactionEntry[]
                        }
                        totalCredit={form.watch('credit')}
                        totalDebit={form.watch('debit')}
                    />
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Update"
                />
            </form>
        </Form>
    )
}

export function TransactionEntriesTable({
    entries = [],
    totalDebit = 0,
    totalCredit = 0,
    className,
}: {
    entries: IAccountTransactionEntry[]
    totalDebit: number
    totalCredit: number
    className?: string
}) {
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

    return (
        <div
            className={cn(
                'rounded-lg border border-border overflow-hidden shadow-card',
                className
            )}
        >
            <Table wrapperClassName="relative max-h-[400px] ecoop-scroll">
                <TableHeader className="sticky top-0">
                    <TableRow className="bg-popover hover:bg-table-header">
                        <TableHead className="text-table-header-foreground font-semibold">
                            ACCOUNT NAME
                        </TableHead>
                        <TableHead className="w-[150px] text-right text-table-header-foreground font-semibold">
                            DEBIT
                        </TableHead>
                        <TableHead className="w-[150px] text-right text-table-header-foreground font-semibold">
                            CREDIT
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.map((entry, index) => (
                        <TableRow
                            className={cn(
                                'transition-colors hover:bg-table-row-hover',
                                index % 2 === 1 && 'bg-table-row-alt'
                            )}
                            key={entry.id || index}
                        >
                            <TableCell className="font-medium">
                                {entry.account.name}
                            </TableCell>

                            <TableCell className="text-right font-mono tabular-nums">
                                {entry.debit > 0 && (
                                    <span className="text-foreground">
                                        {currencyFormat(entry.debit, {
                                            currency: entry.account?.currency,
                                            showSymbol:
                                                !!entry.account?.currency,
                                        })}
                                    </span>
                                )}
                            </TableCell>

                            <TableCell className="text-right font-mono tabular-nums">
                                {entry.credit > 0 && (
                                    <span className="text-foreground">
                                        {currencyFormat(entry.credit, {
                                            currency: entry.account?.currency,
                                            showSymbol:
                                                !!entry.account?.currency,
                                        })}
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}

                    {entries.length === 0 && (
                        <TableRow className="bg-table-row-alt">
                            <TableCell className="text-center" colSpan={3}>
                                No entries found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter className="sticky bottom-0">
                    <TableRow
                        className={cn(
                            'border-t-2',
                            isBalanced ? 'bg-primary/40' : 'bg-destructive'
                        )}
                    >
                        <TableCell className="font-semibold text-totals-foreground">
                            TOTALS
                            {!isBalanced && (
                                <span className="ml-2 text-xs text-totals-foreground/80">
                                    (Unbalanced)
                                </span>
                            )}
                        </TableCell>

                        <TableCell className="w-[150px] text-right font-mono font-bold tabular-nums text-totals-foreground">
                            {currencyFormat(totalDebit)}
                        </TableCell>

                        <TableCell className="w-[150px] text-right font-mono font-bold tabular-nums text-totals-foreground">
                            {currencyFormat(totalCredit)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export const AccountTransactionUpdateFormModal = ({
    title = 'Update Account Transaction',
    description = 'Update journal voucher particular / details.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<AccountTransactionUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('w-full !max-w-4xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <AccountTransactionUpdateForm
                {...formProps}
                onSuccess={(updatedData) => {
                    formProps.onSuccess?.(updatedData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default AccountTransactionUpdateForm
