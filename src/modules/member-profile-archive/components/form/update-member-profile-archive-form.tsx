import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media/media.types'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useUpdateMemberProfileArchiveById } from '../..'
import {
    IMemberProfileArchive,
    IMemberProfileArchiveRequest,
} from '../../member-profile-archive.types'
import { MemberProfileArchiveSchema } from '../../member-profile-archive.validation'
import MemberArchiveItem from '../member-archive-item'

type TMemberProfileArchiveFormValues = z.infer<
    typeof MemberProfileArchiveSchema
> & {
    media?: IMedia | null
}

export interface IMemberProfileArchiveFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberProfileArchiveRequest>,
            IMemberProfileArchive,
            Error,
            TMemberProfileArchiveFormValues
        > {}

const UpdateMemberProfileArchiveForm = ({
    className,
    ...formProps
}: IMemberProfileArchiveFormProps) => {
    const form = useForm<TMemberProfileArchiveFormValues>({
        resolver: standardSchemaResolver(MemberProfileArchiveSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            category: '',
            ...formProps.defaultValues,
        },
    })

    const updateMutation = useUpdateMemberProfileArchiveById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Member profile archive updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberProfileArchiveFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        updateMutation.mutate({
            id: formData.id,
            payload: formData,
        })
    }, handleFocusError)

    const { error: errorResponse, isPending, reset } = updateMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

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
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Category"
                            name="category"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Category"
                                />
                            )}
                        />
                        <MemberArchiveItem
                            memberArchive={
                                form.getValues() as IMemberProfileArchive
                            }
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Description"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Update"
                />
            </form>
        </Form>
    )
}

export const UpdateMemberProfileArchiveFormModal = ({
    title = 'Update Member Profile Archive',
    description = 'Fill out the form to update the member profile archive.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberProfileArchiveFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <UpdateMemberProfileArchiveForm
                {...formProps}
                onSuccess={(updatedData) => {
                    formProps?.onSuccess?.(updatedData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default UpdateMemberProfileArchiveForm
