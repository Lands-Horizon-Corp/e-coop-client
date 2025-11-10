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
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4"
                    disabled={formProps.readOnly}
                >
                    <div className="space-y-4">
                        <p>Membership Information</p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                label="Passbook"
                                name="passbook"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Passbook"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                label="Old Reference ID"
                                name="old_reference_id"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Old Reference ID"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                label="Status"
                                name="status"
                                render={({ field }) => (
                                    <GeneralStatusCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Select Status"
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
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
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                label="Member Group"
                                name="member_group_id"
                                render={({ field }) => (
                                    <MemberGroupCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected.id)
                                        }
                                        placeholder="Select Member Group"
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                label="Member Classification"
                                name="member_classification_id"
                                render={({ field }) => (
                                    <MemberClassificationCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected.id)
                                        }
                                        placeholder="Select Classification"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                label="Member Center"
                                name="member_center_id"
                                render={({ field }) => (
                                    <MemberCenterCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(memberCenter) =>
                                            field.onChange(memberCenter.id)
                                        }
                                        placeholder="Select Center"
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                label="Member Department"
                                name="member_department_id"
                                render={({ field }) => (
                                    <MemberDepartmentCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(selected) =>
                                            field.onChange(selected.id)
                                        }
                                        placeholder="Select Department"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={formProps.hiddenFields}
                                label="Recruited By"
                                name="recruited_by_member_profile_id"
                                render={({ field }) => {
                                    const value = form.getValues(
                                        'recruited_by_member_profile'
                                    )

                                    return (
                                        <MemberPicker
                                            disabled={isDisabled(field.name)}
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
                                            value={value}
                                        />
                                    )
                                }}
                            />
                        </div>
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
                                                        investment.
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
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Save"
                />
            </form>
        </Form>
    )
}

export default MemberMembershipForm
