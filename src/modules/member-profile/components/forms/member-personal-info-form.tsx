import { useCallback } from 'react'

import { Path, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IMedia } from '@/modules/media'
import MemberGenderCombobox from '@/modules/member-gender/components/member-gender-combobox'
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'

import CivilStatusCombobox from '@/components/comboboxes/civil-status-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { VerifiedPatchIcon } from '@/components/icons'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { PhoneInput } from '@/components/ui/phone-input'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'

import { useFormHelper } from '@/hooks/use-form-helper'

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
    extends IClassProps,
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
                                                    if (newImage)
                                                        field.onChange(
                                                            newImage.id
                                                        )
                                                    else
                                                        field.onChange(
                                                            undefined
                                                        )

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
                                                    if (newImage)
                                                        field.onChange(
                                                            newImage.id
                                                        )
                                                    else
                                                        field.onChange(
                                                            undefined
                                                        )

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
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            placeholder=""
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Business Contact"
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
                    </div>
                </fieldset>

                <FormFooterResetSubmit
                    className="sticky bottom-4"
                    disableSubmit={!form.formState.isDirty}
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

export default MemberPersonalInfoForm
