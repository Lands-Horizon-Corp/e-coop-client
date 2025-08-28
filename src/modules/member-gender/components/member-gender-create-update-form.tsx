import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    GenderSchema,
    IMemberGender,
    IMemberGenderRequest,
    useCreate,
    useUpdateById,
} from '@/modules/member-gender'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { IClassProps, IForm, TEntityId } from '@/types'

type TGenderFormValues = z.infer<typeof GenderSchema>

export interface IMemberGenderFormProps
    extends IClassProps,
        IForm<Partial<IMemberGenderRequest>, IMemberGender, Error> {
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
        resolver: standardSchemaResolver(GenderSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreate({ options: { onSuccess, onError } })
    const updateMutation = useUpdateById({ options: { onSuccess, onError } })

    const onSubmit = form.handleSubmit((formData) => {
        if (genderId) {
            updateMutation.mutate({ id: genderId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const {
        error: rawError,
        isPending,
        reset,
    } = genderId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

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
                                <Textarea
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
                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={genderId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
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
