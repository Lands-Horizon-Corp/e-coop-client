import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'
import {
    CashCheckVoucherSchema,
    ICashCheckVoucher,
    ICashCheckVoucherRequest,
    cashCheckVoucherBaseKey,
    useUpdateCashCheckVoucherById,
} from '@/modules/cash-check-voucher'
import { CurrencyInput } from '@/modules/currency'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

type TCashCheckVoucherFormValues = z.infer<typeof CashCheckVoucherSchema>

export interface ICashCheckVoucherCreateUpdateFormProps
    extends IClassProps,
        IForm<
            ICashCheckVoucher,
            ICashCheckVoucherRequest,
            Error,
            TCashCheckVoucherFormValues
        > {
    cashCheckVoucherId?: TEntityId
}

const CashCheckEntryCreateUpdateForm = ({
    className,
    defaultValues,
    cashCheckVoucherId,
    ...formProps
}: ICashCheckVoucherCreateUpdateFormProps) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()

    const form = useForm<TCashCheckVoucherFormValues>({
        resolver: standardSchemaResolver(CashCheckVoucherSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const {
        mutate: updateCashCheckVoucher,
        isPending: isUpdating,
        error: updateError,
        reset: resetUpdate,
    } = useUpdateCashCheckVoucherById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Cash Check Voucher updated',
                onSuccess: (data) => {
                    formProps.onSuccess?.(data)
                },
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TCashCheckVoucherFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const handleDate = (date: string | undefined) => {
        return date ? new Date(date).toISOString() : undefined
    }

    const onSubmit = form.handleSubmit(async (formData) => {
        const payload: ICashCheckVoucherRequest = {
            ...formData,
            check_entry_check_date: handleDate(formData.check_entry_check_date),
        }
        updateCashCheckVoucher({ id: cashCheckVoucherId!, payload })
    }, handleFocusError)

    const isPending = isUpdating
    const rawError = updateError

    const error =
        serverRequestErrExtractor({ error: rawError }) ||
        form.formState.errors?.root?.message

    useHotkeys('Enter', (e) => {
        e.preventDefault()
        modalState.onOpenChange(true)
    })

    return (
        <Form {...form}>
            <form
                className={cn('!w-full flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        className="md:col-span-2"
                        control={form.control}
                        label="Account"
                        name="check_entry_account_id"
                        render={({ field }) => (
                            <AccountPicker
                                disabled={isDisabled(field.name)}
                                mode="all"
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue(
                                        'check_entry_account',
                                        account,
                                        {
                                            shouldDirty: true,
                                        }
                                    )
                                }}
                                placeholder="Select an account"
                                value={form.getValues('check_entry_account')}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className="col-span-1 md:col-span-2"
                        control={form.control}
                        label="Amount"
                        name="check_entry_amount"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                currency={
                                    form.watch('check_entry_account')?.currency
                                }
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue = '') => {
                                    onChange(newValue)
                                }}
                                placeholder="0.00"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="CV Number"
                        name="check_entry_check_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Enter CV number"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Entry Date"
                        name="check_entry_check_date"
                        render={({ field }) => (
                            <InputDate {...field} value={field.value ?? ''} />
                        )}
                    />
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset({
                            ...defaultValues,
                        })
                        resetUpdate()
                        queryClient.invalidateQueries({
                            queryKey: [cashCheckVoucherBaseKey, 'paginated'],
                        })
                    }}
                    readOnly={formProps.readOnly}
                    submitText={'Update'}
                />
            </form>
        </Form>
    )
}

export const CashCheckEntryUpdateFormModal = ({
    formProps,
    className,
    title = 'Cash Check Entry',
    description = 'Update cash check entry',
    ...props
}: IModalProps & {
    formProps?: Omit<ICashCheckVoucherCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <CashCheckEntryCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CashCheckEntryUpdateFormModal
