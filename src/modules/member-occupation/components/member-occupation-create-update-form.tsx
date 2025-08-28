import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: IMemberOccupationCreateUpdateFormProps) => {
    const isUpdateMode = Boolean(memberOccupationId)

    const form = useForm<TMemberOccupationForm>({
        resolver: standardSchemaResolver(MemberOccupationSchema),
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
        reset: createReset,
    } = useCreate({ options: { onSuccess, onError } })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMemberOccupation,
        reset: updateReset,
    } = useUpdateById({ options: { onSuccess, onError } })

    const onSubmit = (formData: TMemberOccupationForm) => {
        if (isUpdateMode && memberOccupationId) {
            updateMemberOccupation({
                id: memberOccupationId,
                payload: formData,
            })
        } else {
            createMemberOccupation(formData)
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
                                <Textarea
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
