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

import { IClassProps, IForm, TEntityId } from '@/types'

import { MemberClassificationSchema } from '../member-classification.validation'

type TMemberClassificationForm = z.infer<typeof MemberClassificationSchema>

export interface IMemberClassificationCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<IMemberClassificationRequest>, IMemberClassification> {
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
        resolver: standardSchemaResolver(MemberClassificationSchema),
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
        mutate: updateMemberClassification,
        reset: updateReset,
    } = useUpdateById({
        options: {
            onSuccess,
            onError,
        },
    })

    const onSubmit = (formData: TMemberClassificationForm) => {
        if (isUpdateMode && memberClassificationId) {
            updateMemberClassification({
                id: memberClassificationId,
                payload: formData,
            })
        } else {
            createMemberClassification(formData)
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
                                <Textarea
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
