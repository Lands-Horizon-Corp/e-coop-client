import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { WarningFillIcon } from '@/components/icons'
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

    const onSubmit = form.handleSubmit(async (formData) => {
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
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onSubmit(e)
                }}
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
                                onKeyDown={(e) => {
                                    if (e.key === 'enter') e.preventDefault()
                                }}
                                placeholder="Enter amount"
                            />
                        )}
                    />
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    isLoading={suggestedAmortizationMutation.isPending}
                    onReset={() => {
                        form.reset()
                    }}
                    onSubmit={(e) => onSubmit(e)}
                    readOnly={formProps.readOnly}
                    resetButtonType="button"
                    submitText="Calculate Terms"
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
            <div className="p-3 space-y-1 rounded-xl bg-warning/70 border border-warning dark:bg-warning/20 text-warning-foreground">
                <h3 className="font-semibold">
                    <span className="p-1.5 bg-warning/20 mr-1 inline-flex w-fit items-center justify-center rounded-full">
                        <WarningFillIcon className="inline size-3 text-amber-400" />
                    </span>{' '}
                    Apply Suggested Terms?
                </h3>
                <p className="text-xs">
                    Changing to this suggested amount will update your number of
                    terms. Are you sure you want to proceed with this suggested
                    payment
                </p>
            </div>
        </Modal>
    )
}

export default LoanSuggestedAmortizationForm
