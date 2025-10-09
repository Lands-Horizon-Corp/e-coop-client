import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import MemberPicker from '@/modules/member-profile/components/member-picker'

import RelationshipCombobox from '@/components/comboboxes/relationship-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateMemberRelativeAccount,
    useUpdateMemberRelativeAccount,
} from '../../member-relative-account.service'
import { IMemberRelativeAccount } from '../../member-relative-account.types'
import { MemberRelativeAccountSchema } from '../../member-relative-account.validation'

type TMemberRelativeAccountFormValues = z.infer<
    typeof MemberRelativeAccountSchema
>

export interface IMemberRelativeAccountFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberRelativeAccount>,
            IMemberRelativeAccount,
            Error,
            TMemberRelativeAccountFormValues
        > {
    memberProfileId: TEntityId
    relativeAccountId?: TEntityId
}

const MemberRelativeAccountCreateUpdateForm = ({
    memberProfileId,
    relativeAccountId,
    className,
    ...formProps
}: IMemberRelativeAccountFormProps) => {
    const form = useForm<TMemberRelativeAccountFormValues>({
        resolver: standardSchemaResolver(MemberRelativeAccountSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            member_profile_id: memberProfileId,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateMemberRelativeAccount({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateMemberRelativeAccount({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberRelativeAccountFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (relativeAccountId) {
            updateMutation.mutate({
                memberProfileId,
                relativeAccountId,
                data: formData,
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: formData,
            })
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = relativeAccountId ? updateMutation : createMutation

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
                        <FormFieldWrapper
                            control={form.control}
                            label="Relative Member Profile *"
                            name="relative_member_profile_id"
                            render={({ field }) => {
                                return (
                                    <MemberPicker
                                        disabled={isDisabled(field.name)}
                                        onSelect={(selectedMember) => {
                                            if (
                                                selectedMember.id ===
                                                memberProfileId
                                            )
                                                return toast.warning(
                                                    'You cannot set urself as relative.'
                                                )

                                            field.onChange(selectedMember?.id)
                                            form.setValue(
                                                'relative_member',
                                                selectedMember
                                            )
                                        }}
                                        placeholder="Relative Member Profile"
                                        value={form.getValues(
                                            'relative_member'
                                        )}
                                    />
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Relationship *"
                            name="family_relationship"
                            render={({ field }) => (
                                <RelationshipCombobox
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Relationship"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Description..."
                                    textEditorClassName="!max-w-none bg-background"
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
                    submitText={relativeAccountId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const MemberRelativeAccountCreateUpdateFormModal = ({
    title = 'Create Relative Account',
    description = 'Fill out the form to add or update relative account.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberRelativeAccountFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberRelativeAccountCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberRelativeAccountCreateUpdateForm
