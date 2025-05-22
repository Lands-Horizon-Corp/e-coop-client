import ActionTooltip from '@/components/action-tooltip'
import { PhoneInput } from '@/components/contact-input/contact-input'
import {
    HouseIcon,
    LoadingSpinnerIcon,
    PlusIcon,
    ReplaceIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { SinglePictureUploadModal } from '@/components/single-image-uploader/single-picture-uploader'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Input } from '@/components/ui/input'
import UserAvatar from '@/components/user-avatar'
import { Label } from '@/components/ui/label'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import TextEditor from '@/components/text-editor'
import MapPicker from '@/components/map-picker'
import { DialogClose } from '@/components/ui/dialog'

import { IBranch, IBranchRequest, TEntityId } from '@/types'
import { useCreateBranch, useUpdateBranch } from '@/hooks/api-hooks/use-branch'
import { useSinglePictureUpload } from '@/hooks/api-hooks/use-media'
import { branchRequestSchema } from '@/validations/form-validation/branch/create-branch-schema'
import { base64ImagetoFile } from '@/helpers'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LatLngLiteral } from 'leaflet'

interface CreateBranchFormProps extends IModalProps {
    userOrganizationId: TEntityId
    setOpenCreateBranchModal: React.Dispatch<React.SetStateAction<boolean>>
    branch: IBranch | undefined
    defaultValues: Partial<IBranchRequest> | undefined
}
type ICreateBranchSchema = z.infer<typeof branchRequestSchema>

const CreateBranchForm = ({
    userOrganizationId,
    setOpenCreateBranchModal,
    branch,
    defaultValues,
    ...props
}: CreateBranchFormProps) => {
    const [openImagePicker, setOpenImagePicker] = useState(false)
    const [onOpenMap, setOnOpenMapPicker] = useState(false)

    const isEditMode = !!branch

    const defaultFormValues = {
        name: '',
        email: '',
        type: 'cooperative branch',
        media_id: null,
        contact_number: '',
        country_code: '',
        description: '',
        address: '',
        province: '',
        city: '',
        region: '',
        barangay: '',
        postal_code: '',
        is_main_branch: false,
    }
    const form = useForm<ICreateBranchSchema>({
        resolver: zodResolver(branchRequestSchema),
        defaultValues: defaultFormValues,
    })

    useEffect(() => {
        if (isEditMode && defaultValues) {
            form.reset({
                ...defaultValues,
            })
        } else {
            form.reset(defaultFormValues)
        }
    }, [isEditMode, defaultValues])

    const {
        mutate: createBranch,
        isPending: isLoadingCreateBranch,
        error,
    } = useCreateBranch(
        {
            onSuccess: () => {
                toast.success('Branch created successfully')
                form.reset()
                setOpenCreateBranchModal(false)
            },
            onError: (err) => {
                toast.error(<>{err}</>)
            },
        },
        userOrganizationId
    )
    const { mutate: updateBranch, isPending: isLoadingUpdateBranch } =
        useUpdateBranch(
            {
                onSuccess: () => {
                    toast.success('Update Branch successfully')
                    form.reset()
                    setOpenCreateBranchModal(false)
                },
            },
            userOrganizationId
        )

    const { isPending: isUploadingPhoto, mutateAsync: uploadPhoto } =
        useSinglePictureUpload({})

    const handleUploadPhoto = async (mediaId: TEntityId): Promise<string> => {
        const uploadedMedia = await uploadPhoto(
            base64ImagetoFile(mediaId, `bg-banner.jpg`) as File
        )
        return uploadedMedia.id
    }

    const handleSubmit = async (data: ICreateBranchSchema) => {
        if (userOrganizationId) {
            if (isEditMode) {
                let media = ''
                const isMediaNotChanged =
                    defaultValues?.media_id === data.media_id
                if (isMediaNotChanged) {
                    media = branch.media.id
                    const request = { ...data, media_id: media }
                    updateBranch(request)
                } else {
                    const media = await handleUploadPhoto(data.media_id ?? '')
                    const request = { ...data, media_id: media }
                    updateBranch(request)
                }
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

    const combinedError = error

    return (
        <div className="mt-10">
            <Modal
                className="max-w-[75rem] p-10"
                {...props}
                title={`${isEditMode ? 'Edit' : 'Create'} Branch`}
                description={`Fill up this form to ${isEditMode ? 'Edit' : 'Create'} Branch`}
                titleClassName="text-2xl"
            >
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
                                                placeholder="Enter postal code"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="country_code"
                                        label="Country Code"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="PH"
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
                                            <GradientBackground gradientOny>
                                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                    <Checkbox
                                                        id={field.name}
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
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
                                                                htmlFor={
                                                                    field.name
                                                                }
                                                            >
                                                                Set as Main
                                                                Branch
                                                            </Label>
                                                            <p
                                                                id={`${field.name}`}
                                                                className="text-xs text-muted-foreground"
                                                            >
                                                                This will
                                                                designate the
                                                                branch as the
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
                                    render={({ field }) => (
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
                                                        field.onChange(newImage)
                                                    }}
                                                    defaultImage={
                                                        field.value ?? ''
                                                    }
                                                />
                                                <UserAvatar
                                                    src={field.value ?? ''}
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
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Organization Description"
                                    name="description"
                                    className="col-span-4"
                                    render={({ field }) => (
                                        <FormControl>
                                            <TextEditor
                                                {...field}
                                                content={field.value ?? ''}
                                                className="w-full"
                                                textEditorClassName="!max-w-none !h-32"
                                                placeholder="Write some description about your branch..."
                                            />
                                        </FormControl>
                                    )}
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
                            <DialogClose asChild>
                                <Button variant={'secondary'}>Cancel</Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={
                                    isLoadingCreateBranch ||
                                    isLoadingUpdateBranch ||
                                    isUploadingPhoto ||
                                    !isBranchOnChanged
                                }
                                className=""
                            >
                                {isLoadingCreateBranch ||
                                isLoadingUpdateBranch ? (
                                    <LoadingSpinnerIcon
                                        size={18}
                                        className="mr-2 animate-spin"
                                    />
                                ) : (
                                    `${isEditMode ? 'Update' : 'Create'} Branch `
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Modal>
        </div>
    )
}

export default CreateBranchForm
