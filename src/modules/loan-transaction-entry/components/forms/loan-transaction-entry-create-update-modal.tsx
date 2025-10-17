import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { CurrencyInput } from '@/modules/currency'
import {
    ILoanTransactionEntry,
    LoanTransactionEntrySchema,
    TLoanTransactionEntrySchema,
    useCreateLoanTransactionEntry,
    useUpdateLoanTransactionEntryById,
} from '@/modules/loan-transaction-entry'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface IChargeFormProps
    extends IClassProps,
        IForm<
            Partial<ILoanTransactionEntry>,
            ILoanTransactionEntry,
            Error,
            TLoanTransactionEntrySchema
        > {
    id?: TEntityId
    loanTransactionId: TEntityId
}

const LoanTransactionEntryCreateUpdate = ({
    className,
    onSuccess,
    id,
    readOnly,
    loanTransactionId,
    ...formProps
}: IChargeFormProps) => {
    const form = useForm<TLoanTransactionEntrySchema>({
        resolver: standardSchemaResolver(LoanTransactionEntrySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            is_add_on: false,
            amount: formProps.defaultValues?.credit || 0,
            ...formProps.defaultValues,
        },
    })

    const deductionType = form.watch('type')

    const { firstError, formRef, isDisabled } =
        useFormHelper<TLoanTransactionEntrySchema>({
            form,
            readOnly,
            autoSave: false,
        })

    const createMutation = useCreateLoanTransactionEntry({
        options: {
            onSuccess: onSuccess,
            onError: formProps.onError,
        },
    })
    const updateMutation = useUpdateLoanTransactionEntryById({
        options: {
            onSuccess: onSuccess,
            onError: formProps.onError,
        },
    })

    const { error: rawError, isPending } = id ? updateMutation : createMutation

    const error = firstError || serverRequestErrExtractor({ error: rawError })

    const onSubmit = form.handleSubmit(async (formData, e) => {
        e?.stopPropagation()
        e?.preventDefault()

        const requestFn = id
            ? updateMutation.mutateAsync({ id, payload: formData })
            : createMutation.mutateAsync({
                  loanTransactionId,
                  payload: formData,
              })

        toast.promise(requestFn, {
            loading: 'Saving deduction...',
            success: 'Deduction Saved',
            error: `Something went wrong, please try again. ${error || ''}`,
        })
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
                        label="Account"
                        name="account_id"
                        render={({ field }) => (
                            <AccountPicker
                                disabled={
                                    isDisabled(field.name) ||
                                    deductionType === 'automatic-deduction'
                                }
                                hideDescription
                                onSelect={(account) => {
                                    field.onChange(account?.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                    form.setValue(
                                        'description',
                                        account.description,
                                        { shouldDirty: true }
                                    )
                                }}
                                placeholder="Select Account for Charge"
                                value={form.getValues('account')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Amount"
                        name="amount"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                currency={form.watch('account')?.currency}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue) => {
                                    onChange(newValue)
                                }}
                                placeholder="0.00"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Description"
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSubmit()
                                        e.preventDefault()
                                    }
                                }}
                                placeholder="Charge description"
                                rows={3}
                            />
                        )}
                    />

                    <div className="flex items-center gap-6">
                        <FormFieldWrapper
                            className="w-fit"
                            control={form.control}
                            name="is_add_on"
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={field.value || false}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label
                                        className="text-sm font-medium"
                                        htmlFor={field.name}
                                    >
                                        Add-on Charge
                                    </Label>
                                </div>
                            )}
                        />
                    </div>
                </div>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                    }}
                    onSubmit={(e) => onSubmit(e)}
                    readOnly={readOnly}
                    resetButtonType="button"
                    submitButtonType="button"
                    submitText={
                        formProps.defaultValues?.id ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const LoanTransactionEntryCreateUpdateModal = ({
    title = 'Add/Edit Charge',
    description = 'Edit or Add a new deduction.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: IChargeFormProps
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanTransactionEntryCreateUpdate
                {...formProps}
                onSuccess={(charge) => {
                    formProps.onSuccess?.(charge)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanTransactionEntryCreateUpdate
