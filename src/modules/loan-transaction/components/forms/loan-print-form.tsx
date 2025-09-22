import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { usePrintLoanTransaction } from '../../loan-transaction.service'
import { ILoanTransaction } from '../../loan-transaction.types'
import {
    LoanTransactionPrintSchema,
    LoanTransactionPrintSchema as TLoanTransactionPrintSchema,
} from '../../loan-transaction.validation'

export interface ILoanTransactionPrintFormProps
    extends IClassProps,
        IForm<
            Partial<TLoanTransactionPrintSchema>,
            ILoanTransaction,
            Error,
            TLoanTransactionPrintSchema
        > {
    loanTransactionId: TEntityId
}

const LoanTransactionPrintForm = ({
    loanTransactionId,
    className,
    ...formProps
}: ILoanTransactionPrintFormProps) => {
    const form = useForm<TLoanTransactionPrintSchema>({
        resolver: standardSchemaResolver(LoanTransactionPrintSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            voucher: '',
            check_number: '',
            check_date: '',
            ...formProps.defaultValues,
        },
    })

    const printMutation = usePrintLoanTransaction({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanTransactionPrintSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((payload) => {
        printMutation.mutate({ loanTransactionId, payload })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = printMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="voucher"
                        label="Voucher *"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Voucher Number"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="check_number"
                        label="Check Number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Check Number (optional)"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="check_date"
                        label="Check Date"
                        render={({ field }) => (
                            <InputDate
                                {...field}
                                id={field.name}
                                type="date"
                                placeholder="Check Date"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText="Print"
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                />
            </form>
        </Form>
    )
}

export const LoanTransactionPrintFormModal = ({
    className,
    formProps,
    title = 'Create Holiday',
    description = 'Fill out the form to add a new holiday.',
    ...props
}: IModalProps & {
    formProps: Omit<ILoanTransactionPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('!max-w-lg', className)}
            {...props}
        >
            <LoanTransactionPrintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanTransactionPrintForm
