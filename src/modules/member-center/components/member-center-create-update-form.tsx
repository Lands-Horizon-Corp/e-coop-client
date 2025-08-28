import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreate, useUpdateById } from '../member-center.service'
import { IMemberCenter, IMemberCenterRequest } from '../member-center.types'
import { MemberCenterSchema } from '../member-center.validation'

type TMemberCenterForm = z.infer<typeof MemberCenterSchema>

export interface IMemberCenterCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<IMemberCenterRequest>, IMemberCenter> {
    memberCenterId?: TEntityId
}

const MemberCenterCreateUpdateForm = ({
    memberCenterId,
    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: IMemberCenterCreateUpdateFormProps) => {
    const isUpdateMode = Boolean(memberCenterId)

    const form = useForm<TMemberCenterForm>({
        resolver: standardSchemaResolver(MemberCenterSchema),
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
        mutate: createMemberCenter,
        reset: createReset,
    } = useCreate({
        options: {
            onSuccess,
            onError,
        },
    })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMemberCenter,
        reset: updateReset,
    } = useUpdateById({
        options: {
            onSuccess,
            onError,
        },
    })

    const onSubmit = (formData: TMemberCenterForm) => {
        if (isUpdateMode && memberCenterId) {
            updateMemberCenter({ id: memberCenterId, payload: formData })
        } else {
            createMemberCenter(formData)
        }
    }

    const combinedError = serverRequestErrExtractor({
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
                                    placeholder="Member Center Name"
                                    autoComplete="member-center-name"
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
                                    autoComplete="member-center-description"
                                    disabled={
                                        isCreating || isUpdating || readOnly
                                    }
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>

                <FormFooterResetSubmit
                    error={combinedError}
                    readOnly={readOnly}
                    isLoading={isCreating || isUpdating}
                    disableSubmit={!form.formState.isDirty}
                    submitText={isUpdateMode ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        createReset()
                        updateReset()
                    }}
                />
            </form>
        </Form>
    )
}

export const MemberCenterCreateUpdateFormModal = ({
    title = 'Create Member Center',
    description = 'Fill out the form to add a new member center.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberCenterCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberCenterCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberCenterCreateUpdateForm
