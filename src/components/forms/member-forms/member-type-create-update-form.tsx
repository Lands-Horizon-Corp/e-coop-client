import z from 'zod'
import { useForm } from 'react-hook-form'
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
    useCreateMemberType,
    useUpdateMemberType,
} from '@/hooks/api-hooks/member/use-member-type'
import { createMemberTypeSchema } from '@/validations/member/member-type-schema'

import { IForm, TEntityId, IClassProps, IMemberType } from '@/types'

export type TMemberTypeForm = z.infer<typeof createMemberTypeSchema>

export interface IMemberTypeCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<TMemberTypeForm>, IMemberType, string> {
    memberTypeId?: TEntityId
}

const MemberTypeCreateUpdateForm = ({
    memberTypeId,
    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: IMemberTypeCreateUpdateFormProps) => {
    const isUpdateMode = Boolean(memberTypeId)

    const form = useForm<TMemberTypeForm>({
        resolver: zodResolver(createMemberTypeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            prefix: '',
            description: '',
            ...defaultValues,
        },
    })

    const {
        error: createError,
        isPending: isCreating,
        mutate: createMemberType,
    } = useCreateMemberType({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMemberType,
    } = useUpdateMemberType({ onSuccess, onError })

    const onSubmit = (formData: TMemberTypeForm) => {
        if (isUpdateMode && memberTypeId) {
            updateMemberType({ memberTypeId, data: formData })
        } else {
            createMemberType(formData)
        }
    }

    const combinedError = createError || updateError

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isCreating || isUpdating || readOnly}
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
                                    placeholder="Member Type Name"
                                    autoComplete="member-type-name"
                                    disabled={
                                        isCreating || isUpdating || readOnly
                                    }
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="prefix"
                            label="Prefix"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Prefix"
                                    autoComplete="member-type-prefix"
                                    disabled={
                                        isCreating || isUpdating || readOnly
                                    }
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
                                    autoComplete="member-type-description"
                                    disabled={
                                        isCreating || isUpdating || readOnly
                                    }
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>

                <FormErrorMessage errorMessage={combinedError} />

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
                            disabled={isCreating || isUpdating}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isCreating || isUpdating ? (
                                <LoadingSpinner />
                            ) : isUpdateMode ? (
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

export const MemberTypeCreateUpdateFormModal = ({
    title = 'Create Member Type',
    description = 'Fill out the form to add a new member type.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberTypeCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberTypeCreateUpdateForm {...formProps} />
        </Modal>
    )
}

export default MemberTypeCreateUpdateForm
