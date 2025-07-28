import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { toInputDateString } from '@/utils'
import { HandCoinsIcon, PieChartIcon } from 'lucide-react'
import { Path, useForm } from 'react-hook-form'

import CivilStatusCombobox from '@/components/comboboxes/civil-status-combobox'
import GeneralStatusCombobox from '@/components/comboboxes/general-status-combobox'
import MemberGenderCombobox from '@/components/comboboxes/member-gender-combobox'
import MemberTypeCombobox from '@/components/comboboxes/member-type-combobox'
import { PhoneInput } from '@/components/contact-input/contact-input'
import { VerifiedPatchIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormItem } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import PasswordInput from '@/components/ui/password-input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/components/value-checklist-indicator'

import { cn } from '@/lib/utils'

import { quickCreateMemberProfileSchema } from '@/validations/member/member-profile-schema'

import { useQuickCreateMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

import { IClassProps, IForm, IMemberProfile } from '@/types'

type TMemberProfileQuickFormValues = z.infer<
    typeof quickCreateMemberProfileSchema
>

export interface IMemberProfileQuickCreateFormProps
    extends IClassProps,
        IForm<Partial<TMemberProfileQuickFormValues>, IMemberProfile, string> {}

const MemberProfileQuickCreateForm = ({
    readOnly,
    className,
    hiddenFields,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberProfileQuickCreateFormProps) => {
    const form = useForm<TMemberProfileQuickFormValues>({
        resolver: zodResolver(quickCreateMemberProfileSchema),
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
            ...defaultValues,
            birthdate: toInputDateString(
                defaultValues?.birthdate ?? new Date()
            ),
        },
    })

    const {
        mutate,
        error,
        isPending,
        reset: reset,
    } = useQuickCreateMemberProfile({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((formData) => {
        mutate(
            {
                ...formData,
                full_name: `${formData.first_name ?? ''} ${formData.middle_name ?? ''} ${formData.last_name ?? ''} ${formData.suffix ?? ''}`,
            },
            { onSuccess: (data) => form.reset(data) }
        )
    })

    const createNewUser = form.watch('create_new_user')

    const isDisabled = (field: Path<TMemberProfileQuickFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4"
                >
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Membership Information
                        </p>
                        <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="member_type_id"
                                label="Member Type *"
                                className="col-span-1"
                                render={({ field }) => (
                                    <MemberTypeCombobox
                                        {...field}
                                        placeholder="Select Member Type"
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected.id)
                                        }
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="status"
                                label="Member Profile Status"
                                className="col-span-1"
                                render={({ field }) => (
                                    <GeneralStatusCombobox
                                        {...field}
                                        placeholder="Status"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="passbook"
                                label="Passbook"
                                className="col-span-1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Passbook"
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="old_reference_id"
                                label="Old Passbook (optional)"
                                className="col-span-1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Old Passbook/Old Reference ID"
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
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
                                control={form.control}
                                name="first_name"
                                label="First Name *"
                                className="col-span-3"
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
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="civil_status"
                                label="Civil Status *"
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
                                label="Date of Birth *"
                                className="relative"
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="contact_number"
                                label="Contact Number"
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
                                name="is_mutual_fund_member"
                                control={form.control}
                                hiddenFields={hiddenFields}
                                className="col-span-1"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}`}
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
                                                    id={`${field.name}`}
                                                    className="text-xs text-muted-foreground"
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
                                name="is_micro_finance_member"
                                control={form.control}
                                hiddenFields={hiddenFields}
                                className="col-span-1"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            id={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}`}
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
                                                    id={`${field.name}`}
                                                    className="text-xs text-muted-foreground"
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
                    disabled={isPending || readOnly}
                    className="space-y-4"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="create_new_user"
                        render={({ field }) => (
                            <div className="inline-flex items-start gap-x-4">
                                <Switch
                                    id={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-label="Toggle switch"
                                />
                                <Label
                                    htmlFor={field.name}
                                    className="cursor-pointer space-y-2 text-sm font-medium"
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
                                        id={field.name}
                                        autoComplete="username"
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
                                        id={field.name}
                                        autoComplete="email"
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
                                            id={field.name}
                                            defaultVisibility
                                            placeholder="+8 Character Password"
                                            autoComplete="new-password"
                                        />
                                        <ValueChecklistMeter
                                            value={field.value}
                                            hideOnComplete
                                            checkList={ChecklistTemplate[
                                                'password-checklist'
                                            ].concat([
                                                {
                                                    regex: /^.{0,50}$/,
                                                    text: 'No more than 50 characters',
                                                },
                                            ])}
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
                <Separator className="my-2 sm:my-4" />
                <div className="space-y-2">
                    <FormErrorMessage errorMessage={error} />
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
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? <LoadingSpinner /> : 'Create'}
                        </Button>
                    </div>
                </div>
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
            title={title}
            description={description}
            className={cn('!max-w-4xl', className)}
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
