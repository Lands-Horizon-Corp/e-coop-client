import z from 'zod'
import { toast } from 'sonner'
import { LatLngLiteral } from 'leaflet'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    MapMarkedIcon,
    VerifiedPatchIcon,
    LoadingSpinnerIcon,
} from '@/components/icons'
import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import MainMapContainer from '@/components/map'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import CompanyPicker from '@/components/pickers/company-picker'
import FormErrorMessage from '@/components/ui/form-error-message'
import { PhoneInput } from '@/components/contact-input/contact-input'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IForm } from '@/types/components'
import { useUpdateBranch } from '@/hooks/api-hooks/use-branch'
import { IBranchRequest, IBranchResource, TEntityId } from '@/types/coop-types'

type TBranchBasicInfo = Omit<
    IBranchRequest,
    | 'id'
    | 'media'
    | 'company'
    | 'employees'
    | 'members'
    | 'createdAt'
    | 'updatedAt'
>

interface BranchEditFormProps
    extends IClassProps,
        IForm<TBranchBasicInfo, IBranchResource, string> {
    branchId: TEntityId
}

const BranchBasicInfoFormSchema = z.object({
    name: z.string().min(1, 'Branch name is required'),
    description: z.string().optional(),
    companyId: z
        .string({ invalid_type_error: 'Company ID is invalid' })
        .optional(),
    address: z.string().min(1, 'Branch address is required').optional(),
    longitude: z.coerce.number().optional(),
    latitude: z.coerce.number().optional(),
    email: z.string().email('Invalid email address'),
    contactNumber: z.string(),
    isAdminVerified: z.boolean(),
})

const BranchEditForm = ({
    readOnly,
    branchId,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
    onLoading,
}: BranchEditFormProps) => {
    const [mapPickerState, setMapPickerState] = useState(false)

    const form = useForm<z.infer<typeof BranchBasicInfoFormSchema>>({
        defaultValues: {
            name: '',
            email: '',
            address: '',
            description: '',
            contactNumber: '',
            latitude: 14.5842,
            longitude: 120.9876,
            ...defaultValues,
        },
        reValidateMode: 'onChange',
        resolver: zodResolver(BranchBasicInfoFormSchema),
    })

    const hasChanges = form.formState.isDirty
    const defaultCenter = {
        lat: form.getValues('latitude') ?? 14.58423341171918,
        lng: form.getValues('longitude') ?? -239.01863962431653,
    }

    const {
        error,
        isPending,
        mutate: save,
        reset,
    } = useUpdateBranch({
        onSuccess: (data) => {
            onSuccess?.(data)
            form.reset(data)
        },
        onError,
    })

    const isDisabled = (
        field: keyof z.infer<typeof BranchBasicInfoFormSchema>
    ) => readOnly || disabledFields?.includes(field)

    useEffect(() => {
        onLoading?.(isPending)
    }, [isPending, onLoading])

    return (
        <form
            className={cn('flex flex-col gap-y-2', className)}
            onSubmit={form.handleSubmit((data) => save({ id: branchId, data }))}
        >
            <Form {...form}>
                <fieldset
                    disabled={readOnly || isPending}
                    className="grid gap-x-4 gap-y-4 sm:grid-cols-2"
                >
                    <fieldset className="space-y-2">
                        <legend className="mb-2">Branch Basic Info</legend>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="col-span-2 space-y-1 sm:col-span-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Branch Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Branch Name"
                                            autoComplete="off"
                                            disabled={isDisabled(field.name)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyId"
                            render={({ field }) => (
                                <FormItem className="col-span-2 space-y-1 sm:col-span-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Company
                                    </FormLabel>
                                    <FormControl>
                                        <CompanyPicker
                                            value={field.value}
                                            onSelect={(company) =>
                                                field.onChange(company.id)
                                            }
                                            placeholder="Select company"
                                            disabled={isDisabled(field.name)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="col-span-2 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <TextEditor
                                            content={field.value}
                                            onChange={field.onChange}
                                            className="!max-w-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </fieldset>

                    <fieldset className="space-y-2">
                        <legend className="mb-2">
                            Branch Contact & Address
                        </legend>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="col-span-2 space-y-1 sm:col-span-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="email"
                                            autoComplete="off"
                                            placeholder="Email"
                                            disabled={isDisabled(field.name)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem className="col-span-2 space-y-1 sm:col-span-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Contact Number
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative flex w-full flex-1 items-center gap-x-2">
                                            <PhoneInput
                                                {...field}
                                                defaultCountry="PH"
                                                className="w-full"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                            <VerifiedPatchIcon
                                                className={cn(
                                                    'absolute right-2 top-1/2 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out'
                                                )}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="col-span-2 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Branch Address
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            id={field.name}
                                            autoComplete="off"
                                            placeholder="Address"
                                            disabled={isDisabled(field.name)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="latitude"
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Latitude
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="number"
                                            autoComplete="off"
                                            placeholder="Latitude"
                                            disabled={isDisabled(field.name)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="longitude"
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Longitude
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="number"
                                            autoComplete="off"
                                            placeholder="Longitude"
                                            disabled={isDisabled(field.name)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="">
                            <div className="mt-2 flex items-center gap-x-2">
                                <p className="text-sm text-foreground/60">
                                    You may use the map to set the exact
                                    coordinates of the company.
                                </p>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setMapPickerState((val) => !val)
                                    }
                                >
                                    {mapPickerState ? 'Close Map' : 'Open Maps'}
                                    <MapMarkedIcon className="ml-4" />
                                </Button>
                            </div>
                            <Modal
                                hideCloseButton
                                open={mapPickerState}
                                titleClassName="hidden"
                                className="h-[90vh] sm:max-w-6xl"
                                descriptionClassName="hidden"
                                onOpenChange={setMapPickerState}
                            >
                                <MainMapContainer
                                    zoom={13}
                                    center={defaultCenter}
                                    defaultMarkerPins={[defaultCenter]}
                                    onCoordinateClick={(coord) => {
                                        const { lat, lng } =
                                            coord as LatLngLiteral
                                        if (
                                            !lat ||
                                            !lng ||
                                            isPending ||
                                            readOnly
                                        )
                                            return

                                        form.setValue('latitude', lat, {
                                            shouldDirty: true,
                                        })
                                        form.setValue('longitude', lng, {
                                            shouldDirty: true,
                                        })

                                        toast.info('Coordinate Set')
                                        setMapPickerState(false)
                                    }}
                                    className="w-full flex-1 p-0 py-2"
                                />
                            </Modal>
                        </div>
                    </fieldset>
                </fieldset>

                <FormErrorMessage errorMessage={error} />
                {hasChanges && (
                    <div>
                        <Separator className="my-2 sm:my-4" />
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    form.reset()
                                    reset()
                                }}
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                {isPending ? <LoadingSpinnerIcon /> : 'Save'}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </form>
    )
}

export const BranchEditFormModal = ({
    title = 'Edit Branch',
    description = 'Update branch info',
    formProps,
    className,
    ...props
}: IModalProps & { formProps: Omit<BranchEditFormProps, 'className'> }) => {
    return (
        <Modal
            title={title}
            className={cn('sm:max-w-7xl', className)}
            description={description}
            {...props}
        >
            <BranchEditForm {...formProps} />
        </Modal>
    )
}

export default BranchEditForm
