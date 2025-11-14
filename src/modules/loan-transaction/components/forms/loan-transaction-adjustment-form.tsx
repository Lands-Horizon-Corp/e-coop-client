import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountTypeBadge, IAccount } from '@/modules/account'
import { CurrencyInput } from '@/modules/currency'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { MinusIcon, PlusIcon, RenderIcon, TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useAdjustmentLoanTransaction } from '../../loan-transaction.service'
import { ILoanTransactionAdjustmentRequest } from '../../loan-transaction.types'
import { LoanTransactionAdjustmentSchema } from '../../loan-transaction.validation'

type TLoanTransactionAdjustmentFormValues = z.infer<
    typeof LoanTransactionAdjustmentSchema
>

export interface ILoanTransactionAdjustmentFormProps
    extends IClassProps,
        IForm<
            Partial<ILoanTransactionAdjustmentRequest>,
            void,
            Error,
            TLoanTransactionAdjustmentFormValues
        > {
    loanTransactionId?: TEntityId
}

const LoanTransactionAdjustmentForm = ({
    className,
    loanTransactionId: _loanTransactionId,
    ...formProps
}: ILoanTransactionAdjustmentFormProps) => {
    const form = useForm<TLoanTransactionAdjustmentFormValues>({
        resolver: standardSchemaResolver(LoanTransactionAdjustmentSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            voucher: '',
            adjustment_type: 'add',
            amount: 0,
            ...formProps.defaultValues,
        },
    })

    const {
        mutate: adjustLoanTransaction,
        isPending,
        error: errorResponse,
        reset,
    } = useAdjustmentLoanTransaction()

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanTransactionAdjustmentFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (!_loanTransactionId) return

        adjustLoanTransaction(
            {
                loanTransactionId: _loanTransactionId,
                payload: formData,
            },
            {
                onSuccess: () => {
                    formProps.onSuccess?.(undefined as void)
                },
                onError: formProps.onError,
            }
        )
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: errorResponse })

    const account: IAccount | undefined = form.watch('account')

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full flex-col max-w-full min-w-0 gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid min-w-0 gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3 min-w-0">
                        <div className="gap-x-4 p-4 rounded-xl min-w-0 border bg-gradient-to-r from-popover to-primary/40">
                            <div className="flex items-center min-w-0">
                                <RenderIcon
                                    className="size-4 shrink-0 mr-2"
                                    icon={account?.icon as TIcon}
                                />
                                <p className="flex-1 truncate min-w-0">
                                    {account?.name}
                                    iopahsgo iajspgaspgpasojgpoasgpasjg
                                    pasjgpaojgpoaj gapsojgposa
                                </p>
                            </div>
                            {account && (
                                <AccountTypeBadge
                                    size="sm"
                                    type={account?.type}
                                />
                            )}
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="Amount"
                            name="amount"
                            render={({ field: { onChange, ...field } }) => (
                                <div className="flex grow flex-col gap-y-2">
                                    <CurrencyInput
                                        {...field}
                                        currency={account?.currency}
                                        disabled={isDisabled(field.name)}
                                        onValueChange={(newValue = '') => {
                                            onChange(newValue)
                                        }}
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Voucher #"
                            name="voucher"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Voucher #"
                                />
                            )}
                        />

                        <div className="space-y-2">
                            <FormFieldWrapper
                                control={form.control}
                                label="Adjustment Type"
                                name="adjustment_type"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="gap-2 flex items-center"
                                        onValueChange={field.onChange}
                                        value={field.value ?? ''}
                                    >
                                        {/* Add Adjustment */}
                                        <div className="relative duration-300 flex w-full items-start gap-2 rounded-2xl border border-input p-4 has-data-[state=checked]:shadow-xs outline-none has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-primary/5">
                                            <RadioGroupItem
                                                aria-describedby="adjustment-add-description"
                                                className="order-1 after:absolute after:inset-0"
                                                id="adjustment-add"
                                                value="add"
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="shrink-0 size-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                                    <PlusIcon className="size-5 text-green-600" />
                                                </div>
                                                <div className="grid grow gap-2">
                                                    <Label htmlFor="adjustment-add">
                                                        Add{' '}
                                                        <span className="text-xs leading-[inherit] font-normal text-muted-foreground">
                                                            (Increase Amount)
                                                        </span>
                                                    </Label>
                                                    <p
                                                        className="text-xs text-muted-foreground"
                                                        id="adjustment-add-description"
                                                    >
                                                        Add the specified amount
                                                        to the loan account
                                                        balance.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Deduct Adjustment */}
                                        <div className="relative duration-300 flex w-full items-start gap-2 rounded-2xl border border-input p-4 has-data-[state=checked]:shadow-xs outline-none has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-gradient-to-r has-data-[state=checked]:from-primary/20 has-data-[state=checked]:to-primary/5">
                                            <RadioGroupItem
                                                aria-describedby="adjustment-deduct-description"
                                                className="order-1 after:absolute after:inset-0"
                                                id="adjustment-deduct"
                                                value="deduct"
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="shrink-0 size-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                                    <MinusIcon className="size-5 text-red-600" />
                                                </div>
                                                <div className="grid grow gap-2">
                                                    <Label htmlFor="adjustment-deduct">
                                                        Deduct{' '}
                                                        <span className="text-xs leading-[inherit] font-normal text-muted-foreground">
                                                            (Decrease Amount)
                                                        </span>
                                                    </Label>
                                                    <p
                                                        className="text-xs text-muted-foreground"
                                                        id="adjustment-deduct-description"
                                                    >
                                                        Subtract the specified
                                                        amount from the loan
                                                        account balance.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                )}
                            />

                            <p className="text-xs text-muted-foreground">
                                By adding or deducting this amount from the
                                member's loan account, the system will
                                automatically trigger the Loan Process to keep
                                all loan data updated and accurate.
                            </p>
                        </div>
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Submit the amount"
                />
            </form>
        </Form>
    )
}

export const LoanTransactionAdjustmentFormModal = ({
    title = 'Loan Transaction Adjustment',
    description = 'Adjust the loan transaction amount.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanTransactionAdjustmentFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-2xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanTransactionAdjustmentForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanTransactionAdjustmentForm
