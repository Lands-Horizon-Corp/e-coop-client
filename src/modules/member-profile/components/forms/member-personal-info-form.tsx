import { useCallback } from 'react'

import { Path, UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IMedia } from '@/modules/media'
import { IMemberAddressRequest } from '@/modules/member-address'
import { MemberAddressCreateUpdateFormModal } from '@/modules/member-address/components/forms/member-address-create-update-form'
import MemberGenderCombobox from '@/modules/member-gender/components/member-gender-combobox'
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'

import CivilStatusCombobox from '@/components/comboboxes/civil-status-combobox'
import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import SexCombobox from '@/components/comboboxes/sex-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    PinLocationIcon,
    PlusIcon,
    TrashIcon,
    VerifiedPatchIcon,
} from '@/components/icons'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { PhoneInput } from '@/components/ui/phone-input'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'
import { IForm, TEntityId } from '@/types'

import {
    IMemberProfile,
    IMemberProfilePersonalInfoRequest,
    useUpdateMemberProfilePersonalInfo,
} from '../..'
import { MemberProfilePersonalInfoSchema } from '../../member-profile.validation'

type TMemberProfilePersonalInfoFormValues = z.infer<
    typeof MemberProfilePersonalInfoSchema
>

export interface IMemberProfilePersonalInfoFormProps
    extends
        IClassProps,
        IForm<
            Partial<IMemberProfilePersonalInfoRequest>,
            IMemberProfile,
            Error,
            TMemberProfilePersonalInfoFormValues
        > {
    memberProfileId: TEntityId
}

