import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { IForm } from '@/types'
import { IClassProps } from '@/types'
import { TEntityId } from '@/types'

import { useCreate, useUpdateById } from '../member-group.service'
import { IMemberGroup, IMemberGroupRequest } from '../member-group.types'
import { MemberGroupSchema } from '../member-group.validation'

type TGroupFormValues = z.infer<typeof MemberGroupSchema>

export interface IMemberGroupFormProps
    extends IClassProps,
        IForm<Partial<IMemberGroupRequest>, IMemberGroup> {
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
        resolver: zodResolver(MemberGroupSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            // organization_id: '',
            // branch_id: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreate({ options: { onSuccess, onError } })
    const updateMutation = useUpdateById({ options: { onSuccess, onError } })

    const onSubmit = form.handleSubmit((formData) => {
        if (groupId) {
            updateMutation.mutate({ id: groupId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error: rawError, isPending } = groupId
        ? updateMutation
        : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

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
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
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
