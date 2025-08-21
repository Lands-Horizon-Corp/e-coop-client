import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { base64ImagetoFile } from '@/helpers/picture-crop-helper'
import { cn } from '@/helpers/tw-utils'
import { IMedia, useUploadMedia } from '@/modules/media'
import { LatLngLiteral } from 'leaflet'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    HouseIcon,
    LoadingSpinnerIcon,
    PlusIcon,
    ReplaceIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MapPicker from '@/components/map/map-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import { SinglePictureUploadModal } from '@/components/single-image-uploader/single-picture-uploader'
import TextEditor from '@/components/text-editor'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'
import { useLocationInfo } from '@/hooks/use-location-info'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateBranchByOrgId, useUpdateBranch } from '../../branch.service'
import { IBranch, branchTypeEnum } from '../../branch.types'
import { branchSchema } from '../../branch.validation'

export type TBranchSchema = z.infer<typeof branchSchema>

export interface ICreateBranchFormProps
    extends IClassProps,
        IForm<Partial<TBranchSchema>, IBranch, string>,
        IModalProps {
    branchId?: TEntityId
    organizationId: TEntityId
}

export const CreateUpdateBranchByOrgForm = ({
    branchId,
    defaultValues,
    organizationId,
    hiddenFields,
    onSuccess,
}: ICreateBranchFormProps) => {
    const { countryCode } = useLocationInfo()

    const [openImagePicker, setOpenImagePicker] = useState(false)
    const [onOpenMap, setOnOpenMapPicker] = useState(false)

    const form = useForm<TBranchSchema>({
        resolver: zodResolver(branchSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            country_code: countryCode,
            ...defaultValues,
        },
    })
    const {
        mutate: createBranch,
        isPending: isPedingCreateBranch,
        error,
    } = useCreateBranchByOrgId()

    const { mutate: updateBranch, isPending: isLoadingUpdateBranch } =
        useUpdateBranch({
            options: {
                onSuccess: () => {
                    toast.success('Update Branch successfully')
                    form.reset()
                },
                onError: (err) => {
                    toast.error(err ? err.message : 'Unknown error')
                },
            },
        })

    const { isPending: isUploadingPhoto, mutateAsync: uploadPhoto } =
        useUploadMedia()

    const handleUploadPhoto = async (mediaId: TEntityId): Promise<string> => {
        const uploadedMedia = await uploadPhoto({
            file: base64ImagetoFile(mediaId, `bg-banner.jpg`) as File,
        })
        return uploadedMedia.id
    }

    const handleSubmit = form.handleSubmit(async (data) => {
        if (organizationId) {
            if (branchId) {
                const isMediaFromDB =
                    data.media.download_url?.startsWith('http')
                const media = isMediaFromDB
                    ? data.media.id
                    : await handleUploadPhoto(data.media.download_url ?? '')
                const request = { ...data, media_id: media }
                updateBranch({ id: branchId, payload: request })
            } else {
                const mediaId = await handleUploadPhoto(
                    data.media.download_url ?? ''
                )
                const request = {
                    ...data,
                    media_id: mediaId,
                }
                createBranch(
                    { branchData: request, organizationId },
                    { onSuccess }
                )
            }
        } else {
            console.error('Organization ID is missing.')
        }
    })

    const isBranchOnChanged = form.formState.isDirty

    const isLoading =
        isPedingCreateBranch || isLoadingUpdateBranch || isUploadingPhoto

    const updateDisabled =
        isLoadingUpdateBranch || isUploadingPhoto || !isBranchOnChanged

    const createDisabled = isPedingCreateBranch || isUploadingPhoto

    const combinedError = error

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

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
                    form.setValue('latitude', lat, { shouldDirty: true })
                    form.setValue('longitude', lng, { shouldDirty: true })
                }}
            />
            <Form {...form}>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex w-full gap-x-5">
                        <div className="grid w-1/2 grow grid-cols-2 gap-5">
                            <FormFieldWrapper
                                control={form.control}
                                name="name"
                                label="Branch Name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={field.value || ''}
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
                                        value={field.value || ''}
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
                                    <Select
                                        onValueChange={(selectedValue) => {
                                            field.onChange(selectedValue)
                                        }}
                                        disabled={isLoading}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            {field.value ||
                                                'Select branch Type'}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(branchTypeEnum).map(
                                                (branch) => {
                                                    return (
                                                        <SelectItem
                                                            key={branch}
                                                            value={branch}
                                                        >
                                                            {branch}
                                                        </SelectItem>
                                                    )
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
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
                                        defaultCountry={countryCode}
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
                                        value={field.value || ''}
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
                                        value={field.value || ''}
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
                                        value={field.value || ''}
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
                                        value={field.value || ''}
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
                                            value={field.value || ''}
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
                                            value={field.value || ''}
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
                                className="col-span-2 bg-red-500"
                                label="Set as Main Branch"
                                hiddenFields={hiddenFields}
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
                                name="media"
                                className="col-span-4"
                                render={({ field }) => {
                                    const media =
                                        (form.getValues('media') as IMedia) ??
                                        ''
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
                                                        form.setValue(
                                                            'media',
                                                            {
                                                                download_url:
                                                                    newImage,
                                                            },
                                                            {
                                                                shouldDirty: true,
                                                            }
                                                        )
                                                    }}
                                                    defaultImage={
                                                        media.download_url
                                                    }
                                                />

                                                <ImageDisplay
                                                    fallbackClassName="!text-3xl"
                                                    src={
                                                        media.url ??
                                                        media.download_url
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
                                                    disabled={isLoading}
                                                    content={field.value ?? ''}
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
                                                value={field.value || ''}
                                                disabled={isLoading}
                                                onChange={field.onChange}
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
                                                value={field.value || ''}
                                                disabled={isLoading}
                                                onChange={field.onChange}
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
                        errorMessage={combinedError?.message ?? undefined}
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
                            disabled={
                                branchId ? updateDisabled : createDisabled
                            }
                            className=""
                        >
                            {isLoading ? (
                                <div className="flex space-x-2">
                                    {branchId ? 'updating ' : 'Creating '}{' '}
                                    <LoadingSpinnerIcon
                                        size={18}
                                        className="ml-2 animate-spin"
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

export const CreateUpdateBranchFormModal = ({
    title = 'Create Branch',
    description = 'Fill out the form to add new branch',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<ICreateBranchFormProps, 'className' | 'useOrganizationId'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('max-w-[75rem] p-10', className)}
            {...props}
        >
            <CreateUpdateBranchByOrgForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CreateUpdateBranchFormModal
