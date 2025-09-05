import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
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
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
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
                                    disabled={isDisabled(field.name)}
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
                    readOnly={formProps.readOnly}
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
