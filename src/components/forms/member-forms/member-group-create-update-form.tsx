import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import {
    useCreateMemberGroup,
    useUpdateMemberGroup,
} from '@/hooks/api-hooks/member/use-member-group'
import { createMemberGroupSchema } from '@/validations/member/member-group-schema'

import { IForm } from '@/types'
import { IClassProps } from '@/types'
import { IMemberGroupRequest, IMemberGroup, TEntityId } from '@/types'

type TGroupFormValues = z.infer<typeof createMemberGroupSchema>

export interface IMemberGroupFormProps
    extends IClassProps,
        IForm<Partial<IMemberGroupRequest>, IMemberGroup, string> {
    groupId?: TEntityId
}

const MemberGroupCreateUpdateForm = ({
    groupId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberGroupFormProps) => {
    const form = useForm<TGroupFormValues>({
        resolver: zodResolver(createMemberGroupSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            organization_id: '',
            branch_id: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateMemberGroup({ onSuccess, onError })
    const updateMutation = useUpdateMemberGroup({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (groupId) {
            updateMutation.mutate({ groupId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } = groupId ? updateMutation : createMutation

    const isDisabled = (field: Path<TGroupFormValues>) =>
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
                            label="Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Group Name"
                                    autoComplete="group-name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Description"
                                    autoComplete="group-description"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="organization_id"
                            label="Organization ID"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Organization ID"
                                    autoComplete="organization-id"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="branch_id"
                            label="Branch ID"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Branch ID"
                                    autoComplete="branch-id"
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
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : groupId ? (
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

export const MemberGroupCreateUpdateFormModal = ({
    title = 'Create Group',
    description = 'Fill out the form to add a new group.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberGroupFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberGroupCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberGroupCreateUpdateForm
