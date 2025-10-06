import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
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
import { Input } from '@/components/ui/input'
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
                ref={formRef}
                onSubmit={onSubmit}
                className={cn(
                    'flex w-full max-w-full min-w-0 flex-col gap-y-4',
                    className
                )}
            >
                <div className="space-y-4">
                    <FormFieldWrapper
                        control={form.control}
                        name="account_id"
                        label="Account"
                        render={({ field }) => (
                            <AccountPicker
                                hideDescription
                                value={form.getValues('account')}
                                placeholder="Select Account for Charge"
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
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="amount"
                        label="Amount"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="0.00"
                                disabled={isDisabled(field.name)}
                                onChange={(e) => {
                                    const value =
                                        parseFloat(e.target.value) || 0
                                    field.onChange(value)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSubmit()
                                        e.preventDefault()
                                    }
                                }}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSubmit()
                                        e.preventDefault()
                                    }
                                }}
                                placeholder="Charge description"
                                disabled={isDisabled(field.name)}
                                rows={3}
                            />
                        )}
                    />

                    <div className="flex items-center gap-6">
                        <FormFieldWrapper
                            control={form.control}
                            name="is_add_on"
                            className="w-fit"
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id={field.name}
                                        checked={field.value || false}
                                        onCheckedChange={field.onChange}
                                        disabled={isDisabled(field.name)}
                                    />
                                    <Label
                                        htmlFor={field.name}
                                        className="text-sm font-medium"
                                    >
                                        Add-on Charge
                                    </Label>
                                </div>
                            )}
                        />
                    </div>
                </div>

                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    resetButtonType="button"
                    submitButtonType="button"
                    disableSubmit={!form.formState.isDirty}
                    submitText={
                        formProps.defaultValues?.id ? 'Update' : 'Create'
                    }
                    onSubmit={(e) => onSubmit(e)}
                    onReset={() => {
                        form.reset()
                    }}
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
            title={title}
            description={description}
            className={cn('!max-w-xl', className)}
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
