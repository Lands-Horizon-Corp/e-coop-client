import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import MediaUploader from '@/modules/media/components/media-uploader'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useMemberProfileArchiveBulk } from '../../member-profile-archive.service'
import { IMemberProfileArchiveBulkRequest } from '../../member-profile-archive.types'
import { MemberProfileArchiveBulkUpdateSchema } from '../../member-profile-archive.validation'
import MemberProfileArchiveCategoryCombobox from '../member-profile-archive-category-combobox'

type TMemberProfileArchiveUploadFormValues = z.infer<
    typeof MemberProfileArchiveBulkUpdateSchema
>

export interface IMemberProfileArchiveUploadFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberProfileArchiveBulkRequest>,
            unknown,
            Error,
            TMemberProfileArchiveUploadFormValues
        > {
    error?: Error | null
    memberProfileId: string
}

const MemberProfileArchiveUploadForm = ({
    className,
    memberProfileId,
    ...formProps
}: IMemberProfileArchiveUploadFormProps) => {
    const [uploaderState, setUploaderState] = useState(false)
    const form = useForm<TMemberProfileArchiveUploadFormValues>({
        resolver: standardSchemaResolver(MemberProfileArchiveBulkUpdateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            category: '',
            ids: [],
            ...formProps.defaultValues,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberProfileArchiveUploadFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const { mutateAsync: bulkUploadArchiveForMemberProfile, isPending } =
        useMemberProfileArchiveBulk({
            options: {
                onSuccess: formProps.onSuccess,
            },
        })

    const handleSubmit = (data: IMemberProfileArchiveBulkRequest) => {
        toast.promise(
            bulkUploadArchiveForMemberProfile({
                memberProfileId,
                payload: data,
            }),
            {
                loading: 'Uploading member profile archives...',
                success: 'Member profile archives uploaded successfully',
                error: (err) =>
                    `Error uploading member profile archives: ${serverRequestErrExtractor(
                        { error: err }
                    )}`,
            }
        )
    }

    const onSubmit = form.handleSubmit(
        (formData) => handleSubmit(formData),
        handleFocusError
    )

    const error = serverRequestErrExtractor({ error: formProps.error || null })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly || uploaderState}
                >
                    <fieldset className="space-y-3">
                        <div className="flex gap-x-2">
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
                                        placeholder="Enter category (optional)"
                                    />
                                )}
                            />
                            <MemberProfileArchiveCategoryCombobox
                                chevronOnly
                                className="w-fit mt-6"
                                memberProfileId={memberProfileId}
                                onChange={(suggestedCategory) => {
                                    form.setValue(
                                        'category',
                                        suggestedCategory || '',
                                        { shouldDirty: true }
                                    )
                                }}
                                placeholder="Select suggested category"
                            />
                        </div>
                        <MediaUploader
                            mode="multiple"
                            onMultipleUploadComplete={(uploadedFiles) => {
                                form.setValue(
                                    'ids',
                                    uploadedFiles.map((files) => files.id),
                                    { shouldDirty: true }
                                )
                                formRef.current?.requestSubmit()
                            }}
                            onUploadStateChange={setUploaderState}
                        />
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                    }}
                    readOnly={formProps.readOnly || uploaderState}
                    submitText="Upload"
                />
            </form>
        </Form>
    )
}

export const MemberProfileArchiveUploadFormModal = ({
    title = 'Upload Member Profile Archive',
    description = 'Upload files and optionally set a category.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberProfileArchiveUploadFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-2xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberProfileArchiveUploadForm
                {...formProps}
                className="min-w-0 max-w-full bg-card p-4 rounded-xl"
                onSubmit={(data) => {
                    formProps?.onSubmit?.(data)
                }}
            />
        </Modal>
    )
}

export default MemberProfileArchiveUploadForm
