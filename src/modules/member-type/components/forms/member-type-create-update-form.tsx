import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    IMemberType,
    MemberTypeSchema,
    useCreate,
    useUpdateById,
} from '@/modules/member-type'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { IClassProps, IForm, TEntityId } from '@/types'

export type TMemberTypeForm = z.infer<typeof MemberTypeSchema>

export interface IMemberTypeCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<TMemberTypeForm>, IMemberType> {
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
        resolver: standardSchemaResolver(MemberTypeSchema),
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
        reset: resetCreate,
    } = useCreate({
        options: {
            onSuccess,
            onError,
        },
    })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMemberType,
        reset: resetUpdate,
    } = useUpdateById({
        options: {
            onSuccess,
            onError,
        },
    })

    const onSubmit = (formData: TMemberTypeForm) => {
        if (isUpdateMode && memberTypeId) {
            updateMemberType({ id: memberTypeId, payload: formData })
        } else {
            createMemberType(formData)
        }
    }

    const error = serverRequestErrExtractor({
        error: createError || updateError,
    })

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
                                <Textarea
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

                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isCreating || isUpdating}
                    disableSubmit={!form.formState.isDirty}
                    submitText="Create"
                    onReset={() => {
                        form.reset()
                        resetCreate()
                        resetUpdate()
                    }}
                />
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
            <MemberTypeCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberTypeCreateUpdateForm
