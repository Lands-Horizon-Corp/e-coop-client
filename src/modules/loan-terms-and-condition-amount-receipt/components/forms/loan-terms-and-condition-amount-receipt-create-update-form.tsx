import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    LoanTermsAndConditionAmountReceiptSchema,
    TLoanTermsAndConditionAmountReceiptSchema,
} from '../../loan-terms-and-condition-amount-receipt.validation'

type TLoanTermsAndConditionAmountReceiptFormValues =
    TLoanTermsAndConditionAmountReceiptSchema & {
        fieldKey?: string
    }

type ILoanTermsAndConditionAmountReceiptForForm = z.infer<
    typeof LoanTermsAndConditionAmountReceiptSchema
>

export interface ILoanTermsAndConditionAmountReceiptFormProps
    extends IClassProps,
        IForm<
            Partial<TLoanTermsAndConditionAmountReceiptFormValues>,
            ILoanTermsAndConditionAmountReceiptForForm,
            Error,
            TLoanTermsAndConditionAmountReceiptFormValues
        > {
    loanTransactionId?: TEntityId
}

const LoanTermsAndConditionAmountReceiptCreateForm = ({
    className,
    loanTransactionId,
    onSuccess,
    readOnly,
    ...formProps
}: ILoanTermsAndConditionAmountReceiptFormProps) => {
    const form = useForm<TLoanTermsAndConditionAmountReceiptFormValues>({
        resolver: standardSchemaResolver(
            LoanTermsAndConditionAmountReceiptSchema
        ),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            loan_transaction_id: loanTransactionId,
            account_id: '',
            amount: 0,
            ...formProps.defaultValues,
        },
    })

    const { formRef, isDisabled } =
        useFormHelper<TLoanTermsAndConditionAmountReceiptFormValues>({
            form,
            readOnly,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData, e) => {
        e?.stopPropagation()
        e?.preventDefault()
        onSuccess?.(formData)
        form.reset()
    })

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full max-w-full min-w-0 flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="space-y-4">
                    <FormFieldWrapper
                        control={form.control}
                        label="Loan Account"
                        name="account_id"
                        render={({ field }) => (
                            <AccountPicker
                                disabled={isDisabled(field.name)}
                                hideDescription
                                mode="payment"
                                onSelect={(account) => {
                                    field.onChange(account?.id)

                                    form.setValue('account', account)
                                }}
                                placeholder="Select Loan Account"
                                value={form.getValues('account')}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Amount"
                        name="amount"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                onChange={(e) => {
                                    const value =
                                        parseFloat(e.target.value) || 0
                                    field.onChange(value)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSubmit()
                                        e.preventDefault()
                                    }
                                }}
                            />
                        )}
                    />
                </div>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    onReset={() => {
                        form.reset()
                    }}
                    onSubmit={(e) => onSubmit(e)}
                    readOnly={readOnly}
                    resetButtonType="button"
                    submitButtonType="button"
                    submitText={
                        formProps.defaultValues?.fieldKey ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const LoanTermsAndConditionAmountReceiptCreateModal = ({
    title = 'Add Amount Receipt',
    description = 'Add a new amount receipt entry.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: ILoanTermsAndConditionAmountReceiptFormProps
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanTermsAndConditionAmountReceiptCreateForm
                {...formProps}
                onSuccess={(receipt) => {
                    formProps.onSuccess?.(receipt)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanTermsAndConditionAmountReceiptCreateForm
