import z from 'zod'
import { toast } from 'sonner'
import { LatLngLiteral } from 'leaflet'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'

import { MapMarkedIcon, VerifiedPatchIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import MainMapContainer from '@/components/map'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import OwnerPicker from '@/components/pickers/owner-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import { PhoneInput } from '@/components/contact-input/contact-input'

import { cn } from '@/lib'
import { useCreateCompany } from '@/hooks/api-hooks/use-company'

import { IClassProps } from '@/types'
import { IForm } from '@/types'
import { contactNumberSchema } from '@/validations/common'
import { ICompanyRequest, ICompanyResource } from '@/types'
import LoadingSpinner from '@/components/spinners/loading-spinner'

interface CompanyCreateFormProps
    extends IClassProps,
        IForm<ICompanyRequest, ICompanyResource> {}

const CompanyBasicInfoFormSchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    description: z
        .string()
        .min(1, 'Company description is required')
        .optional(),
    contactNumber: contactNumberSchema,
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    address: z.string().min(1, 'Company address is required').optional(),
    ownerId: z.coerce
        .string({ invalid_type_error: 'Invalid Owner' })
        .optional(),
})

const CompanyCreateForm = ({
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
    onLoading,
}: CompanyCreateFormProps) => {
    const [mapPickerState, setMapPickerState] = useState(false)

    const form = useForm<z.infer<typeof CompanyBasicInfoFormSchema>>({
        defaultValues: {
            address: '',
            contactNumber: '',
            description: '',
            latitude: 14.58423341171918,
            longitude: 120.987654321,
            name: '',
            ...defaultValues,
        },
        reValidateMode: 'onChange',
        resolver: zodResolver(CompanyBasicInfoFormSchema),
    })

    const defaultCenter = {
        lat: form.getValues('latitude') ?? 14.58423341171918,
        lng: form.getValues('longitude') ?? 120.987654321,
    }

    const {
        isPending,
        mutate: create,
        error,
        reset,
    } = useCreateCompany({
        onSuccess: (data) => {
            onSuccess?.(data)
            form.reset(data)
        },
        onError,
    })

    useEffect(() => {
        onLoading?.(isPending)
    }, [isPending, onLoading])

    const isDisabled = (
        field: keyof z.infer<typeof CompanyBasicInfoFormSchema>
    ) => readOnly || disabledFields?.includes(field)

    return (
        <form
            className={cn('flex flex-col gap-y-2', className)}
            onSubmit={form.handleSubmit((data) => create(data))}
        >
            <Form {...form}>
                <fieldset
                    disabled={readOnly || isPending}
                    className="grid gap-x-4 gap-y-4 sm:grid-cols-2"
                >
                    <fieldset className="space-y-2">
                        <legend className="mb-2">Company Basic Info</legend>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="col-span-2 space-y-1 sm:col-span-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Company Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Company Name"
                                            autoComplete="off"
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
                        <FormField
                            control={form.control}
                            name="ownerId"
                            render={({ field }) => (
                                <FormItem className="col-span-2 space-y-1 sm:col-span-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Company Owner
                                    </FormLabel>
                                    <FormControl>
                                        <OwnerPicker
                                            value={field.value}
                                            onSelect={(company) =>
                                                field.onChange(company.id)
                                            }
                                            placeholder="Select Owner"
                                            disabled={isDisabled('ownerId')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </fieldset>

                    <fieldset className="space-y-2">
                        <legend className="mb-2">
                            Company Contact & Address
                        </legend>
                        <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({
                                field,
                                fieldState: { invalid, error },
                            }) => (
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
                                            />
                                            <VerifiedPatchIcon
                                                className={cn(
                                                    'absolute right-2 top-1/2 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                    (invalid || error) &&
                                                        'text-destructive'
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
                                        Company Address
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            id={field.name}
                                            autoComplete="off"
                                            placeholder="Address"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <h4 className="col-span-2 text-sm font-normal text-foreground/60">
                            Company Map Location
                        </h4>
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
                            {isPending ? <LoadingSpinner /> : 'Create'}
                        </Button>
                    </div>
                </div>
            </Form>
        </form>
    )
}

export const CompanyCreateFormModal = ({
    title = 'Company Create',
    description = 'Setup a new company',
    formProps,
    className,
    ...props
}: IModalProps & { formProps: Omit<CompanyCreateFormProps, 'className'> }) => {
    return (
        <Modal
            title={title}
            className={cn('sm:max-w-7xl', className)}
            description={description}
            {...props}
        >
            <CompanyCreateForm {...formProps} />
        </Modal>
    )
}

export default CompanyCreateForm
