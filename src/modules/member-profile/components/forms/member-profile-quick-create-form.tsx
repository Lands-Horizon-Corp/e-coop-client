import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/modules/authentication/components/value-checklist-indicator'
import MemberGenderCombobox from '@/modules/member-gender/components/member-gender-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { HandCoinsIcon, PieChartIcon } from 'lucide-react'

import CivilStatusCombobox from '@/components/comboboxes/civil-status-combobox'
import GeneralStatusCombobox from '@/components/comboboxes/general-status-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { VerifiedPatchIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormItem } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import PasswordInput from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { IMemberProfile } from '../..'
import { useQuickCreateMemberProfile } from '../../member-profile.service'
import { QuickCreateMemberProfileSchema } from '../../member-profile.validation'

type TMemberProfileQuickFormValues = z.infer<
    typeof QuickCreateMemberProfileSchema
>

export interface IMemberProfileQuickCreateFormProps
    extends IClassProps,
        IForm<Partial<TMemberProfileQuickFormValues>, IMemberProfile> {}

const MemberProfileQuickCreateForm = ({
    className,
    ...formProps
}: IMemberProfileQuickCreateFormProps) => {
    const form = useForm<TMemberProfileQuickFormValues>({
        resolver: standardSchemaResolver(QuickCreateMemberProfileSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            first_name: '',
            last_name: '',
            status: 'for review',
            civil_status: 'single',
            is_mutual_fund_member: false,
            is_micro_finance_member: false,
            create_new_user: false,
            ...formProps.defaultValues,
            birthdate: toInputDateString(
                formProps.defaultValues?.birthdate ?? new Date()
            ),
        },
    })

    const {
        mutate,
        error: rawError,
        isPending,
        reset,
    } = useQuickCreateMemberProfile({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
            meta: {
                invalidates: [['member-profile']],
            },
        },
    })

    const error = serverRequestErrExtractor({ error: rawError })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberProfileQuickFormValues>({
            form,
            ...formProps,
            autoSave: false,
            preventExitOnDirty: true,
        })

    const onSubmit = form.handleSubmit((formData) => {
        mutate(
            {
                ...formData,
                full_name: `${formData.first_name ?? ''} ${formData.middle_name ?? ''} ${formData.last_name ?? ''} ${formData.suffix ?? ''}`,
            },
            { onSuccess: (data) => form.reset(data) }
        )
    }, handleFocusError)

    const createNewUser = form.watch('create_new_user')

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Membership Information
                        </p>
                        <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                label="Member Type"
                                name="member_type_id"
                                render={({ field }) => (
                                    <MemberTypeCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected?.id)
                                        }
                                        placeholder="Select Member Type"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                label="Member Profile Status"
                                name="status"
                                render={({ field }) => (
                                    <GeneralStatusCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Status"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                label="Passbook"
                                name="passbook"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Passbook"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                label="Old Passbook (optional)"
                                name="old_reference_id"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Old Passbook/Old Reference ID"
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Personal Information
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-10">
                            <FormFieldWrapper
                                className="col-span-3"
                                control={form.control}
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
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
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
                                label="Date of Birth *"
                                name="birthdate"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Contact Number"
                                name="contact_number"
                                render={({
                                    field,
                                    fieldState: { invalid, error },
                                }) => (
                                    <div className="relative flex flex-1 items-center gap-x-2">
                                        <VerifiedPatchIcon
                                            className={cn(
                                                'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
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
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <p className="text-muted-foreground">Other</p>
                        <div className="grid gap-x-2 gap-y-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                name="is_mutual_fund_member"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            aria-describedby={`${field.name}`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <PieChartIcon />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Mutual Fund Member
                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}`}
                                                >
                                                    Contributes to a pooled
                                                    investment (mutual fund).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                name="is_micro_finance_member"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            aria-describedby={`${field.name}`}
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <HandCoinsIcon />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Micro Finance Member
                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`${field.name}`}
                                                >
                                                    Participates in small-scale
                                                    financial services.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </fieldset>

                <Separator />

                <fieldset
                    className="space-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="create_new_user"
                        render={({ field }) => (
                            <div className="inline-flex items-start gap-x-4">
                                <Switch
                                    aria-label="Toggle switch"
                                    checked={field.value}
                                    id={field.name}
                                    onCheckedChange={field.onChange}
                                />
                                <Label
                                    className="cursor-pointer space-y-2 text-sm font-medium"
                                    htmlFor={field.name}
                                >
                                    <p>Create User Account</p>
                                    <p className="text-xs text-muted-foreground/80">
                                        Turn on to let this member log in with a
                                        username and password. Leave off to just
                                        create a profile without login access
                                    </p>
                                </Label>
                            </div>
                        )}
                    />

                    {createNewUser && (
                        <>
                            <p>New Account</p>
                            <FormFieldWrapper
                                control={form.control}
                                name="new_user_info.user_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="username"
                                        id={field.name}
                                        placeholder="Username"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="new_user_info.email"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="email"
                                        id={field.name}
                                        placeholder="example@email.com"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="new_user_info.password"
                                render={({ field }) => (
                                    <FormItem>
                                        <PasswordInput
                                            {...field}
                                            autoComplete="new-password"
                                            defaultVisibility
                                            id={field.name}
                                            placeholder="+8 Character Password"
                                        />
                                        <ValueChecklistMeter
                                            checkList={ChecklistTemplate[
                                                'password-checklist'
                                            ].concat([
                                                {
                                                    regex: /^.{0,50}$/,
                                                    text: 'No more than 50 characters',
                                                },
                                            ])}
                                            hideOnComplete
                                            value={field.value}
                                        />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </fieldset>

                <span className="mt-4 text-center text-xs text-muted-foreground/50">
                    You can setup other member profile information later after
                    creation
                </span>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Create"
                />
            </form>
        </Form>
    )
}

export const MemberProfileQuickCreateFormModal = ({
    title = 'Quick Create Member Profile',
    description = 'Fill out the form to quickly create a member profile.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberProfileQuickCreateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-4xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberProfileQuickCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberProfileQuickCreateForm
