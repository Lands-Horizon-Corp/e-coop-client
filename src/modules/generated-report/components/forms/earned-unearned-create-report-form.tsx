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
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
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

export const EarnedUnearnedSchema = z
    .object({
        from_date: stringDateWithTransformSchema,
        to_date: stringDateWithTransformSchema,
        as_of_date: stringDateWithTransformSchema,

        display_terms: z.enum(['by_months', 'by_days']).default('by_months'),
        report_type: z.enum(['monthly', 'daily']).default('monthly'),

        beginning_balance: z.boolean().default(false),

        loan_type: z
            .enum(['personal', 'jewelry', 'grocery', 'all'])
            .default('all'),

        groupings: z
            .enum([
                'no_group',
                'by_account',
                'by_category',
                'by_barangay',
                'by_occupation',
                'by_group',
                'by_area',
            ])
            .default('no_group'),

        account_id: entityIdSchema.optional(),
        account: z.any().optional(),

        barangay: z.string().optional(),
        member_occupation_id: entityIdSchema.optional(),
        member_address_area_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),
    })
    .and(WithGeneratedReportSchema)

export type TEarnedUnearnedSchema = z.infer<typeof EarnedUnearnedSchema>

export interface IEarnedUnearnedFormProps
    extends
        IClassProps,
        IForm<
            Partial<TEarnedUnearnedSchema>,
            IGeneratedReport,
            Error,
            TEarnedUnearnedSchema
        > {}

const EarnedUnearnedCreateReportForm = ({
    className,
    ...formProps
}: IEarnedUnearnedFormProps) => {
    const form = useForm<TEarnedUnearnedSchema>({
        resolver: standardSchemaResolver(EarnedUnearnedSchema),
        defaultValues: {
            from_date: undefined,
            to_date: undefined,
            as_of_date: undefined,

            display_terms: 'by_months',
            report_type: 'monthly',

            beginning_balance: false,

            loan_type: 'all',
            groupings: 'no_group',

            account_id: undefined,
            account: undefined,

            barangay: '',
            member_occupation_id: undefined,
            member_address_area_id: undefined,
            member_group_id: undefined,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `earned_unearned_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}.pdf`,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } = useFormHelper<TEarnedUnearnedSchema>({
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
                    <div className="grid grid-cols-3 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="From Date"
                            name="from_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="To Date"
                            name="to_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="As Of Date"
                            name="as_of_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        name="beginning_balance"
                        render={({ field }) => {
                            const checked = field.value
                            return (
                                <label
                                    className={cn(
                                        'flex items-start justify-between gap-3 rounded-xl border p-4 cursor-pointer transition-all',
                                        checked &&
                                            'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                    )}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium">
                                            Beginning Balance
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Include beginning balance in the
                                            computation of earned and unearned
                                            amounts.
                                        </span>
                                    </div>
                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={(v) =>
                                            field.onChange(!!v)
                                        }
                                    />
                                </label>
                            )
                        }}
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Loan Type"
                            name="loan_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'personal',
                                            label: 'Personal',
                                        },
                                        { value: 'jewelry', label: 'Jewelry' },
                                        { value: 'grocery', label: 'Grocery' },
                                        { value: 'all', label: 'All' },
                                    ].map((opt) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={opt.value}
                                        >
                                            <RadioGroupItem value={opt.value} />
                                            <span>{opt.label}</span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Display Terms"
                            name="display_terms"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-1 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'by_months',
                                            label: 'By Months',
                                        },
                                        {
                                            value: 'by_days',
                                            label: 'By Days',
                                        },
                                    ].map((opt) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={opt.value}
                                        >
                                            <RadioGroupItem value={opt.value} />
                                            <span>{opt.label}</span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Report Type"
                            name="report_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-1 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'monthly',
                                            label: 'Monthly',
                                        },
                                        {
                                            value: 'daily',
                                            label: 'Daily',
                                        },
                                    ].map((opt) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={opt.value}
                                        >
                                            <RadioGroupItem value={opt.value} />
                                            <span>{opt.label}</span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>
                    <FormFieldWrapper
                        control={form.control}
                        label="Groupings"
                        name="groupings"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'no_group', label: 'No Group' },
                                    {
                                        value: 'by_account',
                                        label: 'By Account',
                                    },
                                    {
                                        value: 'by_category',
                                        label: 'By Category',
                                    },
                                    {
                                        value: 'by_barangay',
                                        label: 'By Barangay',
                                    },
                                    {
                                        value: 'by_occupation',
                                        label: 'By Occupation',
                                    },
                                    { value: 'by_group', label: 'By Group' },
                                    { value: 'by_area', label: 'By Area' },
                                ].map((opt) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={opt.value}
                                    >
                                        <RadioGroupItem value={opt.value} />
                                        <span>{opt.label}</span>
                                    </label>
                                ))}
                            </RadioGroup>
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
                                mode="all"
                                onSelect={(v) => {
                                    field.onChange(v?.id)
                                    form.setValue('account', v)
                                }}
                                placeholder="All Account"
                                triggerClassName="!w-full !min-w-0 flex-1"
                                value={form.getValues('account')}
                            />
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Barangay"
                            name="barangay"
                            render={({ field }) => (
                                // TODO: Add barangay
                                <Input {...field} placeholder="All" />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Occupation"
                            name="member_occupation_id"
                            render={({ field }) => (
                                <MemberOccupationCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Area"
                            name="member_address_area_id"
                            render={({ field }) => (
                                <AreaCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
                                    undefinable
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
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
                                    undefinable
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

export const EarnedUnearnedCreateReportFormModal = ({
    title = 'Earned / Unearned',
    description = 'Generate earned and unearned report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IEarnedUnearnedFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('sm:max-w-4xl', className)}
            description={description}
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <EarnedUnearnedCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
