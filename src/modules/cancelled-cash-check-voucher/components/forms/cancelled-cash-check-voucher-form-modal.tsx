import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateCancelledCashCheckVoucher,
    useUpdateCancelledCashCheckVoucherById,
} from '../../cancelled-cash-check-voucher.service'
import {
    ICancelledCashCheckVoucher,
    ICancelledCashCheckVoucherRequest,
} from '../../cancelled-cash-check-voucher.types'
import { CancelledCashCheckVoucherSchema } from '../../cancelled-cash-check-voucher.validation'

type TCancelledCashCheckVoucherFormValues = z.infer<
    typeof CancelledCashCheckVoucherSchema
>

export interface ICancelledCashCheckVoucherFormProps
    extends IClassProps,
        IForm<
            Partial<ICancelledCashCheckVoucherRequest>,
            ICancelledCashCheckVoucher,
            Error,
            TCancelledCashCheckVoucherFormValues
        > {
    voucherId?: TEntityId
}

const CancelledCashCheckVoucherCreateUpdateForm = ({
    className,
    ...formProps
}: ICancelledCashCheckVoucherFormProps) => {
    const form = useForm<TCancelledCashCheckVoucherFormValues>({
        resolver: standardSchemaResolver(CancelledCashCheckVoucherSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            check_number: '',
            entry_date: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateCancelledCashCheckVoucher({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Voucher Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateCancelledCashCheckVoucherById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Voucher Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TCancelledCashCheckVoucherFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })
    const handleDate = (date: string) => {
        return date ? new Date(date).toISOString() : ''
    }
    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.voucherId) {
            updateMutation.mutate({
                id: formProps.voucherId,
                payload: {
                    ...formData,
                    entry_date: handleDate(formData.entry_date),
                },
            })
        } else {
            createMutation.mutate({
                ...formData,
                entry_date: handleDate(formData.entry_date),
            })
        }
    }, handleFocusError)

    const {
        error: errorResponse,
        isPending,
        reset,
    } = formProps.voucherId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

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
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Check Number"
                            name="check_number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Check Number"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Entry Date"
                            name="entry_date"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Entry Date"
                                    type="date"
                                    value={
                                        field.value
                                            ? new Date(field.value)
                                                  .toISOString()
                                                  .split('T')[0]
                                            : ''
                                    }
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
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Description"
                                />
                            )}
                        />
                    </fieldset>
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
                    submitText={formProps.voucherId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const CancelledCashCheckVoucherCreateUpdateFormModal = ({
    title = 'Create Cancelled Voucher',
    description = 'Fill out the form to add a new cancelled cash check voucher.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ICancelledCashCheckVoucherFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <CancelledCashCheckVoucherCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CancelledCashCheckVoucherCreateUpdateForm
