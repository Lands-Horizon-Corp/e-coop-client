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

import {
    IMemberEducationalAttainmentRequest,
    IMemberEducationalAttainmentResource,
    TEntityId,
} from '@/types/coop-types'
import { cn } from '@/lib/utils'
import { IClassProps } from '@/types'
import { IForm } from '@/types/components'
import {
    useCreateMemberEducationalAttainment,
    useUpdateMemberEducationalAttainment,
} from '@/hooks/api-hooks/member/use-member-educational-attainment'

export const createMemberEducationalAttainmentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
})

type TMemberEducationalAttainmentForm = z.infer<
    typeof createMemberEducationalAttainmentSchema
>

export interface IMemberEducationalAttainmentCreateUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberEducationalAttainmentRequest>,
            IMemberEducationalAttainmentResource,
            string
        > {
    memberEducationalAttainmentId?: TEntityId
}

const MemberEducationalAttainmentCreateUpdateForm = ({
    memberEducationalAttainmentId,
    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: IMemberEducationalAttainmentCreateUpdateFormProps) => {
    const isUpdateMode = Boolean(memberEducationalAttainmentId)

    const form = useForm<TMemberEducationalAttainmentForm>({
        resolver: zodResolver(createMemberEducationalAttainmentSchema),
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
        mutate: createMemberEducationalAttainment,
    } = useCreateMemberEducationalAttainment({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMemberEducationalAttainment,
    } = useUpdateMemberEducationalAttainment({ onSuccess, onError })

    const onSubmit = (formData: TMemberEducationalAttainmentForm) => {
        if (isUpdateMode && memberEducationalAttainmentId) {
            updateMemberEducationalAttainment({
                attainmentId: memberEducationalAttainmentId,
                data: formData,
            })
        } else {
            createMemberEducationalAttainment(formData)
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
                                    placeholder="Educational Attainment Name"
                                    autoComplete="educational-attainment-name"
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
                                    autoComplete="educational-attainment-description"
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
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
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

export const MemberEducationalAttainmentCreateUpdateFormModal = ({
    title = 'Member Educational Attainment',
    description = 'Fill out the form to create or update an educational attainment.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<
        IMemberEducationalAttainmentCreateUpdateFormProps,
        'className'
    >
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberEducationalAttainmentCreateUpdateForm {...formProps} />
        </Modal>
    )
}

export default MemberEducationalAttainmentCreateUpdateForm
