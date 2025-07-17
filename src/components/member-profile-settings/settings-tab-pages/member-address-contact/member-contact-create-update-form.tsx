import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import { PhoneInput } from '@/components/contact-input/contact-input'
import { VerifiedPatchIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { entityIdSchema } from '@/validations/common'

import {
    useCreateMemberProfileContactReference,
    useUpdateMemberProfileContactReference,
} from '@/hooks/api-hooks/member/use-member-profile-settings'

import { IClassProps, IForm, IMemberContactReference, TEntityId } from '@/types'

export const memberContactReferenceSchema = z.object({
    id: z.string().optional(),
    member_profile_id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    contact_number: z.string().min(1, 'Contact number is required'),
})

type TMemberContactReferenceFormValues = z.infer<
    typeof memberContactReferenceSchema
>

export interface IMemberContactReferenceFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberContactReference>,
            IMemberContactReference,
            string,
            TMemberContactReferenceFormValues
        > {
    memberProfileId: TEntityId
    contactReferenceId?: TEntityId
}

const MemberContactCreateUpdateForm = ({
    memberProfileId,
    contactReferenceId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberContactReferenceFormProps) => {
    const form = useForm<TMemberContactReferenceFormValues>({
        resolver: zodResolver(memberContactReferenceSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            contact_number: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateMemberProfileContactReference({
        onSuccess,
        onError,
        showMessage: true,
    })
    const updateMutation = useUpdateMemberProfileContactReference({
        onSuccess,
        onError,
        showMessage: true,
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (contactReferenceId) {
            updateMutation.mutate({
                memberProfileId,
                contactReferenceId,
                data: formData,
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: formData,
            })
        }
    })

    const { error, isPending, reset } = contactReferenceId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TMemberContactReferenceFormValues>) =>
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
                            name="name"
                            label="Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="contact_number"
                            label="Contact Number *"
                            render={({ field, fieldState: { invalid } }) => (
                                <div className="relative flex flex-1 items-center gap-x-2">
                                    <VerifiedPatchIcon
                                        className={cn(
                                            'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                            (invalid || error) &&
                                                'text-destructive'
                                        )}
                                    />
                                    <PhoneInput
                                        {...field}
                                        className="w-full"
                                        defaultCountry="PH"
                                    />
                                </div>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description *"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Description"
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
                            ) : contactReferenceId ? (
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

export const MemberContactCreateUpdateFormModal = ({
    title = 'Create Contact Reference',
    description = 'Fill out the form to add or update contact reference.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberContactReferenceFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberContactCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberContactCreateUpdateForm
