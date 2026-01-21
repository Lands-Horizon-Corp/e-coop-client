'use client'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useGenerateAccountTransaction } from '../../account-transaction.service'
import { AccountTransactionGenerateSchema } from '../../account-transaction.validation'

type TAccountTransactionGenerateSchema = z.infer<
    typeof AccountTransactionGenerateSchema
>

export interface AccountTransactionGenerateFormProps
    extends IClassProps,
        IForm<
            Partial<TAccountTransactionGenerateSchema>,
            unknown,
            Error,
            TAccountTransactionGenerateSchema
        > {}

const AccountTransactionGenerateForm = ({
    onSuccess,
    className,
    ...formProps
}: AccountTransactionGenerateFormProps) => {
    const form = useForm<TAccountTransactionGenerateSchema>({
        resolver: standardSchemaResolver(AccountTransactionGenerateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            start_date: formProps.defaultValues?.start_date
                ? toInputDateString(formProps.defaultValues?.start_date)
                : undefined,
            end_date: formProps.defaultValues?.end_date
                ? toInputDateString(formProps.defaultValues?.end_date)
                : undefined,
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TAccountTransactionGenerateSchema>({
            form,
            ...formProps,
        })

    const {
        mutateAsync,
        isPending,
        error: responseError,
    } = useGenerateAccountTransaction({
        options: {
            onSuccess: () => onSuccess?.(undefined),
        },
    })

    const onSubmit = form.handleSubmit(
        (formData) =>
            toast.promise(mutateAsync(formData), {
                loading: 'Generating account transactions...',
                success: 'Account transactions generated successfully',
                error: (err) =>
                    `Error generating account transactions: ${err.message}`,
            }),
        handleFocusError
    )

    const error = serverRequestErrExtractor({
        error: responseError,
    })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-y-3"
                    disabled={formProps.readOnly || isPending}
                >
                    <FormFieldWrapper
                        className="relative"
                        control={form.control}
                        description="mm/dd/yyyy"
                        descriptionClassName="absolute top-0 right-0"
                        label="Start Date *"
                        name="start_date"
                        render={({ field }) => (
                            <InputDate {...field} value={field.value ?? ''} />
                        )}
                    />

                    <FormFieldWrapper
                        className="relative"
                        control={form.control}
                        description="mm/dd/yyyy"
                        descriptionClassName="absolute top-0 right-0"
                        label="End Date *"
                        name="end_date"
                        render={({ field }) => (
                            <InputDate {...field} value={field.value ?? ''} />
                        )}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    // disableSubmit={!form.formState.isDirty || isPending }
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Generate"
                />
            </form>
        </Form>
    )
}

export const AccountTransactionGenerateFormModal = ({
    title = 'Generate Account Transactions',
    description = 'Select a date range to generate transactions.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<AccountTransactionGenerateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <AccountTransactionGenerateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default AccountTransactionGenerateForm
