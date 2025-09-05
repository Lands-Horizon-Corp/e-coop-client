import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    IMemberClassification,
    IMemberClassificationRequest,
    useCreate,
    useUpdateById,
} from '@/modules/member-classification'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { MemberClassificationSchema } from '../member-classification.validation'

type TMemberClassificationForm = z.infer<typeof MemberClassificationSchema>

export interface IMemberClassificationCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<IMemberClassificationRequest>, IMemberClassification> {
    memberClassificationId?: TEntityId
}

const MemberClassificationCreateUpdateForm = ({
    memberClassificationId,
    className,
    ...formProps
}: IMemberClassificationCreateUpdateFormProps) => {
    const form = useForm<TMemberClassificationForm>({
        resolver: standardSchemaResolver(MemberClassificationSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreate({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const updateMutation = useUpdateById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberClassificationForm>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (memberClassificationId) {
            updateMutation.mutate({
                id: memberClassificationId,
                payload: formData,
            })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = memberClassificationId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
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
                                    placeholder="Description *"
                                    autoComplete="member-classification-description"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>

                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={memberClassificationId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
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
