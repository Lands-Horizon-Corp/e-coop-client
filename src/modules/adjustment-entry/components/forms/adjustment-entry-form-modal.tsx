import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { CurrencyInput } from '@/modules/currency'
import { IMedia } from '@/modules/media/media.types'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { PaymentTypeCombobox } from '@/modules/transaction'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import SignatureField from '@/components/ui/signature-field'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateAdjustmentEntry,
    useUpdateAdjustmentEntryById,
} from '../../adjustment-entry.service'
import {
    IAdjustmentEntry,
    IAdjustmentEntryRequest,
} from '../../adjustment-entry.types'
import { AdjustmentEntrySchema } from '../../adjustment-entry.validation'

type TAdjustmentEntryFormValues = z.infer<typeof AdjustmentEntrySchema>

export interface IAdjustmentEntryFormProps
    extends IClassProps,
        IForm<
            Partial<IAdjustmentEntryRequest>,
            IAdjustmentEntry,
            Error,
            TAdjustmentEntryFormValues
        > {
    adjustmentEntryId?: TEntityId
}

const AdjustmentEntryCreateUpdateForm = ({
    className,
    ...formProps
}: IAdjustmentEntryFormProps) => {
    const form = useForm<TAdjustmentEntryFormValues>({
        resolver: standardSchemaResolver(AdjustmentEntrySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            account_id: '',
            entry_date: new Date(),
            debit: 0,
            credit: 0,
            ...formProps.defaultValues,
        } as TAdjustmentEntryFormValues,
    })

    const createMutation = useCreateAdjustmentEntry({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Adjustment Entry Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateAdjustmentEntryById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Adjustment Entry Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TAdjustmentEntryFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        const payload: IAdjustmentEntryRequest = {
            ...formData,
            entry_date: new Date(formData.entry_date).toISOString(),
        }

        if (formProps.adjustmentEntryId) {
            updateMutation.mutate({
                id: formProps.adjustmentEntryId,
                payload,
            })
        } else {
            createMutation.mutate(payload)
        }
    }, handleFocusError)

    const {
        error: errorResponse,
        isPending,
        reset,
    } = formProps.adjustmentEntryId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:grid-cols-1 md:grid-cols-3 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        className="md:col-span-3"
                        control={form.control}
                        label="Member Profile"
                        name="member_profile_id"
                        render={({ field }) => {
                            return (
                                <MemberPicker
                                    allowShorcutCommand
                                    disabled={isDisabled(field.name)}
                                    onSelect={(selectedMember) => {
                                        field.onChange(selectedMember?.id)
                                        form.setValue(
                                            'member_profile',
                                            selectedMember
                                        )
                                    }}
                                    placeholder="Relative Member Profile"
                                    value={form.getValues('member_profile')}
                                />
                            )
                        }}
                    />
                    <FormFieldWrapper
                        className="md:col-span-3"
                        control={form.control}
                        label="Account"
                        name="account_id"
                        render={({ field }) => (
                            <AccountPicker
                                disabled={isDisabled(field.name)}
                                mode="all"
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                placeholder="Select an account"
                                value={form.getValues('account')}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Entry Date"
                        name="entry_date"
                        render={({ field }) => (
                            <InputDate {...field} value={field.value ?? ''} />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Payment Type"
                        labelClassName="text-xs font-medium text-muted-foreground"
                        name="payment_type_id"
                        render={({ field }) => (
                            <PaymentTypeCombobox
                                {...field}
                                disabled={isDisabled('payment_type_id')}
                                onChange={(selectedPaymentType) => {
                                    field.onChange(selectedPaymentType.id)
                                }}
                                placeholder="Select a payment type"
                                value={field.value ?? undefined}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Reference Number"
                        name="reference_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Reference Number"
                            />
                        )}
                    />
                    <div className="md:col-span-3 grid grid-cols-1 gap-x-3 md:grid-cols-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Debit Amount"
                            name="debit"
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    currency={form.watch('account')?.currency}
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
                            label="Credit Amount"
                            name="credit"
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    currency={form.watch('account')?.currency}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(newValue = '') => {
                                        onChange(newValue)
                                    }}
                                    placeholder="0.00"
                                />
                            )}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="off"
                                    className={cn('!max-h-32')}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Description"
                                />
                            )}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Signature"
                            name="signature_media_id"
                            render={({ field }) => {
                                const value = form.watch('signature_media')
                                return (
                                    <SignatureField
                                        {...field}
                                        disabled={isDisabled(
                                            'signature_media_id'
                                        )}
                                        onChange={(newImage) => {
                                            if (newImage) {
                                                field.onChange(newImage.id)
                                                form.setValue(
                                                    'signature_media',
                                                    newImage as IMedia
                                                )
                                            } else {
                                                field.onChange(undefined)
                                                form.setValue(
                                                    'signature_media',
                                                    undefined
                                                )
                                            }
                                        }}
                                        placeholder="Signature"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                    />
                                )
                            }}
                        />
                    </div>
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
                    submitText={
                        formProps.adjustmentEntryId ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const AdjustmentEntryCreateUpdateFormModal = ({
    title = 'Create Adjustment Entry',
    description = 'Fill out the form to record a new adjustment entry.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IAdjustmentEntryFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('md:max-w-2xl lg:!min-w-[800px]', className)}
            description={description}
            title={title}
            {...props}
        >
            <AdjustmentEntryCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default AdjustmentEntryCreateUpdateForm
