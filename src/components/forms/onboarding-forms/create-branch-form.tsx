import ActionTooltip from '@/components/action-tooltip'
import { PhoneInput } from '@/components/contact-input/contact-input'
import Modal, { IModalProps } from '@/components/modals/modal'
import { SinglePictureUploadModal } from '@/components/single-image-uploader/single-picture-uploader'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import TextEditor from '@/components/text-editor'
import MapPicker from '@/components/map-picker'
import { CountryCombobox } from '@/components/comboboxes/country-combobox'

import {
    HouseIcon,
    LoadingSpinnerIcon,
    PlusIcon,
    ReplaceIcon,
} from '@/components/icons'

import {
    IBranch,
    IBranchRequest,
    IClassProps,
    IForm,
    IMedia,
    TEntityId,
} from '@/types'
import { useCreateBranch, useUpdateBranch } from '@/hooks/api-hooks/use-branch'
import { useSinglePictureUpload } from '@/hooks/api-hooks/use-media'
import { branchRequestSchema } from '@/validations/form-validation/branch/create-branch-schema'
import { base64ImagetoFile } from '@/helpers'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LatLngLiteral } from 'leaflet'
import { cn } from '@/lib'
import ImageDisplay from '@/components/image-display'

type ICreateBranchSchema = z.infer<typeof branchRequestSchema>

export interface ICreateBranchFormProps
    extends IClassProps,
        IForm<Partial<IBranchRequest>, IBranch, string>,
        IModalProps {
    branchId?: TEntityId
    useOrganizationId?: TEntityId
}

