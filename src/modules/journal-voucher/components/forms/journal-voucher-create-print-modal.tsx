import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    IJournalVoucher,
    JournalVoucherPrintSchema,
    TJournalVoucherPrintSchema,
    usePrintJournalVoucherTransaction,
} from '@/modules/journal-voucher'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface IJournalVoucherPrintFormProps
    extends IClassProps,
        IForm<
            Partial<TJournalVoucherPrintSchema>,
            IJournalVoucher,
            Error,
            TJournalVoucherPrintSchema
        > {
    journalVoucherId: TEntityId
}

const JournalVoucherPrintForm = ({
    journalVoucherId,
    className,
    ...formProps
}: IJournalVoucherPrintFormProps) => {
    const form = useForm<TJournalVoucherPrintSchema>({
        resolver: standardSchemaResolver(JournalVoucherPrintSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            cash_voucher_number: '',
            ...formProps.defaultValues,
        },
    })

    const printMutation = usePrintJournalVoucherTransaction({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TJournalVoucherPrintSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(async (payload) => {
        const apiPayload = {
            cash_voucher_number: payload.cash_voucher_number,
        }

        toast.promise(
            printMutation.mutateAsync({
                journalVoucherId,
                payload: apiPayload,
            }),
            {
                loading: 'Printing Journal Voucher...',
                success: 'Journal Voucher Printed',
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
                        name="cash_voucher_number"
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

export const JournalVoucherPrintFormModal = ({
    className,
    formProps,
    title = 'Journal Voucher Print',
    description = 'Input required details to print the Journal Voucher.',
    ...props
}: IModalProps & {
    formProps: Omit<IJournalVoucherPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-lg', className)}
            description={description}
            title={title}
            {...props}
        >
            <JournalVoucherPrintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default JournalVoucherPrintFormModal