const MemberPersonalInfoForm = ({
    readOnly,
    className,
    hiddenFields,
    defaultValues,
    disabledFields,
    memberProfileId,
    onError,
    onSuccess,
}: IMemberProfilePersonalInfoFormProps) => {
    const form = useForm<TMemberProfilePersonalInfoFormValues>({
        resolver: standardSchemaResolver(MemberProfilePersonalInfoSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            sex: 'female',
            ...defaultValues,
            birthdate: toInputDateString(
                defaultValues?.birthdate ?? new Date()
            ),
        },
    })

    const {
        mutate,
        error: rawError,
        isPending,
        reset,
    } = useUpdateMemberProfilePersonalInfo({
        options: {
            onSuccess,
            onError,
            meta: {
                invalidates: [
                    ['member-profile'],
                    ['member-profile', memberProfileId],
                ],
            },
        },
    })

    const error = serverRequestErrExtractor({ error: rawError })

    const handleSubmit = useCallback(
        (formData: TMemberProfilePersonalInfoFormValues) => {
            mutate(
                {
                    memberId: memberProfileId,
                    data: {
                        ...formData,
                        full_name: `${formData.first_name ?? ''} ${formData.middle_name ?? ''} ${formData.last_name ?? ''} ${formData.suffix ?? ''}`,
                    },
                },
                {
                    onSuccess: (data) => {
                        toast.success('Saved')
                        form.reset({
                            ...data,
                            birthdate: toInputDateString(
                                data?.birthdate ?? new Date()
                            ),
                        })
                    },
                }
            )
        },
        [form, memberProfileId, mutate]
    )

    const { formRef } = useFormHelper<TMemberProfilePersonalInfoFormValues>({
        form,
        autoSave: true,
    })

    const isDisabled = (field: Path<TMemberProfilePersonalInfoFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={form.handleSubmit(handleSubmit)}
                ref={formRef}
            >
                <fieldset className="grid gap-x-6 gap-y-4" disabled={readOnly}>
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <p>Photo & Signature</p>
                            <div className="grid grid-cols-2 gap-x-3">
                                <FormFieldWrapper
                                    control={form.control}
                                    hiddenFields={hiddenFields}
                                    label="Photo"
                                    name="media_id"
                                    render={({ field }) => {
                                        const value = form.watch('media')
                                        return (
                                            <ImageField
                                                {...field}
                                                onChange={(newImage) => {
                                                    field.onChange(newImage?.id)
                                                    form.setValue(
                                                        'media',
                                                        newImage
                                                    )
                                                }}
                                                placeholder="Upload Photo"
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
                                    control={form.control}
                                    hiddenFields={hiddenFields}
                                    label="Signature"
                                    name="signature_media_id"
                                    render={({ field }) => {
                                        const value =
                                            form.watch('signature_media')
                                        return (
                                            <SignatureField
                                                {...field}
                                                onChange={(newImage) => {
                                                    field.onChange(newImage?.id)

                                                    form.setValue(
                                                        'signature_media',
                                                        newImage
                                                    )
                                                }}
                                                placeholder="Signature"
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
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <p>Personal Information</p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-10">
                                <FormFieldWrapper
                                    className="col-span-3"
                                    control={form.control}
                                    hiddenFields={hiddenFields}
                                    label="First Name *"
                                    name="first_name"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            autoComplete="given-name"
                                            className="bg-background"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            placeholder="First Name"
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    className="col-span-3"
                                    control={form.control}
                                    hiddenFields={hiddenFields}
                                    label="Middle Name"
                                    name="middle_name"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            autoComplete="additional-name"
                                            className="bg-background"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            placeholder="Middle Name"
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    className="col-span-3"
                                    control={form.control}
                                    hiddenFields={hiddenFields}
                                    label="Last Name *"
                                    name="last_name"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            autoComplete="family-name"
                                            className="bg-background"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            placeholder="Last Name"
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    className="col-span-1"
                                    control={form.control}
                                    hiddenFields={hiddenFields}
                                    label="Suffix"
                                    name="suffix"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            autoComplete="honorific-suffix"
                                            className="bg-background"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            placeholder=""
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={hiddenFields}
                                label="Civil Status *"
                                name="civil_status"
                                render={({ field }) => (
                                    <CivilStatusCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Civil Status"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                label="Sex *"
                                name="sex"
                                render={({ field }) => (
                                    <SexCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Sex"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={hiddenFields}
                                label="Gender *"
                                name="member_gender_id"
                                render={({ field }) => (
                                    <MemberGenderCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected.id)
                                        }
                                        placeholder="Select Gender"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="relative"
                                control={form.control}
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                hiddenFields={hiddenFields}
                                label="Date of Birth"
                                name="birthdate"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        className="bg-background"
                                        disabled={isDisabled(field.name)}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={hiddenFields}
                                label="Contact Number"
                                name="contact_number"
                                render={({
                                    field,
                                    fieldState: { invalid },
                                }) => (
                                    <div className="relative flex flex-1 items-center gap-x-2">
                                        <VerifiedPatchIcon
                                            className={cn(
                                                'absolute right-2 top-1/2 z-0 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                (invalid || error) &&
                                                    'text-destructive'
                                            )}
                                        />
                                        <PhoneInput
                                            {...field}
                                            className="w-full"
                                            defaultCountry="PH"
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={hiddenFields}
                                label="Occupation"
                                name="member_occupation_id"
                                render={({ field }) => {
                                    return (
                                        <MemberOccupationCombobox
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                            onChange={(occupation) => {
                                                field.onChange(occupation.id)
                                            }}
                                            placeholder="Occupation"
                                        />
                                    )
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={hiddenFields}
                                label="Business Address"
                                name="business_address"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        className="bg-background"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Business Address"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={hiddenFields}
                                label="Business Contact"
                                name="business_contact_number"
                                render={({
                                    field,
                                    fieldState: { invalid },
                                }) => (
                                    <div className="relative flex flex-1 items-center gap-x-2">
                                        <VerifiedPatchIcon
                                            className={cn(
                                                'absolute right-2 top-1/2 z-0 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                (invalid || error) &&
                                                    'text-destructive'
                                            )}
                                        />
                                        <PhoneInput
                                            {...field}
                                            className="w-full"
                                            defaultCountry="PH"
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Birth Place"
                                name="birth_place"
                                render={({ field }) => (
                                    <CountryCombobox
                                        {...field}
                                        defaultValue={field.value}
                                        onChange={(country) => {
                                            field.onChange(country?.alpha3)
                                        }}
                                        undefinable={false}
                                    />
                                )}
                            />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <p>Notes & Description</p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    hiddenFields={hiddenFields}
                                    label="Notes"
                                    name="notes"
                                    render={({ field }) => (
                                        <TextEditor
                                            {...field}
                                            content={field.value}
                                            disabled={isDisabled(field.name)}
                                            placeholder="Notes"
                                            textEditorClassName="!max-w-none bg-background"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    hiddenFields={hiddenFields}
                                    label="Description"
                                    name="description"
                                    render={({ field }) => (
                                        <TextEditor
                                            {...field}
                                            content={field.value}
                                            disabled={isDisabled(field.name)}
                                            placeholder="Description"
                                            textEditorClassName="!max-w-none bg-background"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <Separator />
                        <MemberAddressesSection
                            form={form}
                            readOnly={readOnly}
                        />
                    </div>
                </fieldset>

                <FormFooterResetSubmit
                    className="sticky bottom-4"
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={readOnly}
                    submitText="Update"
                />
            </form>
        </Form>
    )
}

const MemberAddressesSection = ({
    form,
    readOnly,
    className,
}: {
    form: UseFormReturn<TMemberProfilePersonalInfoFormValues>
    readOnly?: boolean
    className?: string
}) => {
    const { control, watch } = form

    const { append, remove } = useFieldArray({
        control,
        name: 'member_address',
    })

    const { append: removeMemberAddress } = useFieldArray({
        control,
        name: 'member_address_deleted_id',
    })

    const addresses = watch('member_addresses') ?? []

    const addAddressModalState = useModalState()

    return (
        <div className={cn('space-y-4', className)}>
            <MemberAddressCreateUpdateFormModal
                {...addAddressModalState}
                formProps={{
                    onSuccess(data) {
                        append(data)
                        addAddressModalState.onOpenChange(false)
                    },
                }}
            />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PinLocationIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                        Addresses
                        <span className="ml-2 text-xs text-muted-foreground">
                            ({addresses.length})
                        </span>
                    </p>
                </div>

                {!readOnly && (
                    <Button
                        onClick={() => addAddressModalState.onOpenChange(true)}
                        size="sm"
                        type="button"
                        variant="outline"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Address
                    </Button>
                )}
            </div>

            {addresses.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No addresses added
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {addresses.map((_, index) => (
                        <MemberAddressCard
                            form={form}
                            index={index}
                            key={index}
                            onRemove={(index, data) => {
                                remove(index)
                                if (data.id) removeMemberAddress(data.id)
                            }}
                            readOnly={readOnly}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const MemberAddressCard = ({
    form,
    index,
    readOnly,
    onRemove,
}: {
    form: UseFormReturn<TMemberProfilePersonalInfoFormValues>
    index: number
    readOnly?: boolean
    onRemove: (index: number, data: IMemberAddressRequest) => void
}) => {
    const address = form.watch(`member_addresses.${index}`)
    const memberAddressModalState = useModalState()

    if (!address) return null

    return (
        <div
            className={cn(
                'group relative cursor-pointer rounded-xl border border-border bg-card p-4 transition',
                'hover:border-primary/40'
            )}
        >
            <MemberAddressCreateUpdateFormModal
                {...memberAddressModalState}
                formProps={{
                    onSuccess(data) {
                        form.setValue(`member_addresses.${index}`, data)
                        memberAddressModalState.onOpenChange(false)
                    },
                }}
            />
            <div className="flex items-start gap-3">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                    <PinLocationIcon className="h-4 w-4 text-primary" />
                </div>

                <div className="flex-1 space-y-1">
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                        {address.label}
                    </span>

                    <p className="text-sm font-medium leading-snug">
                        {address.address || '—'}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        {[address.city, address.province_state]
                            .filter(Boolean)
                            .join(', ')}
                    </p>

                    {address.landmark && (
                        <p className="text-xs text-muted-foreground">
                            Landmark: {address.landmark}
                        </p>
                    )}
                </div>
            </div>

            {!readOnly && (
                <Button
                    className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove(index, address)
                    }}
                    size="xs"
                    type="button"
                    variant="ghost"
                >
                    <TrashIcon />
                </Button>
            )}
        </div>
    )
}

export default MemberPersonalInfoForm
