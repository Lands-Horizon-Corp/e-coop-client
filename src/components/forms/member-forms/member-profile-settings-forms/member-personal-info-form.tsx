import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Separator } from '@/components/ui/separator'
import { SignatureLightIcon } from '@/components/icons'
import { Form, FormControl } from '@/components/ui/form'
import { AvatarUploadField } from '../../../avatar-upload-field'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { SignatureUploadField } from '../../../signature-upload-field'
import CivilStatusCombobox from '@/components/comboboxes/civil-status-combobox'
import MemberGenderCombobox from '@/components/comboboxes/member-gender-combobox'

import { cn } from '@/lib/utils'
import { memberProfilePersonalInfoSchema } from '@/validations/member/member-profile-settings-schema'
import { useUpdateMemberProfilePersonalInfo } from '@/hooks/api-hooks/member/use-member-profile-settings'

import {
    IClassProps,
    IMemberProfile,
    IMemberProfilePersonalInfoRequest,
} from '@/types'
import { IForm, TEntityId } from '@/types'

type TMemberProfilePersonalInfoFormValues = z.infer<
    typeof memberProfilePersonalInfoSchema
>

export interface IMemberProfilePersonalInfoFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberProfilePersonalInfoRequest>,
            IMemberProfile,
            string,
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
        resolver: zodResolver(memberProfilePersonalInfoSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const { mutate, error, isPending } = useUpdateMemberProfilePersonalInfo({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((formData) => {
        mutate({ memberId: memberProfileId, data: formData })
    })

    const isDisabled = (field: Path<TMemberProfilePersonalInfoFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset disabled={readOnly} className="grid gap-x-6 gap-y-4">
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <p>Photo & Signature</p>
                            <div className="grid grid-cols-1 gap-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="media_id"
                                    label="Photo"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <FormControl>
                                            <AvatarUploadField
                                                placeholder="Upload Person Picture"
                                                description="Upload Member Picture/Photo"
                                                {...field}
                                                mediaImage={form.getValues(
                                                    'media'
                                                )}
                                                onChange={(mediaUploaded) => {
                                                    field.onChange(
                                                        mediaUploaded?.id
                                                    )
                                                    form.setValue(
                                                        'media',
                                                        mediaUploaded
                                                    )
                                                }}
                                            />
                                        </FormControl>
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="signature_media_id"
                                    label="Signature"
                                    hiddenFields={hiddenFields}
                                    render={({ field }) => (
                                        <FormControl>
                                            <SignatureUploadField
                                                placeholder="Upload Signature Photo"
                                                {...field}
                                                mediaImage={form.getValues(
                                                    'signature_media'
                                                )}
                                                DisplayIcon={SignatureLightIcon}
                                                onChange={(mediaUploaded) => {
                                                    field.onChange(
                                                        mediaUploaded?.id
                                                    )
                                                    form.setValue(
                                                        'signature_media',
                                                        mediaUploaded
                                                    )
                                                }}
                                            />
                                        </FormControl>
                                    )}
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
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="birth_date"
                                label="Date of Birth"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        type="date"
                                        {...field}
                                        className="block [&::-webkit-calendar-picker-indicator]:hidden"
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
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Contact Number"
                                        autoComplete="tel"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="occupation_id"
                                label="Occupation"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Occupation"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
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
                                name="business_contact"
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
                {form.formState.isDirty && (
                    <div className="space-y-2">
                        <Separator className="my-2 sm:my-4" />
                        <FormErrorMessage errorMessage={error} />
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={() => form.reset()}
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                disabled={isPending}
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                {isPending ? <LoadingSpinner /> : 'Update'}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    )
}

export default MemberPersonalInfoForm
