import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import { LoadingSpinnerIcon } from '@/components/icons'
import MapPicker from '@/components/map/map-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'
import { useFormHelper } from '@/hooks/use-form-helper'
import { useLocationInfo } from '@/hooks/use-location-info'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateBranchByOrganizationId,
    useUpdateBranch,
} from '../../branch.service'
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
    organizationId,
    ...formProps
}: ICreateBranchFormProps) => {
    const { countryCode } = useLocationInfo()
    const form = useForm<TBranchSchema>({
        resolver: standardSchemaResolver(branchSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            country_code: countryCode,
            media: formProps.defaultValues?.media,
            description: formProps.defaultValues?.description ?? '',
            type:
                formProps.defaultValues?.type ??
                branchTypeEnum.CooperativeBranch,
            ...formProps.defaultValues,
        },
    })

    const {
        mutate: createBranch,
        isPending: isPedingCreateBranch,
        error,
    } = useCreateBranchByOrganizationId({
        options: {
            onSuccess: (createdData) => {
                toast.success(`Branch ${createdData.name} created successfully`)
                form.reset()
                formProps.onSuccess?.(createdData)
            },
            onError: (err) => {
                toast.error(err ? err.message : 'Unknown error')
            },
        },
    })

    const { mutate: updateBranch, isPending: isLoadingUpdateBranch } =
        useUpdateBranch({
            options: {
                onSuccess: (data) => {
                    toast.success(`Branch ${data.name} updated successfully`)
                    form.reset()
                    formProps.onSuccess?.(data)
                },
                onError: (err) => {
                    toast.error(err ? err.message : 'Unknown error')
                },
            },
        })

    const { formRef, handleFocusError } = useFormHelper<TBranchSchema>({
        form,
        ...formProps,
        autoSave: false,
    })

    const handleSubmit = form.handleSubmit(async (data) => {
        try {
            if (organizationId && branchId) {
                updateBranch({ id: branchId, payload: data })
                return
            } else {
                createBranch(
                    { payload: data, organizationId },
                    { onSuccess: formProps.onSuccess }
                )
            }
        } catch (error) {
            console.error(error)
        }
    }, handleFocusError)

    const isBranchOnChanged = form.formState.isDirty

    const isLoading = isPedingCreateBranch || isLoadingUpdateBranch

    const updateDisabled = isLoadingUpdateBranch || !isBranchOnChanged

    const createDisabled = isPedingCreateBranch

    const combinedError = error

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)
    return (
        <div className="mt-10">
            <Form {...form}>
                <form className="w-full" onSubmit={handleSubmit} ref={formRef}>
                    <div className="flex w-full gap-x-5">
                        <div className="grid w-1/2 grow grid-cols-2 gap-5">
                            <FormFieldWrapper
                                control={form.control}
                                label="Branch Name"
                                name="name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter branch name"
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Branch Email"
                                name="email"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter email"
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Branch Type"
                                name="type"
                                render={({ field }) => (
                                    <Select
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                        onValueChange={(selectedValue) => {
                                            field.onChange(selectedValue)
                                        }}
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
                                label="Contact Number"
                                name="contact_number"
                                render={({ field }) => (
                                    <PhoneInput
                                        {...field}
                                        className="w-full"
                                        defaultCountry={countryCode}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="grow"
                                control={form.control}
                                label="Address"
                                name="address"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter address"
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Province"
                                name="province"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter province"
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="City"
                                name="city"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter city"
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Barangay"
                                name="barangay"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isLoading}
                                        placeholder="Enter barangay"
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <div className="col-span-2 grid grid-cols-3 gap-x-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Region"
                                    name="region"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="Enter region"
                                            value={field.value || ''}
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Postal Code"
                                    name="postal_code"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="Enter postal code"
                                            value={field.value || ''}
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Country Code"
                                    name="country_code"
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
                        </div>
                        <div className="grid grid-cols-1">
                            <FormFieldWrapper
                                control={form.control}
                                label="Branch Photo"
                                name="media_id"
                                render={({ field }) => {
                                    const value = form.watch('media')

                                    return (
                                        <ImageField
                                            {...field}
                                            onChange={(newImage) => {
                                                if (newImage)
                                                    field.onChange(newImage.id)
                                                else field.onChange(undefined)

                                                form.setValue('media', newImage)
                                            }}
                                            placeholder="Upload Branch Photo"
                                            value={
                                                value
                                                    ? (value as IMedia)
                                                          .download_url
                                                    : value
                                            }
                                        />
                                    )
                                }}
                            />
                            <FormFieldWrapper
                                className="col-span-4 max-w-full"
                                control={form.control}
                                label="Branch Description"
                                name="description"
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                className="max-w-[500px] w-full"
                                                content={field.value ?? ''}
                                                disabled={isLoading}
                                                placeholder="Write some description about your branch..."
                                                textEditorClassName="!h-32"
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                            <div>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex gap-x-2 items-center ">
                                        <FormFieldWrapper
                                            className="grow"
                                            control={form.control}
                                            label="Latitude"
                                            name="latitude"
                                            render={({ field }) => (
                                                <div className="flex grow flex-col gap-y-2">
                                                    <Input
                                                        {...field}
                                                        disabled={isLoading}
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        placeholder="latitude"
                                                        value={
                                                            field.value || ''
                                                        }
                                                    />
                                                </div>
                                            )}
                                        />
                                        <FormFieldWrapper
                                            className="grow"
                                            control={form.control}
                                            label="Longitude"
                                            name="longitude"
                                            render={({ field }) => (
                                                <div className="flex grow flex-col gap-y-2">
                                                    <Input
                                                        {...field}
                                                        disabled={isLoading}
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        placeholder="Longitude"
                                                        value={
                                                            field.value || ''
                                                        }
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <MapPicker
                                        disabled={isLoading}
                                        onChange={(location) => {
                                            if (location) {
                                                form.setValue(
                                                    'latitude',
                                                    location.lat
                                                )
                                                form.setValue(
                                                    'longitude',
                                                    location.lng
                                                )
                                            } else {
                                                form.setValue('latitude', 0)
                                                form.setValue('longitude', 0)
                                            }
                                        }}
                                        placeholder="Click to select branch location"
                                        title="Select Branch Location"
                                        value={{
                                            lat:
                                                form.watch('latitude') ||
                                                14.780043,
                                            lng:
                                                form.watch('longitude') ||
                                                121.046351,
                                        }}
                                        variant="outline"
                                    />
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
                            disabled={isLoading}
                            onClick={(e) => {
                                e.preventDefault()
                                form.reset()
                            }}
                            variant={'secondary'}
                        >
                            Reset
                        </Button>
                        <Button
                            className=""
                            disabled={
                                branchId ? updateDisabled : createDisabled
                            }
                            type="submit"
                        >
                            {isLoading ? (
                                <div className="flex space-x-2">
                                    {branchId ? 'updating ' : 'Creating '}{' '}
                                    <LoadingSpinnerIcon
                                        className="ml-2 animate-spin"
                                        size={18}
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
    title = '',
    description = '',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<ICreateBranchFormProps, 'className' | 'useOrganizationId'>
}) => {
    return (
        <Modal
            className={cn('max-w-[75rem] p-10', className)}
            description={description}
            title={title}
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
