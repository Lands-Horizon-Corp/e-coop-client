import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { useTransactionBatchSetDepositInBank } from '@/hooks/api-hooks/use-transaction-batch'

import {
    IClassProps,
    IForm,
    ITransactionBatch,
    ITransactionBatchDepositInBankRequest,
    ITransactionBatchMinimal,
    TEntityId,
} from '@/types'

const depositInBankSchema = z.object({
    deposit_in_bank: z.coerce.number().min(0, 'Deposit in bank is required'),
})

type TDepositInBankFormValues = z.infer<typeof depositInBankSchema>

export interface IDepositInBankCreateFormProps
    extends IClassProps,
        IForm<
            Partial<ITransactionBatchDepositInBankRequest>,
            ITransactionBatchMinimal | ITransactionBatch,
            string,
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
        resolver: zodResolver(depositInBankSchema),
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
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit(async (formData) => {
        setDepositInBank({
            id: transactionBatchId,
            data: { deposit_in_bank: formData.deposit_in_bank },
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
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                form.reset()
                                reset()
                            }}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? <LoadingSpinner /> : 'Save'}
                        </Button>
                    </div>
                </div>
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
