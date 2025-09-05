import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import MemberCenterCombobox from '@/modules/member-center/components/member-center-combobox'
import MemberClassificationCombobox from '@/modules/member-classification/components/member-classification-combobox'
import MemberDepartmentCombobox from '@/modules/member-department/components/member-department-combobox'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'

import GeneralStatusCombobox from '@/components/comboboxes/general-status-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { HandCoinsIcon, PieChartIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useFormHelper, useFormPreventExit } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    IMemberProfile,
    IMemberProfileMembershipInfoRequest,
    useUpdateMemberProfileMembershipInfo,
} from '../..'
import { MemberProfileMembershipInfoSchema } from '../../member-profile.validation'
import MemberPicker from '../member-picker'

type TMemberProfileMembershipInfoFormValues = z.infer<
    typeof MemberProfileMembershipInfoSchema
>

export interface IMemberProfileMembershipInfoFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberProfileMembershipInfoRequest>,
            IMemberProfile,
            Error,
            TMemberProfileMembershipInfoFormValues
        > {
    memberProfileId: TEntityId
}

const MemberMembershipForm = ({
    className,
    memberProfileId,
    ...formProps
}: IMemberProfileMembershipInfoFormProps) => {
    const form = useForm<TMemberProfileMembershipInfoFormValues>({
        resolver: standardSchemaResolver(MemberProfileMembershipInfoSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            status: 'for review',
            ...formProps.defaultValues,
        },
    })

    const {
        mutate,
        error: rawError,
        isPending,
        reset,
    } = useUpdateMemberProfileMembershipInfo({
        options: {
            ...withToastCallbacks({
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
            meta: {
                invalidates: [
                    ['member-profile'],
                    ['member-profile', memberProfileId],
                ],
            },
        },
    })

    const error = serverRequestErrExtractor({ error: rawError })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberProfileMembershipInfoFormValues>({
            form,
            ...formProps,
            autoSave: true,
        })

    useFormPreventExit({ form })

    const onSubmit = form.handleSubmit((formData) => {
        mutate(
            { memberId: memberProfileId, data: formData },
            {
                onSuccess: (data) => {
                    form.reset(data)
                    reset()
                },
            }
        )
    }, handleFocusError)

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={formProps.readOnly}
                    className="grid gap-x-6 gap-y-4"
                >
                    <div className="space-y-4">
                        <p>Membership Information</p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="passbook"
                                label="Passbook"
                                hiddenFields={formProps.hiddenFields}
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
                                hiddenFields={formProps.hiddenFields}
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
                                hiddenFields={formProps.hiddenFields}
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
                                hiddenFields={formProps.hiddenFields}
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
                                hiddenFields={formProps.hiddenFields}
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
                                hiddenFields={formProps.hiddenFields}
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
                                hiddenFields={formProps.hiddenFields}
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
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="member_department_id"
                                label="Member Department"
                                hiddenFields={formProps.hiddenFields}
                                render={({ field }) => (
                                    <MemberDepartmentCombobox
                                        {...field}
                                        placeholder="Select Department"
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected.id)
                                        }
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="recruited_by_member_profile_id"
                                label="Recruited By"
                                hiddenFields={formProps.hiddenFields}
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

                                                field.onChange(
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
                        <div className="space-y-2">
                            <p className="text-muted-foreground">Other</p>
                            <div className="grid gap-x-2 gap-y-4 sm:grid-cols-2">
                                <FormFieldWrapper
                                    name="is_mutual_fund_member"
                                    control={form.control}
                                    hiddenFields={formProps.hiddenFields}
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
                                    hiddenFields={formProps.hiddenFields}
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
                    </div>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText="Save"
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export default MemberMembershipForm
