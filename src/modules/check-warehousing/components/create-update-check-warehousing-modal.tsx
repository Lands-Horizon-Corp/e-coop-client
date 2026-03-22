import { useEffect } from 'react'

import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import { IMedia } from '@/modules/media/media.types'
import MemberPicker from '@/modules/member-profile/components/member-picker'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateCheck,
    useUpdateCheckById,
} from '../check-warehousing.service'
import {
    ICheckWarehousing,
    ICheckWarehousingRequest,
} from '../check-warehousing.types'
import { CheckWarehousingSchema } from '../check-warehousing.validation'

type TCheckWarehousingFormValues = z.infer<typeof CheckWarehousingSchema>

export interface ICheckWarehousingFormProps
    extends
        IClassProps,
        IForm<
            Partial<ICheckWarehousingRequest>,
            ICheckWarehousing,
            Error,
            TCheckWarehousingFormValues
        > {
    checkWarehousingId?: TEntityId
}

/**
 * 🧾 FORM
 */
const CheckWarehousingCreateUpdateForm = ({
    className,
    ...formProps
}: ICheckWarehousingFormProps) => {
    const form = useForm<TCheckWarehousingFormValues>({
        resolver: standardSchemaResolver(CheckWarehousingSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            check_number: '',
            check_date: '',
            date: '',
            clear_days: '',
            amount: 0,
            reference_number: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateCheck({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Check created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateCheckById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Check updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TCheckWarehousingFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.checkWarehousingId) {
            updateMutation.mutate({
                id: formProps.checkWarehousingId,
                payload: formData,
            })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: errorResponse,
        isPending,
        reset,
    } = formProps.checkWarehousingId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

    const checkDate = form.watch('check_date')
    const clearDays = form.watch('clear_days')

    useEffect(() => {
        if (!checkDate || !clearDays) return

        const days =
            new Date(checkDate).getDate() + new Date(clearDays).getDate()

        form.setValue('date_cleared', days)
    }, [checkDate, clearDays])

    console.log(new Date(checkDate).getDate())

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
                        {/* CHECK NUMBER */}
                        <FormFieldWrapper
                            control={form.control}
                            label="Member Profile for Shortage"
                            name={'member_profile_id'}
                            render={() => (
                                <MemberPicker
                                    onSelect={(selectedMember) => {
                                        form.setValue(
                                            `member_profile_id`,
                                            selectedMember.id,
                                            {
                                                shouldDirty: true,
                                            }
                                        )
                                        form.setValue(
                                            'member_profile',
                                            selectedMember
                                        )
                                    }}
                                    placeholder="Select member profile"
                                    value={form.getValues('member_profile')}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Bank *"
                            name="bank_id"
                            render={({ field }) => (
                                <BankCombobox
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(selectedBank) =>
                                        field.onChange(selectedBank.id)
                                    }
                                    placeholder="Select a bank"
                                    value={field.value}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Bank"
                            name="employee_user_id"
                            render={(field) => (
                                <EmployeePicker
                                    {...field}
                                    mode="owner"
                                    onSelect={(value) => {
                                        form.setValue(
                                            'employee_user_id',
                                            value.id
                                        )
                                        form.setValue('employee_user', value)
                                    }}
                                    placeholder="Select Employee"
                                    value={form.getValues('employee_user')}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Check Number"
                            name="check_number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Check Number"
                                />
                            )}
                        />

                        {/* CHECK DATE */}
                        <FormFieldWrapper
                            control={form.control}
                            label="Check Date"
                            name="check_date"
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Clear Days"
                            name="clear_days"
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Date cleared"
                            name="date_cleared"
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                        {/* WAREHOUSING DATE */}
                        <FormFieldWrapper
                            control={form.control}
                            label="Warehousing Date"
                            name="date"
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        {/* AMOUNT */}
                        <FormFieldWrapper
                            control={form.control}
                            label="Amount"
                            name="amount"
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="0.00"
                                />
                            )}
                        />

                        {/* CLEAR DAYS */}

                        {/* REFERENCE */}
                        <FormFieldWrapper
                            control={form.control}
                            label="Reference Number"
                            name="reference_number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Reference Number"
                                />
                            )}
                        />

                        {/* IMAGE */}
                        <FormFieldWrapper
                            control={form.control}
                            label="Check Image"
                            name="media_id"
                            render={({ field }) => {
                                const value = form.watch('media')

                                return (
                                    <ImageField
                                        {...field}
                                        onChange={(img) => {
                                            if (img) field.onChange(img.id)
                                            else field.onChange(undefined)

                                            form.setValue('media', img)
                                        }}
                                        placeholder="Upload Check Image"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                    />
                                )
                            }}
                        />

                        {/* DESCRIPTION */}
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Description"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={
                        formProps.checkWarehousingId ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

/**
 * 🧩 MODAL
 */
export const CheckWarehousingCreateUpdateFormModal = ({
    title = 'Create Check',
    description = 'Fill out the form to add a new check record.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ICheckWarehousingFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <CheckWarehousingCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}
