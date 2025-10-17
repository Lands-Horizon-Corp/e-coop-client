import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { CurrencyInput } from '@/modules/currency'
import {
    ITransactionBatch,
    ITransactionBatchDepositInBankRequest,
    ITransactionBatchMinimal,
    useTransactionBatchSetDepositInBank,
} from '@/modules/transaction-batch'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

const depositInBankSchema = z.object({
    deposit_in_bank: z.coerce.number().min(0, 'Deposit in bank is required'),
})

type TDepositInBankFormValues = z.infer<typeof depositInBankSchema>

export interface IDepositInBankCreateFormProps
    extends IClassProps,
        IForm<
            Partial<ITransactionBatchDepositInBankRequest>,
            ITransactionBatchMinimal | ITransactionBatch,
            Error,
            TDepositInBankFormValues
        > {
    transactionBatchId: TEntityId
}

const DepositInBankCreateForm = ({
    className,
    transactionBatchId,
    ...formProps
}: IDepositInBankCreateFormProps) => {
    const form = useForm<TDepositInBankFormValues>({
        resolver: standardSchemaResolver(depositInBankSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            deposit_in_bank: 0,
            ...formProps.defaultValues,
        },
    })

    const {
        mutate: setDepositInBank,
        error: rawError,
        isPending,
        reset,
    } = useTransactionBatchSetDepositInBank({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TDepositInBankFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        setDepositInBank({
            id: transactionBatchId,
            payload: { deposit_in_bank: formData.deposit_in_bank },
        })
    }, handleFocusError)

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
                        label="Deposit in Bank"
                        name="deposit_in_bank"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue) => {
                                    onChange(newValue)
                                }}
                                placeholder="Enter total deposit amount"
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
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Save"
                />
            </form>
        </Form>
    )
}

export const DepositInBankCreateFormModal = ({
    title = 'Add Deposit in Bank',
    description = 'Enter the deposit in bank amount for this batch.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IDepositInBankCreateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <DepositInBankCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default DepositInBankCreateForm
