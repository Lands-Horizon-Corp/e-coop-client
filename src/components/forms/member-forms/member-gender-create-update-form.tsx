import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { createGenderSchema } from '@/validations/member/member-gender-schema'

import {
    useCreateGender,
    useUpdateGender,
} from '@/hooks/api-hooks/member/use-member-gender'

import {
    IClassProps,
    IForm,
    IMemberGender,
    IMemberGenderRequest,
    TEntityId,
} from '@/types'

type TGenderFormValues = z.infer<typeof createGenderSchema>

export interface IMemberGenderFormProps
    extends IClassProps,
        IForm<Partial<IMemberGenderRequest>, IMemberGender, string> {
    genderId?: TEntityId
}

const MemberGenderCreateUpdateForm = ({
    genderId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberGenderFormProps) => {
    const form = useForm<TGenderFormValues>({
        resolver: zodResolver(createGenderSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateGender({ onSuccess, onError })
    const updateMutation = useUpdateGender({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (genderId) {
            updateMutation.mutate({ genderId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } = genderId ? updateMutation : createMutation

    const isDisabled = (field: Path<TGenderFormValues>) =>
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
                                    placeholder="Gender Name"
                                    autoComplete="gender-name"
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
                                    autoComplete="gender-description"
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
                            ) : genderId ? (
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

export const MemberGenderCreateUpdateFormModal = ({
    title = 'Create Gender',
    description = 'Fill out the form to add a new gender.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberGenderFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberGenderCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberGenderCreateUpdateForm
