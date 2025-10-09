import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { base64ImagetoFile } from '@/helpers/picture-crop-helper'
import { cn } from '@/helpers/tw-utils'
import { useUploadMedia } from '@/modules/media'
import { IMedia } from '@/modules/media/media.types'
import {
    EditOrganizationSchema,
    IOrganizationRequest,
    useUpdateOrganization,
} from '@/modules/organization'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    BuildingBranchIcon,
    PlusIcon,
    ReplaceIcon,
    VerifiedPatchIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import { SinglePictureUploadModal } from '@/components/single-image-uploader/single-picture-uploader'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextEditor from '@/components/text-editor'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import FileUploader from '@/components/ui/file-uploader'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlainTextEditor } from '@/components/ui/text-editor'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useLocationInfo } from '@/hooks/use-location-info'

import { IClassProps, IForm, TEntityId } from '@/types'

type TEditOrganizationFormValues = z.infer<typeof EditOrganizationSchema>

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
    const [openImagePicker, setOpenImagePicker] = useState(false)

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
                setOpenImagePicker(false)
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

    const HeaderTitleDisplay =
        form.watch('name') === ''
            ? 'Sample Organization Title'
            : form.watch('name')

    const DescriptionDisplay =
        form.watch('description') === ''
            ? 'This is sample description for your banner'
            : form.watch('description')

    const errorMessage = serverRequestErrExtractor({ error })

    return (
        <Form {...form}>
            <form
                className={cn('w-full min-w-[50vw] space-y-5 px-5', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="w-full col-span-2 flex flex-col gap-y-2">
                    <FormFieldWrapper
                        className="col-span-4"
                        control={form.control}
                        hiddenFields={formProps.hiddenFields}
                        label="Organization Photo"
                        name="media_id"
                        render={({ field }) => {
                            return (
                                <FormControl>
                                    <div className="relative mx-auto size-fit">
                                        <SinglePictureUploadModal
                                            defaultImage={selectedLogoMedia}
                                            onOpenChange={setOpenImagePicker}
                                            onPhotoChoose={(newImage) => {
                                                field.onChange(newImage)
                                                setSelectedLogoMedia(newImage)
                                            }}
                                            open={openImagePicker}
                                            title="Choose Organization Logo"
                                        />
                                        <ImageDisplay
                                            className="size-36 rounded-lg"
                                            src={selectedLogoMedia}
                                        />
                                        <ActionTooltip
                                            align="center"
                                            side="right"
                                            tooltipContent={
                                                field.value
                                                    ? 'Replace'
                                                    : 'Insert'
                                            }
                                        >
                                            <Button
                                                className="absolute bottom-2 right-2  size-fit  rounded-full border border-transparent p-2"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setOpenImagePicker(true)
                                                }}
                                                variant="secondary"
                                            >
                                                {field.value ? (
                                                    <ReplaceIcon size={20} />
                                                ) : (
                                                    <PlusIcon />
                                                )}
                                            </Button>
                                        </ActionTooltip>
                                    </div>
                                </FormControl>
                            )
                        }}
                    />
                    <FormFieldWrapper
                        className="md:col-span-4"
                        control={form.control}
                        hiddenFields={formProps.hiddenFields}
                        label="Banner Background"
                        name="cover_media_id"
                        render={({ field }) => {
                            const hasNoImageSelected =
                                form.watch('media_id') === ''
                            return (
                                <div>
                                    <GradientBackground
                                        className="w-full"
                                        mediaUrl={
                                            selectedCoverMedia || field.value
                                        }
                                    >
                                        <div className="flex min-h-32 cursor-pointer items-center justify-between gap-x-2 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                                            <ImageDisplay
                                                className="size-24 rounded-lg"
                                                src={selectedLogoMedia}
                                                style={{
                                                    opacity: hasNoImageSelected
                                                        ? 0.1
                                                        : 1,
                                                }}
                                            />

                                            <div className="flex grow flex-col">
                                                <p className="touch-pan-up text-start text-2xl font-bold">
                                                    {HeaderTitleDisplay}
                                                </p>
                                                <PlainTextEditor
                                                    className="overflow max-h-7 min-w-96 max-w-[30rem] overflow-y-hidden"
                                                    content={DescriptionDisplay}
                                                />
                                            </div>
                                        </div>
                                    </GradientBackground>
                                    <div className="flex w-full justify-end py-2">
                                        <FileUploader
                                            accept={{
                                                'image/png': ['.png'],
                                                'image/jpeg': ['.jpg', '.jpeg'],
                                            }}
                                            buttonOnly
                                            disabled={isDisabled(field.name)}
                                            maxFiles={1}
                                            selectedPhotos={(selectedPhoto) => {
                                                field.onChange(selectedPhoto)
                                                setSelectedCoverMedia(
                                                    selectedPhoto
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    <div className="flex flex-col gap-y-2 w-full">
                        <FormFieldWrapper
                            control={form.control}
                            hiddenFields={formProps.hiddenFields}
                            label="Organization Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="org-name"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="enter organization name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            hiddenFields={formProps.hiddenFields}
                            label="Organization Contact Number"
                            name="contact_number"
                            render={({
                                field,
                                fieldState: { invalid, error },
                            }) => (
                                <div className="relative flex flex-1 items-center gap-x-2">
                                    <VerifiedPatchIcon
                                        className={cn(
                                            'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                            (invalid || error) &&
                                                'text-destructive'
                                        )}
                                    />
                                    <PhoneInput
                                        {...field}
                                        className="w-full"
                                        defaultCountry={countryCode}
                                        disabled={isDisabled(field.name)}
                                    />
                                </div>
                            )}
                        />
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            hiddenFields={formProps.hiddenFields}
                            label="Organization Address"
                            name="address"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="organization address"
                                    className=""
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="enter organization address"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            hiddenFields={formProps.hiddenFields}
                            name="is_private"
                            render={({ field }) => {
                                return (
                                    <GradientBackground gradientOnly>
                                        <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                            <Checkbox
                                                checked={field.value}
                                                className="order-1 after:absolute after:inset-0"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                id={field.name}
                                                name={field.name}
                                                onCheckedChange={field.onChange}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="size-fit rounded-sm bg-secondary p-2">
                                                    <BuildingBranchIcon />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor={field.name}>
                                                        Make this Organization
                                                        Private
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </GradientBackground>
                                )
                            }}
                        />
                    </div>
                    <div className=" flex flex-col gap-y-2 w-full">
                        <FormFieldWrapper
                            className="col-span-4"
                            control={form.control}
                            hiddenFields={formProps.hiddenFields}
                            label="Organization Description"
                            name="description"
                            render={({ field }) => {
                                const { ref: _ref, ...rest } = field
                                return (
                                    <FormControl>
                                        <TextEditor
                                            {...rest}
                                            className="w-full "
                                            content={field.value || ''}
                                            disabled={isDisabled(field.name)}
                                            placeholder="Write some description about your Organization..."
                                            textEditorClassName=" !max-w-none"
                                            toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                        />
                                    </FormControl>
                                )
                            }}
                        />
                    </div>
                </div>
                <Separator />
                <div className="w-full flex flex-col gap-y-5">
                    <div className="my-5">
                        <h2 className="text-2xl font-semibold">
                            {' '}
                            Add Policies
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            This Policies will only apply to this organization.
                        </p>
                    </div>
                    <Tabs className="w-full" defaultValue="privacy_policy">
                        <TabsList className="bg-transparent flex flex-wrap justify-start gap-2">
                            {[
                                'privacy_policy',
                                'cookie_policy',
                                'refund_policy',
                                'terms_and_conditions',
                                'user_agreement',
                            ].map((policyType) => (
                                <TabsTrigger
                                    className="capitalize"
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
            className={cn(' max-w-[80rem]', className)}
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
