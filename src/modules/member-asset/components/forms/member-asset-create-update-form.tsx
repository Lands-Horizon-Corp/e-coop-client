import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IMedia } from '@/modules/media'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { MemberAssetSchema } from '../../member-asset-validation'
import {
    useCreateMemberProfileAsset,
    useUpdateMemberProfileAsset,
} from '../../member-asset.service'
import { IMemberAsset } from '../../member-asset.types'

type TMemberAssetFormValues = z.infer<typeof MemberAssetSchema>

export interface IMemberAssetFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberAsset>,
            IMemberAsset,
            Error,
            TMemberAssetFormValues
        > {
    memberProfileId: TEntityId
    assetId?: TEntityId
}

const MemberAssetCreateUpdateForm = ({
    memberProfileId,
    assetId,
    className,
    ...formProps
}: IMemberAssetFormProps) => {
    const form = useForm<TMemberAssetFormValues>({
        resolver: standardSchemaResolver(MemberAssetSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            member_profile_id: memberProfileId,
            ...formProps.defaultValues,
            entry_date: toInputDateString(
                formProps.defaultValues?.entry_date ?? new Date()
            ),
        },
    })

    const createMutation = useCreateMemberProfileAsset({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateMemberProfileAsset({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberAssetFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (assetId) {
            updateMutation.mutate({
                memberProfileId,
                assetId,
                data: formData,
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: formData,
            })
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = assetId ? updateMutation : createMutation

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
                            label="Asset Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Asset Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid grid-cols-2 gap-x-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="cost"
                                label="Asset Cost *"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="number"
                                        placeholder="Cost"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="entry_date"
                                label="Entry Date *"
                                className="relative"
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        placeholder="Entry Date"
                                        className="block [&::-webkit-calendar-picker-indicator]:hidden"
                                        value={field.value ?? ''}
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Asset Description *"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Asset Description..."
                                    textEditorClassName="bg-background !max-w-none"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="media_id"
                            label="Asset Photo"
                            render={({ field }) => {
                                const value = form.watch('media')

                                return (
                                    <ImageField
                                        {...field}
                                        placeholder="Upload Asset Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue('media', newImage)
                                        }}
                                    />
                                )
                            }}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={assetId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const MemberAssetCreateUpdateFormModal = ({
    title = 'Create Asset',
    description = 'Fill out the form to add or update asset.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberAssetFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberAssetCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberAssetCreateUpdateForm
