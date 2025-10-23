import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { base64ImagetoFile } from '@/helpers/picture-crop-helper'
import { cn } from '@/helpers/tw-utils'
import { useUploadMedia } from '@/modules/media'
import { IMedia } from '@/modules/media/media.types'
import {
    EditOrganizationSchema,
    IOrganizationRequest,
    TEditOrganizationFormValues,
    useUpdateOrganization,
} from '@/modules/organization'

import { VerifiedPatchIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useLocationInfo } from '@/hooks/use-location-info'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface IEditOrganizationFormProps
    extends IClassProps,
        IForm<
            Partial<IOrganizationRequest>,
            IOrganizationRequest,
            string,
            TEditOrganizationFormValues
        > {
    organizationId?: TEntityId
    coverMedia?: IMedia
    media?: IMedia
}

const UpdateOrganizationForm = ({
    organizationId,
    className,
    coverMedia,
    media,
    ...formProps
}: IEditOrganizationFormProps) => {
    const { countryCode } = useLocationInfo()
    const [selectedLogoMedia, setSelectedLogoMedia] = useState<string>(
        media?.url || ''
    )

    const [selectedCoverMedia, setSelectedCoverMedia] = useState<string>(
        coverMedia?.url || ''
    )

    const form = useForm<TEditOrganizationFormValues>({
        resolver: standardSchemaResolver(EditOrganizationSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...formProps.defaultValues,
            cover_media_id: coverMedia?.id,
            media_id: media?.id,
        },
    })
    const {
        mutate: updateMutation,
        error,
        isPending,
        reset,
    } = useUpdateOrganization({
        options: {
            onSuccess: (data) => {
                formProps.onSuccess?.(data)
                form.reset()
                toast.success(`Successfully updated ${data.name} organization`)
                setSelectedLogoMedia('')
                setSelectedCoverMedia('')
            },
        },
    })

    const { isPending: isUploadingPhoto, mutateAsync: uploadPhoto } =
        useUploadMedia()

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TEditOrganizationFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const handleUploadPhoto = async (media: string) => {
        const file = base64ImagetoFile(media, `media.jpg`) as File
        const uploadedPhoto = await uploadPhoto({ file })
        return uploadedPhoto.id
    }

    const onSubmit = form.handleSubmit(async (data) => {
        let logoMedia = ''
        let CoverMedia = ''
        if (
            selectedLogoMedia &&
            selectedLogoMedia.startsWith('data:') &&
            data.media_id
        ) {
            const uploadedPhoto = await handleUploadPhoto(selectedLogoMedia)
            logoMedia = uploadedPhoto
        } else {
            logoMedia = data.media_id || ''
        }
        if (
            selectedCoverMedia &&
            selectedCoverMedia.startsWith('data:') &&
            data.cover_media_id
        ) {
            const uploadedCoverPhoto =
                await handleUploadPhoto(selectedCoverMedia)
            CoverMedia = uploadedCoverPhoto
        } else {
            CoverMedia = data.cover_media_id || ''
        }

        const requestData = {
            ...data,
            media_id: logoMedia ?? data.media_id,
            cover_media_id: CoverMedia ?? data.cover_media_id,
        }
        if (organizationId) {
            updateMutation({ id: organizationId, payload: requestData })
        }
    }, handleFocusError)

    const errorMessage = serverRequestErrExtractor({ error })
    return (
        <Form {...form}>
            <form
                className={cn('w-full min-w-[50vw] space-y-5 px-5', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="col-span-full flex flex-col sm:flex-row gap-4 w-full">
                        <FormFieldWrapper
                            className="flex-1"
                            control={form.control}
                            label="Organization Photo"
                            name="media_id"
                            render={({ field }) => {
                                const value = form.watch('media')
                                return (
                                    <ImageField
                                        {...field}
                                        className="w-full"
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue('media', newImage)
                                        }}
                                        placeholder="Upload Organization Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                    />
                                )
                            }}
                        />
                        <FormFieldWrapper
                            className="flex-1"
                            control={form.control}
                            label="Organization Cover Photo"
                            name="cover_media_id"
                            render={({ field }) => {
                                const value = form.watch('cover_media')
                                return (
                                    <ImageField
                                        {...field}
                                        className="w-full"
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue(
                                                'cover_media',
                                                newImage
                                            )
                                        }}
                                        placeholder="Upload Organization Cover Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                    />
                                )
                            }}
                        />
                    </div>
                    <FormFieldWrapper
                        className="col-span-full sm:col-span-2 lg:col-span-3"
                        control={form.control}
                        label="Organization Name"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="org-name"
                                id={field.name}
                                placeholder="enter organization name"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className="col-span-full sm:col-span-2 lg:col-span-1"
                        control={form.control}
                        label="Organization Email"
                        name="email"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="organization email"
                                id={field.name}
                                placeholder="enter email"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className="col-span-full sm:col-span-1 lg:col-span-2"
                        control={form.control}
                        label="Organization Contact Number"
                        name="contact_number"
                        render={({ field, fieldState: { invalid, error } }) => (
                            <div className="relative flex flex-1 items-center gap-x-2">
                                <VerifiedPatchIcon
                                    className={cn(
                                        'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                        (invalid || error) && 'text-destructive'
                                    )}
                                />
                                <PhoneInput
                                    {...field}
                                    className="w-full"
                                    defaultCountry={countryCode}
                                />
                            </div>
                        )}
                    />
                    <FormFieldWrapper
                        className="col-span-full sm:col-span-1 lg:col-span-2"
                        control={form.control}
                        label="Organization Address"
                        name="address"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="organization address"
                                id={field.name}
                                placeholder="enter organization address"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className="col-span-full "
                        control={form.control}
                        label="Organization Description"
                        name="description"
                        render={({ field }) => {
                            const { ref: _ref, ...rest } = field
                            return (
                                <FormControl>
                                    <TextEditor
                                        {...rest}
                                        className="w-full"
                                        content={field.value || ''}
                                        placeholder="Write some description about your Organization..."
                                        textEditorClassName="!max-w-none !h-full"
                                    />
                                </FormControl>
                            )
                        }}
                    />
                </div>
                <div className="w-full pt-5 flex flex-col gap-y-5">
                    <Tabs className="w-full" defaultValue="privacy_policy">
                        <TabsList className="sticky top-[0%] w-full z-50 backdrop-blur-2xl backdrop h-auto min-w-fit justify-start gap-2 rounded-none border-b bg-background/50 px-0 py-1 text-foreground">
                            {[
                                'privacy_policy',
                                'cookie_policy',
                                'refund_policy',
                                'terms_and_conditions',
                                'user_agreement',
                            ].map((policyType) => (
                                <TabsTrigger
                                    className="relative flex items-center gap-x-2 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    key={policyType}
                                    value={policyType}
                                >
                                    {policyType.replace(/_/g, ' ')}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value="terms_and_conditions">
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                name="terms_and_conditions"
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                className="w-full "
                                                content={field.value || ''}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                isAllowedHorizontalRule
                                                isHeadingDisabled={false}
                                                placeholder="Write your terms and conditions..."
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        </TabsContent>
                        <TabsContent value="privacy_policy">
                            <FormFieldWrapper
                                className="col-span-4"
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                name="privacy_policy"
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                className="w-full "
                                                content={field.value || ''}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                isAllowedHorizontalRule
                                                isHeadingDisabled={false}
                                                placeholder="Write your privacy policy..."
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        </TabsContent>
                        <TabsContent value="refund_policy">
                            <FormFieldWrapper
                                className="col-span-4"
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                name="refund_policy"
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                className="w-full "
                                                content={field.value || ''}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                isAllowedHorizontalRule
                                                isHeadingDisabled={false}
                                                placeholder="Write your refund policy..."
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        </TabsContent>
                        <TabsContent value="cookie_policy">
                            <FormFieldWrapper
                                className="col-span-4"
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                name="cookie_policy"
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                className="w-full"
                                                content={field.value || ''}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                isAllowedHorizontalRule
                                                isHeadingDisabled={false}
                                                placeholder="Write your cookie policy..."
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        </TabsContent>
                        <TabsContent value="user_agreement">
                            <FormFieldWrapper
                                className="col-span-4"
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                name="user_agreement"
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                className="w-full "
                                                content={field.value || ''}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                isAllowedHorizontalRule
                                                isHeadingDisabled={false}
                                                placeholder="Write your user agreement..."
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        </TabsContent>
                    </Tabs>
                    <div className="space-y-2">
                        <FormErrorMessage errorMessage={errorMessage} />
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                className="w-full self-end px-8 sm:w-fit"
                                disabled={isPending || formProps.readOnly}
                                onClick={() => {
                                    form.reset()
                                    reset()
                                }}
                                size="sm"
                                type="button"
                                variant="ghost"
                            >
                                Reset
                            </Button>
                            <Button
                                className="w-full self-end px-8 sm:w-fit"
                                disabled={
                                    isPending ||
                                    isUploadingPhoto ||
                                    !form.formState.isDirty ||
                                    formProps.readOnly
                                }
                                size="sm"
                                type="submit"
                            >
                                {isPending ? (
                                    <LoadingSpinner />
                                ) : organizationId ? (
                                    'Update'
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const UpdateOrganizationFormModal = ({
    title = 'Edit Organization',
    description = 'Fill out the form to edit the organization.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IEditOrganizationFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <UpdateOrganizationForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default UpdateOrganizationFormModal
