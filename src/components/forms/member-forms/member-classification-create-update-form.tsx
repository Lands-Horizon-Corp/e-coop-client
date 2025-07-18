import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { IForm } from '@/types/components'
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

import { memberClassificationSchema } from '@/validations/member/member-classification'

import {
    useCreateMemberClassification,
    useUpdateMemberClassification,
} from '@/hooks/api-hooks/member/use-member-classification'

import {
    IClassProps,
    IMemberClassification,
    IMemberClassificationRequest,
    TEntityId,
} from '@/types'

type TMemberClassificationForm = z.infer<typeof memberClassificationSchema>

export interface IMemberClassificationCreateUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberClassificationRequest>,
            IMemberClassification,
            string
        > {
    memberClassificationId?: TEntityId
}

const MemberClassificationCreateUpdateForm = ({
    readOnly,
    className,
    defaultValues,
    memberClassificationId,
    onError,
    onSuccess,
}: IMemberClassificationCreateUpdateFormProps) => {
    const isUpdateMode = Boolean(memberClassificationId)

    const form = useForm<TMemberClassificationForm>({
        resolver: zodResolver(memberClassificationSchema),
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
        mutate: createMemberClassification,
    } = useCreateMemberClassification({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMemberClassification,
    } = useUpdateMemberClassification({ onSuccess, onError })

    const onSubmit = (formData: TMemberClassificationForm) => {
        if (isUpdateMode && memberClassificationId) {
            updateMemberClassification({
                classificationId: memberClassificationId,
                data: formData,
            })
        } else {
            createMemberClassification(formData)
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
                            label="Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Member Classification Name"
                                    autoComplete="member-classification-name"
                                    disabled={isCreating || isUpdating}
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
                                    placeholder="Description *"
                                    autoComplete="member-classification-description"
                                    disabled={isCreating || isUpdating}
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

export const MemberClassificationCreateUpdateFormModal = ({
    title = 'Create Member Classification',
    description = 'Fill out the form to add a new member classification.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberClassificationCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberClassificationCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberClassificationCreateUpdateForm
