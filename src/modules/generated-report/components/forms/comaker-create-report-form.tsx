import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import AreaCombobox from '@/modules/area/components/area-combobox'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const ComakerReportSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        group_by: z
            .enum([
                'member_type',
                'occupation',
                'group',
                'barangay',
                'area',
                'no_group',
            ])
            .default('no_group'),

        sort_by: z
            .enum(['by_passbook_no', 'by_name'])
            .default('by_passbook_no'),

        include: z.enum(['comaker', 'collateral', 'all']).default('all'),

        member_type_id: z.string().optional(),
        account: z.any().optional(), // for UI only
        account_id: z.string().optional(),
        barangay: z.string().optional(),
        member_occupation_id: z.string().optional(),
        member_area_id: z.string().optional(),
        member_group_id: z.string().optional(),
    })
    .and(WithGeneratedReportSchema)
    .superRefine((data, ctx) => {
        if (
            data.start_date &&
            data.end_date &&
            data.start_date > data.end_date
        ) {
            ctx.addIssue({
                code: 'custom',
                message: 'Start Date must not be after End Date',
                path: ['start_date'],
            })
            ctx.addIssue({
                code: 'custom',
                message: 'End Date must not be before Start Date',
                path: ['end_date'],
            })
        }
    })

export type TComakerReportSchema = z.infer<typeof ComakerReportSchema>

export interface IComakerReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TComakerReportSchema>,
            IGeneratedReport,
            Error,
            TComakerReportSchema
        > {}

const ComakerReportCreateForm = ({
    className,
    ...formProps
}: IComakerReportFormProps) => {
    const form = useForm<TComakerReportSchema>({
        resolver: standardSchemaResolver(ComakerReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            start_date: undefined,
            end_date: undefined,
            group_by: 'no_group',
            sort_by: 'by_passbook_no',
            include: 'all',
            barangay: 'ALL',
            ...formProps.defaultValues,
            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'Account',
                name: `comaker_${toReadableDate(new Date(), 'MMddyy_mmss')}.pdf`,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TComakerReportSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(({ report_config, ...filters }) => {
        generateMutation.mutate({
            ...report_config,
            generated_report_type: 'pdf',
            filters,
        })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = generateMutation
    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date *"
                            name="start_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="End Date *"
                            name="end_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Group By"
                        name="group_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'member_type',
                                        label: 'Member Type',
                                    },
                                    {
                                        value: 'occupation',
                                        label: 'Occupation',
                                    },
                                    { value: 'group', label: 'Group' },
                                    { value: 'barangay', label: 'Barangay' },
                                    { value: 'area', label: 'Area' },
                                    { value: 'no_group', label: 'No Group' },
                                ].map((opt) => (
                                    <label
                                        className="flex items-center text-sm gap-2"
                                        key={opt.value}
                                    >
                                        <RadioGroupItem value={opt.value} />
                                        {opt.label}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Sort By"
                        name="sort_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'by_passbook_no',
                                        label: 'By Passbook No',
                                    },
                                    { value: 'by_name', label: 'By Name' },
                                ].map((opt) => (
                                    <label
                                        className="flex items-center text-sm gap-2"
                                        key={opt.value}
                                    >
                                        <RadioGroupItem value={opt.value} />
                                        {opt.label}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Include"
                        name="include"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'comaker', label: 'Comaker' },
                                    {
                                        value: 'collateral',
                                        label: 'Collateral',
                                    },
                                    { value: 'all', label: 'All' },
                                ].map((opt) => (
                                    <label
                                        className="flex items-center text-sm gap-2"
                                        key={opt.value}
                                    >
                                        <RadioGroupItem value={opt.value} />
                                        {opt.label}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Member Type"
                            name="member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    {...field}
                                    onChange={(selected) =>
                                        field.onChange(selected?.id)
                                    }
                                    placeholder="All member type"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Account"
                            name="account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    {...field}
                                    allowClear
                                    hideDescription
                                    mode="all"
                                    onSelect={(account) => {
                                        field.onChange(account?.id)
                                        form.setValue('account', account)
                                    }}
                                    placeholder="All Account"
                                    value={form.watch('account')}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Barangay"
                            name="barangay"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Occupation"
                            name="member_occupation_id"
                            render={({ field }) => (
                                <MemberOccupationCombobox
                                    {...field}
                                    onChange={(selected) =>
                                        field.onChange(selected?.id)
                                    }
                                    placeholder="All occupation"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Area"
                            name="member_area_id"
                            render={({ field }) => (
                                <AreaCombobox
                                    {...field}
                                    onChange={(selected) =>
                                        field.onChange(selected?.id)
                                    }
                                    placeholder="All area"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Group"
                            name="member_group_id"
                            render={({ field }) => (
                                <MemberGroupCombobox
                                    {...field}
                                    onChange={(selected) =>
                                        field.onChange(selected?.id)
                                    }
                                    placeholder="All group"
                                />
                            )}
                        />
                    </div>

                    <Separator />
                    <PrintSettingsSection
                        displayMode="dropdown"
                        form={
                            form as unknown as UseFormReturn<TWithReportConfigSchema>
                        }
                    />
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset(formProps.defaultValues)
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Generate"
                />
            </form>
        </Form>
    )
}

export default ComakerReportCreateForm

export const ComakerReportCreateFormModal = ({
    title = 'Create Comaker Report',
    description = 'Define filters and configuration for Comaker report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IComakerReportFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('sm:max-w-xl', className)}
            description={description}
            title={title}
            {...props}
            onOpenChange={onOpenChange}
            open={open}
        >
            <ComakerReportCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
