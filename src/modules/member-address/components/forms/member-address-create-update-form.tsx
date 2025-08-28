import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
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
            ...defaultValues,
        },
    })

    const createMutation = useCreateMemberProfileAddress({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess,
                onError,
            }),
        },
    })
    const updateMutation = useUpdateMemberProfileAddress({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess,
                onError,
            }),
        },
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
    })

    const { error, isPending, reset } = memberAddressId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TMemberAddressFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const countryCode = form.watch('country_code')

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="label"
                            label="Label *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Label"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="country_code"
                            label="Country Code *"
                            render={({ field }) => (
                                <CountryCombobox
                                    {...field}
                                    defaultValue={field.value}
                                    onChange={(country) =>
                                        field.onChange(country.alpha2)
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="address"
                            label="Address *"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Type complete address here"
                                    disabled={isDisabled(field.name)}
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
                                    id={field.name}
                                    placeholder="City"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="postal_code"
                                label="Postal Code"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Postal Code"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="province_state"
                                label="Province / State"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Province/State"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                        {countryCode === 'PH' && (
                            <FormFieldWrapper
                                control={form.control}
                                name="barangay"
                                label="Barangay"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Barangay"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        )}
                        <FormFieldWrapper
                            control={form.control}
                            name="landmark"
                            label="Landmark"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Landmark"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={memberAddressId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
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
            title={title}
            description={description}
            className={cn('', className)}
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
