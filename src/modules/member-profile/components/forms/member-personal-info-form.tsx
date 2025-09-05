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
                ref={formRef}
                onSubmit={form.handleSubmit(handleSubmit)}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset disabled={readOnly} className="grid gap-x-6 gap-y-4">
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <p>Photo & Signature</p>
                            <div className="grid grid-cols-2 gap-x-3">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="media_id"
                                    label="Photo"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => {
                                        const value = form.watch('media')

                                        return (
                                            <ImageField
                                                {...field}
                                                placeholder="Upload Photo"
                                                value={
                                                    value
                                                        ? (value as IMedia)
                                                              .download_url
                                                        : value
                                                }
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
                                            />
                                        )
                                    }}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="signature_media_id"
                                    label="Signature"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => {
                                        const value =
                                            form.watch('signature_media')
                                        return (
                                            <SignatureField
                                                {...field}
                                                placeholder="Signature"
                                                value={
                                                    value
                                                        ? (value as IMedia)
                                                              .download_url
                                                        : value
                                                }
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
                                    control={form.control}
                                    name="first_name"
                                    label="First Name *"
                                    className="col-span-3"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="First Name"
                                            autoComplete="given-name"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="middle_name"
                                    label="Middle Name"
                                    className="col-span-3"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Middle Name"
                                            autoComplete="additional-name"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="last_name"
                                    label="Last Name *"
                                    className="col-span-3"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Last Name"
                                            autoComplete="family-name"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="suffix"
                                    label="Suffix"
                                    className="col-span-1"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder=""
                                            autoComplete="honorific-suffix"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="civil_status"
                                label="Civil Status *"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <CivilStatusCombobox
                                        {...field}
                                        id={field.name}
                                        placeholder="Civil Status"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="member_gender_id"
                                label="Gender *"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <MemberGenderCombobox
                                        {...field}
                                        placeholder="Select Gender"
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected.id)
                                        }
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="birthdate"
                                className="relative"
                                label="Date of Birth"
                                description="mm/dd/yyyy"
                                hiddenFields={hiddenFields}
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        value={field.value ?? ''}
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="contact_number"
                                label="Contact Number"
                                hiddenFields={hiddenFields}
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
                                name="member_occupation_id"
                                label="Occupation"
                                hiddenFields={hiddenFields}
                                render={({ field }) => {
                                    return (
                                        <MemberOccupationCombobox
                                            {...field}
                                            onChange={(occupation) => {
                                                field.onChange(occupation.id)
                                            }}
                                            placeholder="Occupation"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="business_address"
                                label="Business Address"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Business Address"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="business_contact_number"
                                label="Business Contact"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Business Contact"
                                        disabled={isDisabled(field.name)}
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
                                    name="notes"
                                    label="Notes"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <TextEditor
                                            {...field}
                                            content={field.value}
                                            placeholder="Notes"
                                            textEditorClassName="!max-w-none bg-background"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="description"
                                    label="Description"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <TextEditor
                                            {...field}
                                            content={field.value}
                                            placeholder="Description"
                                            textEditorClassName="!max-w-none bg-background"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>

                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText="Update"
                    className="sticky bottom-4"
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export default MemberPersonalInfoForm
