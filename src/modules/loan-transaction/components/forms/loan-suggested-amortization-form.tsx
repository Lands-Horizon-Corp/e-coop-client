import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useLoanTransactionSuggestedAmortization } from '../../loan-transaction.service'
import { ILoanTransactionSuggested } from '../../loan-transaction.types'
import {
    LoanTransactionSuggestedSchema,
    TLoanTransactionSuggestedSchema,
} from '../../loan-transaction.validation'

export interface ILoanSuggestedAmortizationFormProps
    extends IClassProps,
        IForm<
            Partial<TLoanTransactionSuggestedSchema>,
            ILoanTransactionSuggested,
            Error,
            TLoanTransactionSuggestedSchema
        > {}

const LoanSuggestedAmortizationForm = ({
    className,
    ...formProps
}: ILoanSuggestedAmortizationFormProps) => {
    const form = useForm<TLoanTransactionSuggestedSchema>({
        resolver: standardSchemaResolver(LoanTransactionSuggestedSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            amount: 0,
            ...formProps.defaultValues,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanTransactionSuggestedSchema>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const suggestedAmortizationMutation =
        useLoanTransactionSuggestedAmortization({
            options: {
                onSuccess: (data) => {
                    form.reset(undefined, { keepValues: true })
                    formProps.onSuccess?.(data)
                },
                onError: (error) => {
                    formProps.onError?.(error)
                },
            },
        })

    const onSubmit = form.handleSubmit((formData) => {
        toast.promise(
            suggestedAmortizationMutation.mutateAsync({ ...formData }),
            {
                loading: 'Calculating...',
                success: 'Calculation successful!',
                error: 'Calculation failed.',
            }
        )
    }, handleFocusError)

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Amount"
                        name="amount"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Enter amount"
                            />
                        )}
                    />
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    isLoading={false}
                    onReset={() => {
                        form.reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Calculate"
                />
            </form>
        </Form>
    )
}

export const LoanSuggestedAmortizationFormModal = ({
    title = 'Calculate Suggested Amortization',
    description = 'Enter the amount to calculate suggested amortization.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanSuggestedAmortizationFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanSuggestedAmortizationForm
                {...formProps}
                onSuccess={(calculatedData) => {
                    formProps?.onSuccess?.(calculatedData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanSuggestedAmortizationForm
