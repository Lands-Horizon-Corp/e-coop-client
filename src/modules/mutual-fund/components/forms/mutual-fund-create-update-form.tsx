import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import MemberPicker from '@/modules/member-profile/components/member-picker'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { MUTUAL_FUND_COMPUTATION_TYPES } from '../../mutual-fund.constant'
import {
    useCreateMutualFund,
    useUpdateMutualFundById,
} from '../../mutual-fund.service'
import { IMutualFund, IMutualFundRequest } from '../../mutual-fund.types'
import { MUTUAL_FUND_COMPUTATION_TYPE_LABELS } from '../../mutual-fund.utils'
import { MutualFundSchema } from '../../mutual-fund.validation'

type TMutualFundSchema = z.infer<typeof MutualFundSchema>

export interface IMutualFundFormProps
    extends IClassProps,
        IForm<
            Partial<IMutualFundRequest>,
            IMutualFund,
            Error,
            TMutualFundSchema
        > {
    mutualFundId?: TEntityId
}

const MutualFundCreateUpdateForm = ({
    mutualFundId,
    className,
    ...formProps
}: IMutualFundFormProps) => {
    const form = useForm<TMutualFundSchema>({
        resolver: standardSchemaResolver(MutualFundSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            amount: 0,
            computation_type: 'total_amount',
            extension_only: false,
            ...formProps.defaultValues,
            date_of_death: toInputDateString(
                formProps.defaultValues?.date_of_death || new Date()
            ),
        },
    })

    const createMutation = useCreateMutualFund({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const updateMutation = useUpdateMutualFundById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMutualFundSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (mutualFundId) {
            toast.promise(
                updateMutation.mutateAsync({
                    id: mutualFundId,
                    payload: formData,
                }),
                {
                    loading: 'Updating mutual fund...',
                    success: 'Mutual fund updated successfully',
                    error: 'Failed to update mutual fund',
                }
            )
        } else {
            toast.promise(createMutation.mutateAsync(formData), {
                loading: 'Creating mutual fund...',
                success: 'Mutual fund created successfully',
                error: 'Failed to create mutual fund',
            })
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = mutualFundId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

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
                        {/* Date of Death and Member Profile */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Date of Death *"
                                name="date_of_death"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        className="block"
                                        disabled={isDisabled(field.name)}
                                        placeholder="Select date"
                                        value={field.value ?? ''}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Member Profile *"
                                name="member_profile_id"
                                render={({ field }) => (
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
                                )}
                            />
                        </div>

                        {/* Name and Amount */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Name *"
                                name="name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                        placeholder="Mutual Fund Name"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Benefit Claimed *"
                                name="amount"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value)
                                            )
                                        }
                                        placeholder="0.00"
                                        step="0.01"
                                        type="number"
                                    />
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Enter description"
                                    rows={3}
                                />
                            )}
                        />

                        {/* Computation Type */}
                        <FormFieldWrapper
                            control={form.control}
                            label="Computation Type *"
                            name="computation_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 gap-3 rounded-xl bg-popover/20 p-3.5"
                                    disabled={isDisabled(field.name)}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {MUTUAL_FUND_COMPUTATION_TYPES.map(
                                        (type) => (
                                            <div
                                                className="flex items-center space-x-2"
                                                key={type}
                                            >
                                                <RadioGroupItem
                                                    id={type}
                                                    value={type}
                                                />
                                                <Label
                                                    className="cursor-pointer font-normal"
                                                    htmlFor={type}
                                                >
                                                    {
                                                        MUTUAL_FUND_COMPUTATION_TYPE_LABELS[
                                                            type
                                                        ]
                                                    }
                                                </Label>
                                            </div>
                                        )
                                    )}
                                </RadioGroup>
                            )}
                        />

                        {/* Extension Only Checkbox */}
                        <FormFieldWrapper
                            control={form.control}
                            name="extension_only"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2 rounded-xl bg-popover/20 p-3.5">
                                    <Checkbox
                                        checked={field.value}
                                        disabled={isDisabled(field.name)}
                                        id="extension_only"
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label
                                        className="w-full cursor-pointer font-normal"
                                        htmlFor="extension_only"
                                    >
                                        Extension Only
                                    </Label>
                                </div>
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
                    submitText={mutualFundId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const MutualFundCreateUpdateFormModal = ({
    title = 'Create Mutual Fund',
    description = 'Fill out the form to create a mutual fund record.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMutualFundFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-2xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <MutualFundCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MutualFundCreateUpdateForm
