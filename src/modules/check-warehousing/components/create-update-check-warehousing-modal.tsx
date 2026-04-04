import { useEffect } from 'react'

import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import { IMedia } from '@/modules/media'
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
 * 🧾 FORM (Rearranged with Single Member Selection)
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
            clear_days: 0,
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
        // Only auto-calculate if we have both values
        if (!checkDate || !clearDays) return

        const baseDate = new Date(checkDate)

        // Check if the date is valid to prevent "Invalid Date" errors
        if (isNaN(baseDate.getTime())) return

        // Add the number of days
        const resultDate = new Date(baseDate)
        resultDate.setDate(resultDate.getDate() + Number(clearDays))

        form.setValue('date_cleared', resultDate, {
            shouldDirty: true,
        })
    }, [checkDate, clearDays, form])
    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-6', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-6"
                    disabled={isPending || formProps.readOnly}
                >
                    {/* TOP SECTION: SINGLE MEMBER SELECT */}
                    <FormFieldWrapper
                        control={form.control}
                        label="P.B. No. / Member Name"
                        name={'member_profile_id'}
                        render={() => (
                            <MemberPicker
                                onSelect={(selectedMember) => {
                                    form.setValue(
                                        `member_profile_id`,
                                        selectedMember.id,
                                        { shouldDirty: true }
                                    )
                                    form.setValue(
                                        'member_profile',
                                        selectedMember
                                    )
                                }}
                                placeholder="Search and select member..."
                                value={form.getValues('member_profile')}
                            />
                        )}
                    />

                    <hr />

                    {/* SECTION: CHECK INFORMATION */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Check Information
                        </h3>
                        <div className="grid grid-cols-1 gap-y-2">
                            {/* Check No */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium">
                                    Check No:
                                </label>
                                <div className="col-span-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="check_number"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Check Date */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium">
                                    Check Date:
                                </label>
                                <div className="col-span-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="check_date"
                                        render={({ field }) => (
                                            <Input
                                                type="date"
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                value={
                                                    field.value instanceof Date
                                                        ? field.value
                                                              .toISOString()
                                                              .split('T')[0]
                                                        : field.value
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Clear Days */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium">
                                    Clear Days:
                                </label>
                                <div className="col-span-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="clear_days"
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                placeholder="e.g. 3"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Date Cleared */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium">
                                    Date Cleared:
                                </label>
                                <div className="col-span-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="date_cleared"
                                        render={({ field }) => (
                                            <Input
                                                type="date"
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                value={
                                                    field.value instanceof Date
                                                        ? field.value
                                                              .toISOString()
                                                              .split('T')[0]
                                                        : field.value
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Bank */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium">
                                    Bank:
                                </label>
                                <div className="col-span-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="bank_id"
                                        render={({ field }) => (
                                            <BankCombobox
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                onChange={(selectedBank) =>
                                                    field.onChange(
                                                        selectedBank.id
                                                    )
                                                }
                                                value={field.value}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium">
                                    Amount:
                                </label>
                                <div className="col-span-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                placeholder="0.00"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* SECTION: O.R. INFORMATION */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            O.R. Information
                        </h3>
                        <div className="grid grid-cols-1 gap-y-2">
                            {/* Ref No */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium">
                                    Ref. No.
                                </label>
                                <div className="col-span-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="reference_number"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium">
                                    Date:
                                </label>
                                <div className="col-span-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <Input
                                                type="date"
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                value={
                                                    field.value instanceof Date
                                                        ? field.value
                                                              .toISOString()
                                                              .split('T')[0]
                                                        : field.value
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Teller / Employee */}
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-medium">
                                    Teller/Coll.:
                                </label>
                                <div className="col-span-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="employee_user_id"
                                        render={(field) => (
                                            <EmployeePicker
                                                {...field}
                                                key={'user_id'}
                                                mode="owner"
                                                onSelect={(value) => {
                                                    form.setValue(
                                                        'employee_user_id',
                                                        value.user_id
                                                    )
                                                    form.setValue(
                                                        'employee_user',
                                                        value
                                                    )
                                                }}
                                                value={form.getValues(
                                                    'employee_user'
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* SECTION: REMARKS */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Remarks</label>
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    className="min-h-[80px]"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>
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
