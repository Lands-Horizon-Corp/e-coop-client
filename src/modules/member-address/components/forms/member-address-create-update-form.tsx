import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import AreaCombobox from '@/modules/area/components/area-combobox'
import BarangayCombobox from '@/modules/location/components/barangay-combobox'

// import { withToastCallbacks } from '@/helpers/callback-helper'
// import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { ChevronDownIcon } from '@/components/icons'
import MapPicker from '@/components/map/map-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

// import {
//     useCreateMemberProfileAddress,
//     useUpdateMemberProfileAddress,
// } from '../../member-address.service'
import {
    IMemberAddress,
    IMemberAddressRequest,
} from '../../member-address.types'
import { MemberAddressSchema } from '../../member-address.validation'
import HomeTypeCombobox from '../home-type-combobox'

type TMemberAddressFormValues = z.infer<typeof MemberAddressSchema>

export interface IMemberAddressFormProps
    extends
        IClassProps,
        IForm<
            Partial<IMemberAddress>,
            IMemberAddress,
            Error,
            TMemberAddressFormValues
        > {
    // memberProfileId: TEntityId
    // memberAddressId?: TEntityId
}

const MemberAddressCreateUpdateForm = ({
    // memberProfileId,
    // memberAddressId,
    className,
    onSuccess,
    ...formProps
}: IMemberAddressFormProps) => {
    const form = useForm<TMemberAddressFormValues>({
        resolver: standardSchemaResolver(MemberAddressSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            label: 'House',
            city: '',
            country_code: 'PH',
            postal_code: '',
            province_state: '',
            barangay: '',
            landmark: '',
            address: '',
            longitude: 121.046351,
            latitude: 14.780043,
            ...formProps.defaultValues,
        },
    })

    // const createMutation = useCreateMemberProfileAddress({
    //     options: {
    //         ...withToastCallbacks({
    //             textSuccess: 'Created',
    //             onSuccess: formProps.onSuccess,
    //             onError: formProps.onError,
    //         }),
    //     },
    // })
    // const updateMutation = useUpdateMemberProfileAddress({
    //     options: {
    //         ...withToastCallbacks({
    //             textSuccess: 'Updated',
    //             onSuccess: formProps.onSuccess,
    //             onError: formProps.onError,
    //         }),
    //     },
    // })

    const { handleFocusError } = useFormHelper<TMemberAddressFormValues>({
        form,
        ...formProps,
    })

    const onSubmit = form.handleSubmit((formData, e) => {
        e?.stopPropagation()
        e?.preventDefault()

        onSuccess?.(formData as IMemberAddress)
        // if (memberAddressId) {
        //     updateMutation.mutate({
        //         memberProfileId,
        //         memberAddressId,
        //         data: formData,
        //     })
        // } else {
        //     createMutation.mutate({
        //         memberProfileId,
        //         data: formData,
        //     })
        // }
        form.reset()
    }, handleFocusError)

    // const {
    //     error: rawError,
    //     isPending,
    //     reset,
    // } = memberAddressId ? updateMutation : createMutation

    // const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={/*isPending ||*/ formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Home Type *"
                            name="label"
                            render={({ field }) => (
                                <HomeTypeCombobox
                                    {...field}
                                    className="bg-popover"
                                    // disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Label"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Country Code *"
                            name="country_code"
                            render={({ field }) => (
                                <CountryCombobox
                                    {...field}
                                    customTriggerClassName="bg-popover"
                                    defaultValue={field.value}
                                    // disabled={isDisabled(field.name)}
                                    onChange={(country) =>
                                        field.onChange(country.alpha2)
                                    }
                                    undefinable={false}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Address *"
                            name="address"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    className="bg-popover"
                                    // disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Type complete address here"
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
                                    className="bg-popover"
                                    // disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="City"
                                />
                            )}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <FormFieldWrapper
                                control={form.control}
                                label="Postal Code"
                                name="postal_code"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        className="bg-popover"
                                        // disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Postal Code"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Province / State"
                                name="province_state"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        className="bg-popover"
                                        // disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Province/State"
                                    />
                                )}
                            />
                        </div>
                        <BarangayField form={form} />

                        <FormFieldWrapper
                            control={form.control}
                            description="Specifies the area this address belongs to, used for collector assignment."
                            descriptionClassName="text-xs"
                            label="Area"
                            name="area_id"
                            render={({ field }) => (
                                <AreaCombobox
                                    {...field}
                                    // disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Area Collection"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Landmark"
                            name="landmark"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    className="bg-popover"
                                    // disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Landmark"
                                />
                            )}
                        />
                        <MapPicker
                            className="w-full bg-popover"
                            disabled={formProps.readOnly}
                            onChange={(location) => {
                                if (location) {
                                    form.setValue('latitude', location.lat, {
                                        shouldDirty: true,
                                    })
                                    form.setValue('longitude', location.lng, {
                                        shouldDirty: true,
                                    })
                                } else {
                                    form.setValue('latitude', 0, {
                                        shouldDirty: true,
                                    })
                                    form.setValue('longitude', 0, {
                                        shouldDirty: true,
                                    })
                                }
                            }}
                            placeholder="Choose/Select exact location on map"
                            title="Pinpoint Address Location"
                            value={{
                                lat: form.watch('latitude') || 14.780043,
                                lng: form.watch('longitude') || 121.046351,
                            }}
                            variant="outline"
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty /* || isPending */}
                    // error={error}
                    // isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        // reset()
                    }}
                    onSubmit={(e) => onSubmit(e)}
                    readOnly={formProps.readOnly}
                    submitText={
                        formProps.defaultValues?.id ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

const BarangayField = ({
    form,
}: {
    form: UseFormReturn<IMemberAddressRequest>
}) => {
    const countryCode = form.watch('country_code')

    if (countryCode !== 'PH') return null

    return (
        <FormFieldWrapper
            control={form.control}
            label="Barangay"
            name="barangay"
            render={({ field }) => (
                <div className="flex gap-x-1">
                    <Input
                        {...field}
                        className="bg-popover"
                        id={field.name}
                        placeholder="Barangay"
                    />
                    <BarangayCombobox
                        city={form.watch('city')}
                        defaultValue={field.value}
                        onChange={(barangay) => {
                            field.onChange(barangay.name)
                        }}
                        trigger={
                            <Button
                                className="justify-between px-3"
                                role="combobox"
                                variant="outline"
                            >
                                <ChevronDownIcon className="opacity-50" />
                            </Button>
                        }
                        value={field.value}
                    />
                </div>
            )}
        />
    )
}

export const MemberAddressCreateUpdateFormModal = ({
    title = 'Create Address',
    description = 'Fill out the form to add or update address.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberAddressFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberAddressCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberAddressCreateUpdateForm
