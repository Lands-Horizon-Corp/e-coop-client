import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Separator } from '@/components/ui/separator'
import MemberPicker from '@/components/pickers/member-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import RelationshipCombobox from '@/components/comboboxes/relationship-combobox'

import { cn } from '@/lib/utils'
import {
    useCreateMemberRelativeAccount,
    useUpdateMemberRelativeAccount,
} from '@/hooks/api-hooks/member/use-member-profile-settings'
import { entityIdSchema, familyRelationshipSchema } from '@/validations/common'

import { IForm, TEntityId, IClassProps, IMemberRelativeAccount } from '@/types'
import { toast } from 'sonner'

// STRICTLY BASED ON IMemberRelativeAccountRequest
export const memberRelativeAccountSchema = z.object({
    id: z.string().optional(),
    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    organization: z.any(),
    member_profile_id: entityIdSchema,
    relative_member_profile_id: entityIdSchema,
    relative_member: z.any(),
    family_relationship: familyRelationshipSchema,
    description: z.string().optional(),
})

type TMemberRelativeAccountFormValues = z.infer<
    typeof memberRelativeAccountSchema
>

export interface IMemberRelativeAccountFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberRelativeAccount>,
            IMemberRelativeAccount,
            string,
            TMemberRelativeAccountFormValues
        > {
    memberProfileId: TEntityId
    relativeAccountId?: TEntityId
}

const MemberRelativeAccountCreateUpdateForm = ({
    memberProfileId,
    relativeAccountId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberRelativeAccountFormProps) => {
    const form = useForm<TMemberRelativeAccountFormValues>({
        resolver: zodResolver(memberRelativeAccountSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            member_profile_id: memberProfileId,
            ...defaultValues,
        },
    })

    const createMutation = useCreateMemberRelativeAccount({
        onSuccess,
        onError,
        showMessage: true,
    })

    const updateMutation = useUpdateMemberRelativeAccount({
        onSuccess,
        onError,
        showMessage: true,
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
    })

    const { error, isPending, reset } = relativeAccountId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TMemberRelativeAccountFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="relative_member_profile_id"
                            label="Relative Member Profile *"
                            render={({ field }) => {
                                return (
                                    <MemberPicker
                                        value={form.getValues(
                                            'relative_member'
                                        )}
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
                                        disabled={isDisabled(field.name)}
                                    />
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="family_relationship"
                            label="Relationship *"
                            render={({ field }) => (
                                <RelationshipCombobox
                                    {...field}
                                    id={field.name}
                                    placeholder="Relationship"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    placeholder="Description..."
                                    textEditorClassName="!max-w-none bg-background"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                form.reset()
                                reset()
                            }}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : relativeAccountId ? (
                                'Update'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
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
            title={title}
            description={description}
            className={cn('', className)}
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