export const CreateUpdateBranchForm = ({
    branchId,
    defaultValues,
    useOrganizationId,
    onSuccess,
    onError,
}: ICreateBranchFormProps) => {
    const [openImagePicker, setOpenImagePicker] = useState(false)
    const [onOpenMap, setOnOpenMapPicker] = useState(false)

    const form = useForm<ICreateBranchSchema>({
        resolver: zodResolver(branchRequestSchema),
        defaultValues: {
            ...defaultValues,
        },
    })

    const {
        mutate: createBranch,
        isPending: isPedingCreateBranch,
        error,
    } = useCreateBranch(
        {
            onSuccess: (data) => {
                toast.success('Branch created successfully')
                form.reset()
                onSuccess?.(data)
            },
            onError: (err) => {
                toast.error(<>{err}</>)
                onError?.(err)
            },
        },
        useOrganizationId as TEntityId
    )

    const { mutate: updateBranch, isPending: isLoadingUpdateBranch } =
        useUpdateBranch({
            onSuccess: (data) => {
                toast.success('Update Branch successfully')
                form.reset()
                onSuccess?.(data)
            },
            onError: (err) => {
                toast.error(<>{err}</>)
                onError?.(err)
            },
        })

    const { isPending: isUploadingPhoto, mutateAsync: uploadPhoto } =
        useSinglePictureUpload({})

    const handleUploadPhoto = async (mediaId: TEntityId): Promise<string> => {
        const uploadedMedia = await uploadPhoto(
            base64ImagetoFile(mediaId, `bg-banner.jpg`) as File
        )
        return uploadedMedia.id
    }

    const handleSubmit = async (data: ICreateBranchSchema) => {
        if (useOrganizationId) {
            if (branchId) {
                const isMediaFromDB =
                    data.media.download_url?.startsWith('http')
                const media = isMediaFromDB
                    ? data.media.id
                    : await handleUploadPhoto(data.media.download_url ?? '')
                const request = { ...data, media_id: media }
                updateBranch({ id: branchId, data: request })
            } else {
                const mediaId = await handleUploadPhoto(data.media_id ?? '')
                const request = { ...data, media_id: mediaId }
                createBranch(request)
            }
        } else {
            console.error('Organization ID is missing.')
        }
    }

    const isBranchOnChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(defaultValues)

    const isLoading =
        isPedingCreateBranch || isLoadingUpdateBranch || isUploadingPhoto

    const combinedError = error
    return (
        <div className="mt-10">
            <MapPicker
                open={onOpenMap}
                mapProps={{
                    hideControls: true,
                }}
                onOpenChange={setOnOpenMapPicker}
                onChange={(coordinates) => {
                    const { lat, lng }: LatLngLiteral = coordinates
                    form.setValue('latitude', lat)
                    form.setValue('longitude', lng)
                }}
            />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full"
                >
                    <div className="flex w-full gap-x-5">
                        <div className="grid w-1/2 grow grid-cols-2 gap-5">
                            <FormFieldWrapper
                                control={form.control}
                                name="name"
                                label="Branch Name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter branch name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="email"
                                label="Branch Email"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter email"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="type"
                                label="Branch Type"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter branch type"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="contact_number"
                                label="Contact Number"
                                render={({ field }) => (
                                    <PhoneInput
                                        {...field}
                                        className="w-full"
                                        disabled={isLoading}
                                        defaultCountry="PH"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="address"
                                label="Address"
                                className="grow"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter address"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="province"
                                label="Province"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter province"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="city"
                                label="City"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter city"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="barangay"
                                label="Barangay"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter barangay"
                                    />
                                )}
                            />
                            <div className="col-span-2 grid grid-cols-3 gap-x-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="region"
                                    label="Region"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="Enter region"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="postal_code"
                                    label="Postal Code"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="Enter postal code"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="country_code"
                                    label="Country Code"
                                    render={({ field }) => (
                                        <CountryCombobox
                                            {...field}
                                            defaultValue={field.value}
                                            disabled={isLoading}
                                            onChange={(country) =>
                                                field.onChange(country.alpha2)
                                            }
                                        />
                                    )}
                                />
                            </div>
                            <FormFieldWrapper
                                control={form.control}
                                name="is_main_branch"
                                label="Set as Main Branch"
                                className="col-span-2"
                                render={({ field }) => {
                                    return (
                                        <GradientBackground gradientOnly>
                                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                <Checkbox
                                                    id={field.name}
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    disabled={isLoading}
                                                    name={field.name}
                                                    className="order-1 after:absolute after:inset-0"
                                                    aria-describedby={`${field.name}`}
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="size-fit rounded-full bg-secondary p-2">
                                                        <HouseIcon />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={field.name}
                                                        >
                                                            Set as Main Branch
                                                        </Label>
                                                        <p
                                                            id={`${field.name}`}
                                                            className="text-xs text-muted-foreground"
                                                        >
                                                            This will designate
                                                            the branch as the
                                                            primary or
                                                            headquarters
                                                            location for the
                                                            organization.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </GradientBackground>
                                    )
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FormFieldWrapper
                                control={form.control}
                                label="Branch Logo"
                                name="media_id"
                                className="col-span-4"
                                render={({ field }) => {
                                    const media = form.getValues(
                                        'media'
                                    ) as IMedia

                                    return (
                                        <FormControl>
                                            <div className="relative mx-auto size-fit">
                                                <SinglePictureUploadModal
                                                    open={openImagePicker}
                                                    onOpenChange={
                                                        setOpenImagePicker
                                                    }
                                                    onPhotoChoose={(
                                                        newImage
                                                    ) => {
                                                        form.setValue('media', {
                                                            download_url:
                                                                newImage,
                                                        })
                                                    }}
                                                    defaultImage={
                                                        media.download_url ?? ''
                                                    }
                                                />

                                                <ImageDisplay
                                                    fallbackClassName="!text-3xl"
                                                    src={
                                                        media.download_url ?? ''
                                                    }
                                                    className="size-48"
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
                                                        disabled={isLoading}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setOpenImagePicker(
                                                                true
                                                            )
                                                        }}
                                                        className="absolute bottom-2 right-2 size-fit w-fit rounded-full border border-transparent p-1"
                                                    >
                                                        {field.value ? (
                                                            <ReplaceIcon />
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
                                control={form.control}
                                label="Branch Description"
                                name="description"
                                className="col-span-4"
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <>
                                                <TextEditor
                                                    {...rest}
                                                    content={field.value ?? ''}
                                                    className={`relative w-full after:absolute after:top-0 after:size-full after:rounded-lg after:bg-background/20 after:content-[''] ${isLoading ? 'cursor-not-allowed after:block after:blur-sm' : 'after:hidden'}`}
                                                    textEditorClassName="!h-32"
                                                    placeholder="Write some description about your branch..."
                                                />
                                            </>
                                        </FormControl>
                                    )
                                }}
                            />
                            <div className="flex gap-x-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Latitude"
                                    name="latitude"
                                    className="grow"
                                    render={({ field }) => (
                                        <div className="flex grow flex-col gap-y-2">
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={isLoading}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                                placeholder="latitude"
                                            />
                                        </div>
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Longitude"
                                    name="longitude"
                                    className="grow"
                                    render={({ field }) => (
                                        <div className="flex grow flex-col gap-y-2">
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={isLoading}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                                placeholder="Longitude"
                                            />
                                        </div>
                                    )}
                                />
                                <div className="flex -translate-y-2 flex-col justify-center">
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setOnOpenMapPicker(true)
                                        }}
                                        disabled={isLoading}
                                        className="translate-y-2.5"
                                        variant={'ghost'}
                                    >
                                        <PlusIcon className="mr-2" />
                                        Coordinates
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FormErrorMessage
                        className="my-5 w-full"
                        errorMessage={combinedError}
                    />
                    <div className="mt-5 flex justify-end gap-x-2">
                        <Button
                            variant={'secondary'}
                            disabled={isLoading}
                            onClick={(e) => {
                                e.preventDefault()
                                form.reset()
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !isBranchOnChanged}
                            className=""
                        >
                            {isLoading ? (
                                <div className="flex space-x-2">
                                    {branchId ? 'updating ' : 'Creating '}{' '}
                                    <LoadingSpinnerIcon
                                        size={18}
                                        className="mr-2 animate-spin"
                                    />
                                </div>
                            ) : (
                                `${branchId ? 'Update' : 'Create'} Branch `
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export const CreateUpdateFormFormModal = ({
    title = 'Create Branch',
    description = 'Fill out the form to add new branch',
    className,
    formProps,
    useOrganizationId,
    ...props
}: IModalProps & {
    formProps?: Omit<ICreateBranchFormProps, 'className' | 'useOrganizationId'>
    useOrganizationId?: TEntityId
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('max-w-[75rem] p-10', className)}
            {...props}
        >
            <CreateUpdateBranchForm
                useOrganizationId={useOrganizationId}
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CreateUpdateFormFormModal
