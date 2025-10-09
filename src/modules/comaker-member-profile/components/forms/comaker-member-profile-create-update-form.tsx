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
                        label="Member Profile"
                        name="member_profile_id"
                        render={({ field }) => (
                            <MemberPicker
                                disabled={isDisabled(field.name)}
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
                                placeholder="Select Member Profile"
                                value={form.getValues('member_profile')}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Amount"
                        name="amount"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
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
                            label="Months Count"
                            name="months_count"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Year Count"
                            name="year_count"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                />
                            )}
                        />
                    </div>
                    <FormFieldWrapper
                        control={form.control}
                        label="Description"
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                className="min-h-24"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Description"
                            />
                        )}
                    />
                </div>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={firstError}
                    onReset={() => {
                        form.reset()
                    }}
                    onSubmit={(e) => onSubmit(e)}
                    readOnly={readOnly}
                    resetButtonType="button"
                    submitButtonType="button"
                    submitText={
                        formProps.defaultValues?.fieldKey ? 'Update' : 'Create'
                    }
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
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
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
