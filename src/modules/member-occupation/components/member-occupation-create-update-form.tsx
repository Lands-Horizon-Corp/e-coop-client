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

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreate, useUpdateById } from '../member-occupation.service'
import {
    IMemberOccupation,
    IMemberOccupationRequest,
} from '../member-occupation.types'
import { MemberOccupationSchema } from '../member-occupation.validation'

type TMemberOccupationForm = z.infer<typeof MemberOccupationSchema>

export interface IMemberOccupationCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<IMemberOccupationRequest>, IMemberOccupation> {
    memberOccupationId?: TEntityId
}

const MemberOccupationCreateUpdateForm = ({
    memberOccupationId,
    className,
    ...formProps
}: IMemberOccupationCreateUpdateFormProps) => {
    const form = useForm<TMemberOccupationForm>({
        resolver: standardSchemaResolver(MemberOccupationSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreate({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })
    const updateMutation = useUpdateById({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberOccupationForm>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (memberOccupationId) {
            updateMutation.mutate({
                id: memberOccupationId,
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
    } = memberOccupationId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="member-occupation-name"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Member Occupation Name"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="member-occupation-description"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Description"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={memberOccupationId ? 'Update' : 'Create'}
                />
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
            className={cn('', className)}
            description={description}
            title={title}
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
