import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { HouseIcon, LoadingSpinnerIcon } from '@/components/icons'
import MapPicker from '@/components/map/map-picker/map-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
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
                <form ref={formRef} onSubmit={handleSubmit} className="w-full">
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
                                className="col-span-2 bg-destructive"
                                label="Set as Main Branch"
                                hiddenFields={formProps.hiddenFields}
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
                                name="media_id"
                                label="Branch Photo"
                                render={({ field }) => {
                                    const value = form.watch('media')

                                    return (
                                        <ImageField
                                            {...field}
                                            placeholder="Upload Branch Photo"
                                            value={
                                                value
                                                    ? (value as IMedia)
                                                          .download_url
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
                            <FormFieldWrapper
                                control={form.control}
                                label="Branch Description"
                                name="description"
                                className="col-span-4"
                                render={({ field }) => {
                                    const { ref: _ref, ...rest } = field
                                    return (
                                        <FormControl>
                                            <TextEditor
                                                {...rest}
                                                disabled={isLoading}
                                                content={field.value ?? ''}
                                                textEditorClassName="!h-32"
                                                placeholder="Write some description about your branch..."
                                            />
                                        </FormControl>
                                    )
                                }}
                            />
                            <div>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex gap-x-2 items-center ">
                                        <FormFieldWrapper
                                            control={form.control}
                                            label="Latitude"
                                            name="latitude"
                                            className="grow"
                                            render={({ field }) => (
                                                <div className="flex grow flex-col gap-y-2">
                                                    <Input
                                                        {...field}
                                                        value={
                                                            field.value || ''
                                                        }
                                                        disabled={isLoading}
                                                        onChange={
                                                            field.onChange
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
                                                        value={
                                                            field.value || ''
                                                        }
                                                        disabled={isLoading}
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        placeholder="Longitude"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <MapPicker
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
                                        disabled={isLoading}
                                        variant="outline"
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
