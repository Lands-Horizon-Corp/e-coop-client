import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validations/common'

import {
    useCreateMemberOccupation,
    useUpdateMemberOccupation,
} from '@/hooks/api-hooks/member/use-member-occupation'

import {
    IClassProps,
    IForm,
    IMemberOccupation,
    IMemberOccupationRequest,
    TEntityId,
} from '@/types'

export const createMemberOccupationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }).trim(),
    description: descriptionSchema.transform(descriptionTransformerSanitizer),
})

type TMemberOccupationForm = z.infer<typeof createMemberOccupationSchema>

export interface IMemberOccupationCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<IMemberOccupationRequest>, IMemberOccupation, string> {
    memberOccupationId?: TEntityId
}

const MemberOccupationCreateUpdateForm = ({
    memberOccupationId,
    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: IMemberOccupationCreateUpdateFormProps) => {
    const isUpdateMode = Boolean(memberOccupationId)

    const form = useForm<TMemberOccupationForm>({
        resolver: zodResolver(createMemberOccupationSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...defaultValues,
        },
    })

    const {
        error: createError,
        isPending: isCreating,
        mutate: createMemberOccupation,
    } = useCreateMemberOccupation({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMemberOccupation,
    } = useUpdateMemberOccupation({ onSuccess, onError })

    const onSubmit = (formData: TMemberOccupationForm) => {
        if (isUpdateMode && memberOccupationId) {
            updateMemberOccupation({
                occupationId: memberOccupationId,
                data: formData,
            })
        } else {
            createMemberOccupation(formData)
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
                                    placeholder="Member Occupation Name"
                                    autoComplete="member-occupation-name"
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
                                    autoComplete="member-occupation-description"
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

export const MemberOccupationCreateUpdateFormModal = ({
    title = 'Create Member Occupation',
    description = 'Fill out the form to add a new member occupation.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberOccupationCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberOccupationCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberOccupationCreateUpdateForm
