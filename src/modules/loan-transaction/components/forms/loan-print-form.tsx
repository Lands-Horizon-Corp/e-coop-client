import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
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
            ...formProps.defaultValues,
            check_date: formProps?.defaultValues?.check_date
                ? toInputDateString(
                      formProps.defaultValues?.check_date || new Date()
                  )
                : '',
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

    const onSubmit = form.handleSubmit(async (payload) => {
        toast.promise(
            printMutation.mutateAsync({ loanTransactionId, payload }),
            {
                loading: 'Printing...',
                success: 'Loan Printed',
                error: (error) =>
                    `Something went wrong: ${serverRequestErrExtractor({ error })}`,
            }
        )
    }, handleFocusError)

    const { error: rawError, isPending, reset } = printMutation

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
                    <FormFieldWrapper
                        control={form.control}
                        label="Voucher *"
                        name="voucher"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Voucher Number"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Check Number"
                        name="check_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Check Number (optional)"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Check Date"
                        name="check_date"
                        render={({ field }) => (
                            <InputDate
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Check Date"
                                type="date"
                            />
                        )}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Print"
                />
            </form>
        </Form>
    )
}

export const LoanTransactionPrintFormModal = ({
    className,
    formProps,
    title = 'Loan Print',
    description = 'Print loan',
    ...props
}: IModalProps & {
    formProps: Omit<ILoanTransactionPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-lg', className)}
            description={description}
            title={title}
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
