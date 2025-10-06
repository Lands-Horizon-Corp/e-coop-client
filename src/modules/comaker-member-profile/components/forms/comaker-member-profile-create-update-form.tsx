import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import MemberPicker from '@/modules/member-profile/components/member-picker'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    ComakerMemberProfileSchema,
    TComakerMemberProfileSchema,
} from '../../comaker-member-profile.validation'

type TComakerMemberProfileFormValues = TComakerMemberProfileSchema & {
    fieldKey?: string
}

type IComakerMemberProfileForForm = z.infer<typeof ComakerMemberProfileSchema>

export interface IComakerMemberProfileFormProps
    extends IClassProps,
        IForm<
            Partial<TComakerMemberProfileFormValues>,
            IComakerMemberProfileForForm,
            Error,
            TComakerMemberProfileFormValues
        > {
    loanTransactionId?: TEntityId
    exceptId?: TEntityId // for member picker
}

const ComakerMemberProfileCreateUpdateForm = ({
    exceptId,
    className,
    loanTransactionId,
    onSuccess,
    readOnly,
    ...formProps
}: IComakerMemberProfileFormProps) => {
    const form = useForm<TComakerMemberProfileFormValues>({
        resolver: standardSchemaResolver(ComakerMemberProfileSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            loan_transaction_id: loanTransactionId,
            member_profile_id: '',
            amount: 0,
            months_count: 0,
            year_count: 0,
            ...formProps.defaultValues,
        },
    })

    const { formRef, firstError, isDisabled } =
        useFormHelper<TComakerMemberProfileFormValues>({
            form,
            readOnly,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData, e) => {
        e?.stopPropagation()
        e?.preventDefault()
        onSuccess?.(formData)
        form.reset()
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
                        name="member_profile_id"
                        label="Member Profile"
                        render={({ field }) => (
                            <MemberPicker
                                value={form.getValues('member_profile')}
                                placeholder="Select Member Profile"
                                onSelect={(profile) => {
                                    if (
                                        profile?.id &&
                                        profile?.id === exceptId
                                    ) {
                                        return toast.warning(
                                            'Picking this member is not allowed'
                                        )
                                    }

                                    field.onChange(profile?.id)
                                    form.setValue('member_profile', profile, {
                                        shouldDirty: true,
                                    })
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
                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="months_count"
                            label="Months Count"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="year_count"
                            label="Year Count"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>
                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                placeholder="Description"
                                disabled={isDisabled(field.name)}
                                className="min-h-24"
                            />
                        )}
                    />
                </div>

                <FormFooterResetSubmit
                    readOnly={readOnly}
                    error={firstError}
                    resetButtonType="button"
                    submitButtonType="button"
                    disableSubmit={!form.formState.isDirty}
                    submitText={
                        formProps.defaultValues?.fieldKey ? 'Update' : 'Create'
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

export const ComakerMemberProfileCreateUpdateModal = ({
    title = 'Add Comaker Member Profile',
    description = 'Add a new comaker member profile entry.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: IComakerMemberProfileFormProps
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('!max-w-xl', className)}
            {...props}
        >
            <ComakerMemberProfileCreateUpdateForm
                {...formProps}
                onSuccess={(profile) => {
                    formProps.onSuccess?.(profile)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default ComakerMemberProfileCreateUpdateForm
