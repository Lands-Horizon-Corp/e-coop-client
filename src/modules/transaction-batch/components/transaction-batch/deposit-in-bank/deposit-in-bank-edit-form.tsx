import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
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
import { Input } from '@/components/ui/input'

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
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
    transactionBatchId,
}: IDepositInBankCreateFormProps) => {
    const form = useForm<TDepositInBankFormValues>({
        resolver: standardSchemaResolver(depositInBankSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            deposit_in_bank: 0,
            ...defaultValues,
        },
    })

    const isDisabled = (field: Path<TDepositInBankFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const {
        mutate: setDepositInBank,
        error,
        isPending,
        reset,
    } = useTransactionBatchSetDepositInBank({
        options: {
            onSuccess,
            onError,
        },
    })

    const onSubmit = form.handleSubmit(async (formData) => {
        setDepositInBank({
            id: transactionBatchId,
            payload: { deposit_in_bank: formData.deposit_in_bank },
        })
    })

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="deposit_in_bank"
                        label="Deposit in Bank"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                type="number"
                                step="0.01"
                                placeholder="Enter total deposit amount"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText="Save"
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
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
            title={title}
            description={description}
            className={cn('', className)}
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
