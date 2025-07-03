import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { entityIdSchema } from '@/validations/common'

import {
    useCreateMemberProfileAddress,
    useUpdateMemberProfileAddress,
} from '@/hooks/api-hooks/member/use-member-profile-settings'

import { IClassProps, IForm, IMemberAddress, TEntityId } from '@/types'

export const memberAddressSchema = z.object({
    id: z.string().optional(),
    member_profile_id: entityIdSchema,
    label: z.string().min(1, 'Label is required'),
    country_code: z.string().min(1, 'Country code is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    province_state: z.string().optional(),
    barangay: z.string().optional(),
    landmark: z.string().optional(),
})

type TMemberAddressFormValues = z.infer<typeof memberAddressSchema>

export interface IMemberAddressFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberAddress>,
            IMemberAddress,
            string,
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
        resolver: zodResolver(memberAddressSchema),
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
        onSuccess,
        onError,
        showMessage: true,
    })
    const updateMutation = useUpdateMemberProfileAddress({
        onSuccess,
        onError,
        showMessage: true,
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
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
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
                            size="sm"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : memberAddressId ? (
                                'Update'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
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
