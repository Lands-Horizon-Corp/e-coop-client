import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { toInputDateString } from '@/utils'
import { Path, useForm } from 'react-hook-form'

import RelationshipCombobox from '@/components/comboboxes/relationship-combobox'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'

import { cn } from '@/lib/utils'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
    familyRelationshipSchema,
    stringDateWithTransformSchema,
} from '@/validations/common'

import {
    useCreateMemberJointAccount,
    useUpdateMemberJointAccount,
} from '@/hooks/api-hooks/member/use-member-profile-settings'

import {
    IClassProps,
    IForm,
    IMedia,
    IMemberJointAccount,
    TEntityId,
} from '@/types'

export const memberJointAccountSchema = z.object({
    id: z.string().optional(),

    picture_media_id: entityIdSchema,
    picture_media: z.any(),
    signature_media_id: entityIdSchema,
    signature_media: z.any(),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last name is required'),
    suffix: z.string().optional(),
    birthday: stringDateWithTransformSchema,
    family_relationship: familyRelationshipSchema,
})

type TMemberJointAccountFormValues = z.infer<typeof memberJointAccountSchema>

export interface IMemberJointAccountFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberJointAccount>,
            IMemberJointAccount,
            string,
            TMemberJointAccountFormValues
        > {
    memberProfileId: TEntityId
    jointAccountId?: TEntityId
}

const MemberJointAccountCreateUpdateForm = ({
    memberProfileId,
    jointAccountId,
    readOnly,
    className,
    hiddenFields,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberJointAccountFormProps) => {
    const form = useForm<TMemberJointAccountFormValues>({
        resolver: zodResolver(memberJointAccountSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            first_name: '',
            last_name: '',
            ...defaultValues,
            birthday: toInputDateString(defaultValues?.birthday ?? new Date()),
        },
    })

    const createMutation = useCreateMemberJointAccount({
        onSuccess,
        onError,
        showMessage: true,
    })
    const updateMutation = useUpdateMemberJointAccount({
        onSuccess,
        onError,
        showMessage: true,
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (jointAccountId) {
            updateMutation.mutate({
                memberProfileId,
                jointAccountId,
                data: {
                    ...formData,
                    full_name: `${formData.first_name ?? ''} ${formData.middle_name ?? ''} ${formData.last_name ?? ''} ${formData.suffix ?? ''}`,
                },
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: {
                    ...formData,
                    full_name: `${formData.first_name ?? ''} ${formData.middle_name ?? ''} ${formData.last_name ?? ''} ${formData.suffix ?? ''}`,
                },
            })
        }
    })

    const { error, isPending, reset } = jointAccountId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TMemberJointAccountFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="picture_media_id"
                            label="Photo"
                            hiddenFields={hiddenFields}
                            render={({ field }) => {
                                const value = form.watch('picture_media')

                                return (
                                    <ImageField
                                        {...field}
                                        placeholder="Upload Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue(
                                                'picture_media',
                                                newImage
                                            )
                                        }}
                                    />
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="signature_media_id"
                            label="Signature"
                            hiddenFields={hiddenFields}
                            render={({ field }) => {
                                const value = form.watch('signature_media')
                                return (
                                    <SignatureField
                                        {...field}
                                        placeholder="Signature"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue(
                                                'signature_media',
                                                newImage
                                            )
                                        }}
                                    />
                                )
                            }}
                        />
                    </div>
                    <fieldset className="space-y-3">
                        <div className="space-y-4">
                            <p>Personal Information</p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-10">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="first_name"
                                    label="First Name *"
                                    className="col-span-3"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="First Name"
                                            autoComplete="given-name"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="middle_name"
                                    label="Middle Name"
                                    className="col-span-3"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Middle Name"
                                            autoComplete="additional-name"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="last_name"
                                    label="Last Name *"
                                    className="col-span-3"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Last Name"
                                            autoComplete="family-name"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="suffix"
                                    label="Suffix"
                                    className="col-span-1"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder=""
                                            autoComplete="honorific-suffix"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="birthday"
                                label="Birthday *"
                                className="relative"
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        id={field.name}
                                        placeholder="Birthday"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="family_relationship"
                                label="Relationship *"
                                render={({ field }) => (
                                    <RelationshipCombobox
                                        {...field}
                                        id={field.name}
                                        placeholder="Select Relationship"
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
                            ) : jointAccountId ? (
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

export const MemberJointAccountCreateUpdateFormModal = ({
    title = 'Create Joint Account',
    description = 'Fill out the form to add or update joint account.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberJointAccountFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('w-full !max-w-2xl', className)}
            {...props}
        >
            <MemberJointAccountCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberJointAccountCreateUpdateForm
