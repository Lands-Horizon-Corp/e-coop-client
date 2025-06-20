import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import MemberPicker from '@/components/pickers/member-picker'
import { HandCoinsIcon, PieChartIcon } from '@/components/icons'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import MemberTypeCombobox from '@/components/comboboxes/member-type-combobox'
import MemberGroupCombobox from '@/components/comboboxes/member-group-combobox'
import MemberCenterCombobox from '@/components/comboboxes/member-center-combobox'
import GeneralStatusCombobox from '@/components/comboboxes/general-status-combobox'
import MemberClassificationCombobox from '@/components/comboboxes/member-classification-combobox'

import { cn } from '@/lib/utils'
import { memberProfileMembershipInfoSchema } from '@/validations/member/member-profile-settings-schema'
import { useUpdateMemberProfileMembershipInfo } from '@/hooks/api-hooks/member/use-member-profile-settings'

import {
    IForm,
    TEntityId,
    IClassProps,
    IMemberProfile,
    IMemberProfileMembershipInfoRequest,
} from '@/types'
import { toast } from 'sonner'

type TMemberProfileMembershipInfoFormValues = z.infer<
    typeof memberProfileMembershipInfoSchema
>

export interface IMemberProfileMembershipInfoFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberProfileMembershipInfoRequest>,
            IMemberProfile,
            string,
            TMemberProfileMembershipInfoFormValues
        > {
    memberProfileId: TEntityId
}

const MemberMembershipForm = ({
    readOnly,
    className,
    hiddenFields,
    defaultValues,
    disabledFields,
    memberProfileId,
    onError,
    onSuccess,
}: IMemberProfileMembershipInfoFormProps) => {
    const form = useForm<TMemberProfileMembershipInfoFormValues>({
        resolver: zodResolver(memberProfileMembershipInfoSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            status: 'for review',
            ...defaultValues,
        },
    })

    const { mutate, error, isPending } = useUpdateMemberProfileMembershipInfo({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((formData) => {
        mutate({ memberId: memberProfileId, data: formData })
    })

    const isDisabled = (field: Path<TMemberProfileMembershipInfoFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset disabled={readOnly} className="grid gap-x-6 gap-y-4">
                    <div className="space-y-4">
                        <p>Membership Information</p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="passbook"
                                label="Passbook"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Passbook"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="old_reference_id"
                                label="Old Reference ID"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Old Reference ID"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="status"
                                label="Status"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <GeneralStatusCombobox
                                        {...field}
                                        placeholder="Select Status"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="member_type_id"
                                label="Member Type"
                                hiddenFields={hiddenFields}
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
                                name="member_group_id"
                                label="Member Group"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <MemberGroupCombobox
                                        {...field}
                                        placeholder="Select Member Group"
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected.id)
                                        }
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="member_classification_id"
                                label="Member Classification"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <MemberClassificationCombobox
                                        {...field}
                                        placeholder="Select Classification"
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected.id)
                                        }
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="member_center_id"
                                label="Member Center"
                                hiddenFields={hiddenFields}
                                render={({ field }) => (
                                    <MemberCenterCombobox
                                        {...field}
                                        placeholder="Select Center"
                                        disabled={isDisabled(field.name)}
                                        onChange={(memberCenter) =>
                                            field.onChange(memberCenter.id)
                                        }
                                    />
                                )}
                            />
                        </div>
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
                                                        investment.
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
                                                        Participates in
                                                        small-scale financial
                                                        services.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="recruited_by_member_profile_id"
                                label="Recruited By"
                                hiddenFields={hiddenFields}
                                render={({ field }) => {
                                    const value = form.getValues(
                                        'recruited_by_member_profile'
                                    )

                                    return (
                                        <MemberPicker
                                            value={value}
                                            onSelect={(memberProfile) => {
                                                if (
                                                    memberProfile &&
                                                    memberProfile.id ===
                                                        memberProfileId
                                                )
                                                    return toast.warning(
                                                        'Member cannot invite itself'
                                                    )

                                                form.setValue(
                                                    'recruited_by_member_profile_id',
                                                    memberProfile !== undefined
                                                        ? memberProfile.id
                                                        : memberProfile
                                                )

                                                if (memberProfile !== undefined)
                                                    form.setValue(
                                                        'recruited_by_member_profile',
                                                        memberProfile
                                                    )
                                            }}
                                            placeholder="Select Recruiter"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )
                                }}
                            />
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

export default MemberMembershipForm
