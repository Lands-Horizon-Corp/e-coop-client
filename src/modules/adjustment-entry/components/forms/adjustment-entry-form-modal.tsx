import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { IMedia } from '@/modules/media/media.types'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import {
    TransactionAmountField,
    TransactionPaymentTypeComboBox,
} from '@/modules/transaction'

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
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 gap-y-4 sm:grid-cols-1 md:grid-cols-3 sm:gap-y-3"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="member_profile_id"
                        label="Member Profile"
                        className="md:col-span-3"
                        render={({ field }) => {
                            return (
                                <MemberPicker
                                    value={form.getValues('member_profile')}
                                    onSelect={(selectedMember) => {
                                        field.onChange(selectedMember?.id)
                                        form.setValue(
                                            'member_profile',
                                            selectedMember
                                        )
                                    }}
                                    placeholder="Relative Member Profile"
                                    disabled={isDisabled(field.name)}
                                    allowShorcutCommand
                                />
                            )
                        }}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="account_id"
                        label="Account"
                        className="md:col-span-3"
                        render={({ field }) => (
                            <AccountPicker
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                placeholder="Select an account"
                                value={form.getValues('account')}
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="entry_date"
                        label="Entry Date"
                        render={({ field }) => (
                            <InputDate {...field} value={field.value ?? ''} />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Payment Type"
                        name="payment_type_id"
                        labelClassName="text-xs font-medium text-muted-foreground"
                        render={({ field }) => (
                            <TransactionPaymentTypeComboBox
                                {...field}
                                value={field.value ?? undefined}
                                placeholder="Select a payment type"
                                disabled={isDisabled('payment_type_id')}
                                onChange={(selectedPaymentType) => {
                                    field.onChange(selectedPaymentType.id)
                                }}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="reference_number"
                        label="Reference Number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Reference Number"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <div className="md:col-span-3 grid grid-cols-1 gap-x-3 md:grid-cols-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="debit"
                            label="Debit Amount"
                            render={({ field }) => (
                                <TransactionAmountField
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    step="0.01"
                                    isDefault
                                    placeholder="0.00"
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) => {
                                        field.onChange(
                                            parseFloat(e.target.value) || 0
                                        )
                                    }}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="credit"
                            label="Credit Amount"
                            render={({ field }) => (
                                <TransactionAmountField
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    step="0.01"
                                    isDefault
                                    placeholder="0.00"
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) => {
                                        field.onChange(
                                            parseFloat(e.target.value) || 0
                                        )
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    autoComplete="off"
                                    placeholder="Description"
                                    className={cn('!max-h-32')}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="signature_media_id"
                            label="Signature"
                            render={({ field }) => {
                                const value = form.watch('signature_media')
                                return (
                                    <SignatureField
                                        {...field}
                                        placeholder="Signature"
                                        disabled={isDisabled(
                                            'signature_media_id'
                                        )}
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
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
                                    />
                                )
                            }}
                        />
                    </div>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={
                        formProps.adjustmentEntryId ? 'Update' : 'Create'
                    }
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
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
            title={title}
            description={description}
            className={cn('md:max-w-2xl lg:!min-w-[800px]', className)}
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
