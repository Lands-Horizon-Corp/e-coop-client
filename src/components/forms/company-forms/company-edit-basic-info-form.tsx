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
import FormErrorMessage from '@/components/ui/form-error-message'
import { PhoneInput } from '@/components/contact-input/contact-input'

import { cn } from '@/lib'
import { contactNumberSchema } from '@/validations/common'
import { useUpdateCompany } from '@/hooks/api-hooks/use-company'

import { IClassProps } from '@/types'
import { IForm } from '@/types/components'
import { ICompanyResource, TEntityId } from '@/server/types'

type TCompanyBasicInfo = Omit<ICompanyResource, 'owner' | 'media' | 'branches'>

interface CompanyEditBasicInfoFormProps
    extends IClassProps,
        IForm<TCompanyBasicInfo, ICompanyResource, string> {
    companyId: TEntityId
}

const CompanyBasicInfoFormSchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    description: z
        .string()
        .min(1, 'Company description is required')
        .optional(),
    address: z.string().min(1, 'Company address is required').optional(),
    longitude: z.coerce.number().optional(),
    latitude: z.coerce.number().optional(),
    contactNumber: contactNumberSchema,
    isAdminVerified: z.boolean(),
})

const CompanyEditForm = ({
    readOnly,
    companyId,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
    onLoading,
}: CompanyEditBasicInfoFormProps) => {
    const [mapPickerState, setMapPickerState] = useState(false)
    const form = useForm<z.infer<typeof CompanyBasicInfoFormSchema>>({
        defaultValues: {
            name: '',
            address: '',
            contactNumber: '',
            description: '',
            latitude: 14.58423341171918,
            longitude: 120.987654321,
            ...defaultValues,
        },
        reValidateMode: 'onChange',
        resolver: zodResolver(CompanyBasicInfoFormSchema),
    })

    const hasChanges = form.formState.isDirty
    const firstError = Object.values(form.formState.errors)[0]?.message

    const defaultCenter = {
        lat: form.getValues('latitude') ?? 14.58423341171918,
        lng: form.getValues('longitude') ?? 120.987654321,
    }

    const {
        isPending,
        mutate: save,
        error,
        reset,
    } = useUpdateCompany({
        onSuccess: (data) => {
            onSuccess?.(data)
            form.reset(data)
        },
        onError,
    })

    const isDisabled = (
        field: keyof z.infer<typeof CompanyBasicInfoFormSchema>
    ) => readOnly || disabledFields?.includes(field)

    useEffect(() => {
        onLoading?.(isPending)
    }, [isPending, onLoading])

    return (
        <form
            className={cn('flex flex-col gap-y-2', className)}
            onSubmit={form.handleSubmit((data) =>
                save({ id: companyId, data })
            )}
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
                                            autoComplete="off"
                                            placeholder="Company Name"
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
                                            className="!max-w-none"
                                            onChange={field.onChange}
                                            // disabled={isDisabled(field.name)}
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
                                                className="w-full"
                                                defaultCountry="PH"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
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
                                            disabled={isDisabled(field.name)}
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
                <FormErrorMessage errorMessage={firstError || error} />
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

export const CompanyEditFormModal = ({
    title = 'Edit Company',
    description = 'Setup a new company',
    formProps,
    className,
    ...props
}: IModalProps & {
    formProps: Omit<CompanyEditBasicInfoFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            className={cn('sm:max-w-7xl', className)}
            description={description}
            {...props}
        >
            <CompanyEditForm {...formProps} />
        </Modal>
    )
}

export default CompanyEditForm
