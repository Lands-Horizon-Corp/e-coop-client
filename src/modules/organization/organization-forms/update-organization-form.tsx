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
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('w-full min-w-[50vw] space-y-5 px-5', className)}
            >
                <div className="w-full col-span-2 flex flex-col gap-y-2">
                    <FormFieldWrapper
                        control={form.control}
                        label="Organization Photo"
                        name="media_id"
                        className="col-span-4"
                        hiddenFields={formProps.hiddenFields}
                        render={({ field }) => {
                            return (
                                <FormControl>
                                    <div className="relative mx-auto size-fit">
                                        <SinglePictureUploadModal
                                            open={openImagePicker}
                                            onOpenChange={setOpenImagePicker}
                                            onPhotoChoose={(newImage) => {
                                                field.onChange(newImage)
                                                setSelectedLogoMedia(newImage)
                                            }}
                                            defaultImage={selectedLogoMedia}
                                            title="Choose Organization Logo"
                                        />
                                        <ImageDisplay
                                            className="size-36 rounded-lg"
                                            src={selectedLogoMedia}
                                        />
                                        <ActionTooltip
                                            tooltipContent={
                                                field.value
                                                    ? 'Replace'
                                                    : 'Insert'
                                            }
                                            align="center"
                                            side="right"
                                        >
                                            <Button
                                                variant="secondary"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setOpenImagePicker(true)
                                                }}
                                                className="absolute bottom-2 right-2  size-fit  rounded-full border border-transparent p-2"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
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
                        name="cover_media_id"
                        label="Banner Background"
                        hiddenFields={formProps.hiddenFields}
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
                                                style={{
                                                    opacity: hasNoImageSelected
                                                        ? 0.1
                                                        : 1,
                                                }}
                                                className="size-24 rounded-lg"
                                                src={selectedLogoMedia}
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
                                            maxFiles={1}
                                            buttonOnly
                                            accept={{
                                                'image/png': ['.png'],
                                                'image/jpeg': ['.jpg', '.jpeg'],
                                            }}
                                            selectedPhotos={(selectedPhoto) => {
                                                field.onChange(selectedPhoto)
                                                setSelectedCoverMedia(
                                                    selectedPhoto
                                                )
                                            }}
                                            disabled={isDisabled(field.name)}
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
                            name="name"
                            label="Organization Name"
                            hiddenFields={formProps.hiddenFields}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    autoComplete="org-name"
                                    placeholder="enter organization name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="contact_number"
                            label="Organization Contact Number"
                            className="col-span-2"
                            hiddenFields={formProps.hiddenFields}
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
                            control={form.control}
                            name="address"
                            label="Organization Address"
                            className="col-span-2"
                            hiddenFields={formProps.hiddenFields}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    autoComplete="organization address"
                                    placeholder="enter organization address"
                                    className=""
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="is_private"
                            hiddenFields={formProps.hiddenFields}
                            render={({ field }) => {
                                return (
                                    <GradientBackground gradientOnly>
                                        <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                            <Checkbox
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                name={field.name}
                                                className="order-1 after:absolute after:inset-0"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
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
                            control={form.control}
                            label="Organization Description"
                            name="description"
                            className="col-span-4"
                            hiddenFields={formProps.hiddenFields}
                            render={({ field }) => {
                                const { ref: _ref, ...rest } = field
                                return (
                                    <FormControl>
                                        <TextEditor
                                            {...rest}
                                            toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                            content={field.value || ''}
                                            className="w-full "
                                            textEditorClassName=" !max-w-none"
                                            placeholder="Write some description about your Organization..."
                                            disabled={isDisabled(field.name)}
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
                    <Tabs defaultValue="privacy_policy" className="w-full">
                        <TabsList className="bg-transparent flex flex-wrap justify-start gap-2">
                            {[
                                'privacy_policy',
                                'cookie_policy',
                                'refund_policy',
                                'terms_and_conditions',
                                'user_agreement',
                            ].map((policyType) => (
                                <TabsTrigger
                                    key={policyType}
                                    value={policyType}
                                    className="capitalize"
                                >
                                    {policyType.replace(/_/g, ' ')}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value="terms_and_conditions">
                            <FormFieldWrapper
                                control={form.control}
                                name="terms_and_conditions"
                                hiddenFields={formProps.hiddenFields}
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                isHeadingDisabled={false}
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                                content={field.value || ''}
                                                className="w-full "
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                placeholder="Write your terms and conditions..."
                                                isAllowedHorizontalRule
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        </TabsContent>
                        <TabsContent value="privacy_policy">
                            <FormFieldWrapper
                                control={form.control}
                                name="privacy_policy"
                                className="col-span-4"
                                hiddenFields={formProps.hiddenFields}
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                isHeadingDisabled={false}
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                                content={field.value || ''}
                                                className="w-full "
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                placeholder="Write your privacy policy..."
                                                isAllowedHorizontalRule
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        </TabsContent>
                        <TabsContent value="refund_policy">
                            <FormFieldWrapper
                                control={form.control}
                                name="refund_policy"
                                className="col-span-4"
                                hiddenFields={formProps.hiddenFields}
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                isHeadingDisabled={false}
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                                content={field.value || ''}
                                                className="w-full "
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                placeholder="Write your refund policy..."
                                                isAllowedHorizontalRule
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        </TabsContent>
                        <TabsContent value="cookie_policy">
                            <FormFieldWrapper
                                control={form.control}
                                name="cookie_policy"
                                className="col-span-4"
                                hiddenFields={formProps.hiddenFields}
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                isHeadingDisabled={false}
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                                content={field.value || ''}
                                                className="w-full"
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                placeholder="Write your cookie policy..."
                                                isAllowedHorizontalRule
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                        </TabsContent>
                        <TabsContent value="user_agreement">
                            <FormFieldWrapper
                                control={form.control}
                                name="user_agreement"
                                className="col-span-4"
                                hiddenFields={formProps.hiddenFields}
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                isHeadingDisabled={false}
                                                toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                                content={field.value || ''}
                                                className="w-full "
                                                textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                                placeholder="Write your user agreement..."
                                                isAllowedHorizontalRule
                                                disabled={isDisabled(
                                                    field.name
                                                )}
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
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    form.reset()
                                    reset()
                                }}
                                className="w-full self-end px-8 sm:w-fit"
                                disabled={isPending || formProps.readOnly}
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                disabled={
                                    isPending ||
                                    isUploadingPhoto ||
                                    !form.formState.isDirty ||
                                    formProps.readOnly
                                }
                                className="w-full self-end px-8 sm:w-fit"
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
            title={title}
            description={description}
            className={cn(' max-w-[80rem]', className)}
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
