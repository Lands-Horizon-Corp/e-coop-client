import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import MapPicker from '@/components/map/map-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateMemberProfileAddress,
    useUpdateMemberProfileAddress,
} from '../../member-address.service'
import { IMemberAddress } from '../../member-address.types'
import { MemberAddressSchema } from '../../member-address.validation'

type TMemberAddressFormValues = z.infer<typeof MemberAddressSchema>

export interface IMemberAddressFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberAddress>,
            IMemberAddress,
            Error,
            TMemberAddressFormValues
        > {
    memberProfileId: TEntityId
    memberAddressId?: TEntityId
}

const MemberAddressCreateUpdateForm = ({
    memberProfileId,
    memberAddressId,
    className,
    ...formProps
}: IMemberAddressFormProps) => {
    const form = useForm<TMemberAddressFormValues>({
        resolver: standardSchemaResolver(MemberAddressSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            label: '',
            city: '',
            country_code: '',
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

    const createMutation = useCreateMemberProfileAddress({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateMemberProfileAddress({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberAddressFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (memberAddressId) {
            updateMutation.mutate({
                memberProfileId,
                memberAddressId,
                data: formData,
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: formData,
            })
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = memberAddressId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    const countryCode = form.watch('country_code')

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Label *"
                            name="label"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
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
                                    defaultValue={field.value}
                                    disabled={isDisabled(field.name)}
                                    onChange={(country) =>
                                        field.onChange(country.alpha2)
                                    }
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
                                    disabled={isDisabled(field.name)}
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
                                    disabled={isDisabled(field.name)}
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
                                        disabled={isDisabled(field.name)}
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
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Province/State"
                                    />
                                )}
                            />
                        </div>
                        {countryCode === 'PH' && (
                            <FormFieldWrapper
                                control={form.control}
                                label="Barangay"
                                name="barangay"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Barangay"
                                    />
                                )}
                            />
                        )}
                        <FormFieldWrapper
                            control={form.control}
                            label="Landmark"
                            name="landmark"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Landmark"
                                />
                            )}
                        />
                        <MapPicker
                            className="w-full"
                            disabled={isPending || formProps.readOnly}
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
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={memberAddressId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const MemberAddressCreateUpdateFormModal = ({
    title = 'Create Address',
    description = 'Fill out the form to add or update address.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberAddressFormProps, 'className'>
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
