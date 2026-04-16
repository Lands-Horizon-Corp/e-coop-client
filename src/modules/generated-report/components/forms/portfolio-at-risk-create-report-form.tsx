import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { AccountCategoryComboBox } from '@/modules/account-category'
import { AccountMultiPickerModal } from '@/modules/account/components/picker/account-multi-picker'
import AreaCombobox from '@/modules/area/components/area-combobox'
import EmployeePicker from '@/modules/employee/components/employee-picker'
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
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    CalendarNumberIcon,
    SwitchArrowIcon,
    TrashIcon,
    XIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const PortfolioAtRiskSchema = z
    .object({
        as_of_date: stringDateWithTransformSchema,

        over_12_mos_format: z.boolean().default(false),
        fail_to_current_if_1_30_days_only: z.boolean().default(false),
        investment: z.boolean().default(false),

        exclude_account_ids: z.array(entityIdSchema).default([]),
        exclude_accounts: z.array(z.any()).default([]),

        loan_balance_amount_ranges: z
            .array(
                z.object({
                    from: z.number(),
                    to: z.number(),
                })
            )
            .optional()
            .default([]),

        terms_action: z
            .array(
                z.object({
                    from: z.number(),
                    to: z.number(),
                })
            )
            .optional()
            .default([]),

        filter_by_date_release_from: stringDateWithTransformSchema,
        filter_by_date_release_to: stringDateWithTransformSchema,

        current_cmkr_colla_amount: z.boolean().default(false),
        current_no_exposed_amt: z.boolean().default(false),
        renewal_only: z.boolean().default(false),

        filter_by_amount_granted_from: z.number().default(0),
        filter_by_amount_granted_to: z.number().default(0),

        exclude_litigation: z.boolean().default(false),
        exclude_zero_expose_amount: z.boolean().default(false),
        current_if_interest_paid: z.boolean().default(false),

        filter_by_dq_mos: z.number().default(0),
        filter_by_mos_length: z.number().default(0),

        loan_amount_type: z
            .enum(['loan_balance', 'arrears', 'arrears_distributed'])
            .default('loan_balance'),

        include_excluded_account: z
            .enum(['no', 'current', 'aging'])
            .default('no'),

        include_amount: z
            .enum(['all', 'delinquent', 'non_delinquent', 'migs'])
            .default('all'),

        groupings: z
            .enum([
                'no_group',
                'by_barangay',
                'by_sex',
                'group',
                'by_account',
                'by_occupation',
                'area',
                'loan_bal',
                'terms',
                'by_purpose',
            ])
            .default('no_group'),

        filtered_by: z
            .enum(['by_amortization', 'by_maturity'])
            .default('by_amortization'),

        print_type: z.enum(['summary', 'detail']).default('summary'),

        report_type: z.enum(['all', 'non_dosri', 'dosri']).default('all'),

        sex: z.enum(['all', 'male', 'female']).default('all'),

        paper_type: z.enum(['standard', 'continous']).default('standard'),
        include_share_cap: z.boolean().default(false),

        account_id: entityIdSchema.optional(),
        account: z.any().optional(),

        barangay: z.string().optional(),
        member_occupation_id: entityIdSchema.optional(),
        member_address_area_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),
        account_category_id: entityIdSchema.optional(),

        collector_id: entityIdSchema.optional(),
        collector: z.any().optional(),
    })
    .and(WithGeneratedReportSchema)

export type TPortfolioAtRiskSchema = z.infer<typeof PortfolioAtRiskSchema>

export interface IPortfolioAtRiskFormProps
    extends
        IClassProps,
        IForm<
            Partial<TPortfolioAtRiskSchema>,
            IGeneratedReport,
            Error,
            TPortfolioAtRiskSchema
        > {}

const PortfolioAtRiskCreateReportForm = ({
    className,
    ...formProps
}: IPortfolioAtRiskFormProps) => {
    const form = useForm<TPortfolioAtRiskSchema>({
        resolver: standardSchemaResolver(PortfolioAtRiskSchema),
        defaultValues: {
            as_of_date: undefined,

            over_12_mos_format: false,
            fail_to_current_if_1_30_days_only: false,
            investment: false,

            exclude_account_ids: [],
            exclude_accounts: [],

            loan_balance_amount_ranges: [],
            terms_action: [],

            filter_by_date_release_from: undefined,
            filter_by_date_release_to: undefined,

            current_cmkr_colla_amount: false,
            current_no_exposed_amt: false,
            renewal_only: false,

            filter_by_amount_granted_from: 0,
            filter_by_amount_granted_to: 0,

            exclude_litigation: false,
            exclude_zero_expose_amount: false,
            current_if_interest_paid: false,

            filter_by_dq_mos: 0,
            filter_by_mos_length: 0,

            loan_amount_type: 'loan_balance',
            include_excluded_account: 'no',
            include_amount: 'all',

            groupings: 'no_group',
            filtered_by: 'by_amortization',

            print_type: 'summary',
            report_type: 'all',

            sex: 'all',
            paper_type: 'standard',
            include_share_cap: false,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `portfolio_at_risk_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TPortfolioAtRiskSchema>(
        {
            form,
            ...formProps,
        }
    )

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
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <div className="space-y-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="As Of Date"
                                name="as_of_date"
                                render={({ field }) => <InputDate {...field} />}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="From"
                                    name="filter_by_date_release_from"
                                    render={({ field }) => (
                                        <InputDate {...field} />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="To"
                                    name="filter_by_date_release_to"
                                    render={({ field }) => (
                                        <InputDate {...field} />
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="exclude_accounts"
                                    render={({ field }) => (
                                        <AccountMultiPickerModal
                                            pickerProps={{
                                                defaultSelected: field.value,
                                                onConfirm: (val) =>
                                                    field.onChange(val),
                                            }}
                                            trigger={
                                                <Button
                                                    className="w-full"
                                                    type="button"
                                                    variant="outline"
                                                >
                                                    Exclude Accounts (
                                                    {field.value?.length || 0})
                                                </Button>
                                            }
                                        />
                                    )}
                                />
                                <LoanBalanceAmountRangesSection
                                    form={form}
                                    trigger={
                                        <Button
                                            className="w-full"
                                            type="button"
                                            variant="outline"
                                        >
                                            <SwitchArrowIcon />
                                            Balance Ranges
                                        </Button>
                                    }
                                />
                                <TermsActionSection
                                    form={form}
                                    trigger={
                                        <Button
                                            className="w-full"
                                            type="button"
                                            variant="outline"
                                        >
                                            <CalendarNumberIcon /> Terms Action
                                        </Button>
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2">
                                {[
                                    {
                                        key: 'over_12_mos_format',
                                        label: 'Over 12 Mos Format',
                                    },
                                    {
                                        key: 'fail_to_current_if_1_30_days_only',
                                        label: 'Fail to Current (1–30 Days Only)',
                                    },
                                    { key: 'investment', label: 'Investment' },
                                    {
                                        key: 'current_cmkr_colla_amount',
                                        label: 'CMKR Collateral',
                                    },
                                    {
                                        key: 'current_no_exposed_amt',
                                        label: 'No Exposed Amount',
                                    },
                                    {
                                        key: 'renewal_only',
                                        label: 'Renewal Only',
                                    },
                                    {
                                        key: 'exclude_litigation',
                                        label: 'Exclude Litigation',
                                    },
                                    {
                                        key: 'exclude_zero_expose_amount',
                                        label: 'Exclude Zero Exposure',
                                    },
                                    {
                                        key: 'current_if_interest_paid',
                                        label: 'Interest Paid Current',
                                    },
                                    {
                                        key: 'include_share_cap',
                                        label: 'Include Share Capital',
                                    },
                                ].map(({ key, label }) => (
                                    <FormFieldWrapper
                                        control={form.control}
                                        key={key}
                                        name={
                                            key as keyof TPortfolioAtRiskSchema
                                        }
                                        render={({ field }) => (
                                            <label className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={!!field.value}
                                                    onCheckedChange={(v) =>
                                                        field.onChange(!!v)
                                                    }
                                                />
                                                <span className="text-sm">
                                                    {label}
                                                </span>
                                            </label>
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="filter_by_amount_granted_from"
                                    render={({ field }) => (
                                        <Input type="number" {...field} />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="filter_by_amount_granted_to"
                                    render={({ field }) => (
                                        <Input type="number" {...field} />
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Loan Amount Type"
                                    name="loan_amount_type"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {[
                                                'loan_balance',
                                                'arrears',
                                                'arrears_distributed',
                                            ].map((v) => (
                                                <label
                                                    className="flex items-center gap-2 text-sm"
                                                    key={v}
                                                >
                                                    <RadioGroupItem value={v} />
                                                    <span>{v}</span>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Include Excluded Account"
                                    name="include_excluded_account"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {['no', 'current', 'aging'].map(
                                                (v) => (
                                                    <label
                                                        className="flex items-center gap-2 text-sm"
                                                        key={v}
                                                    >
                                                        <RadioGroupItem
                                                            value={v}
                                                        />
                                                        <span>{v}</span>
                                                    </label>
                                                )
                                            )}
                                        </RadioGroup>
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Sex"
                                    name="sex"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {['all', 'male', 'female'].map(
                                                (v) => (
                                                    <label
                                                        className="flex items-center gap-2 text-sm"
                                                        key={v}
                                                    >
                                                        <RadioGroupItem
                                                            value={v}
                                                        />
                                                        <span>{v}</span>
                                                    </label>
                                                )
                                            )}
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            <FormFieldWrapper
                                control={form.control}
                                label="Filtered By"
                                name="filtered_by"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="grid grid-cols-2 gap-3"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {[
                                            {
                                                value: 'by_amortization',
                                                title: 'By Amortization',
                                                desc: 'Based on amortization schedule',
                                            },
                                            {
                                                value: 'by_maturity',
                                                title: 'By Maturity',
                                                desc: 'Based on maturity date',
                                            },
                                        ].map((v) => {
                                            const selected =
                                                field.value === v.value

                                            return (
                                                <label
                                                    className={cn(
                                                        'relative flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all',
                                                        'hover:shadow-md hover:scale-[1.01]',
                                                        selected
                                                            ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-background border-primary shadow-sm'
                                                            : 'bg-muted/40'
                                                    )}
                                                    key={v.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem
                                                            value={v.value}
                                                        />
                                                        <span className="font-medium text-sm">
                                                            {v.title}
                                                        </span>
                                                    </div>

                                                    <span className="text-xs text-muted-foreground pl-6">
                                                        {v.desc}
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
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
                                            'no_group',
                                            'by_barangay',
                                            'by_sex',
                                            'group',
                                            'by_account',
                                            'by_occupation',
                                            'area',
                                            'loan_bal',
                                            'terms',
                                            'by_purpose',
                                        ].map((v) => (
                                            <label
                                                className="flex items-center gap-2 text-sm"
                                                key={v}
                                            >
                                                <RadioGroupItem value={v} />
                                                <span>{v}</span>
                                            </label>
                                        ))}
                                    </RadioGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Paper Type"
                                name="paper_type"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="grid grid-cols-2 gap-3"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {[
                                            {
                                                value: 'standard',
                                                title: 'Standard',
                                                desc: 'Uses standard letter/A4 paper layout',
                                            },
                                            {
                                                value: 'continous',
                                                title: 'Continuous',
                                                desc: 'Optimized for dot-matrix / continuous form printing',
                                            },
                                        ].map((v) => {
                                            const selected =
                                                field.value === v.value

                                            return (
                                                <label
                                                    className={cn(
                                                        'relative flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all',
                                                        'hover:shadow-md hover:scale-[1.01]',
                                                        selected
                                                            ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-background border-primary shadow-sm'
                                                            : 'bg-muted/40'
                                                    )}
                                                    key={v.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem
                                                            value={v.value}
                                                        />
                                                        <span className="font-medium text-sm">
                                                            {v.title}
                                                        </span>
                                                    </div>

                                                    <span className="text-xs text-muted-foreground pl-6">
                                                        {v.desc}
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </RadioGroup>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Account"
                                    name="account"
                                    render={({ field }) => (
                                        <AccountPicker
                                            {...field}
                                            hideDescription
                                            mode="all"
                                            onSelect={(account) => {
                                                field.onChange(account.id)
                                                form.setValue(
                                                    'account',
                                                    account
                                                )
                                            }}
                                            placeholder="All Account"
                                            triggerClassName="!w-full !min-w-0 flex-1"
                                            value={form.getValues('account')}
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
                                            placeholder="Barangay"
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
                                            onChange={(v) =>
                                                field.onChange(v?.id)
                                            }
                                            placeholder="All"
                                            undefinable
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
                                            onChange={(v) =>
                                                field.onChange(v?.id)
                                            }
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
                                            onChange={(v) =>
                                                field.onChange(v?.id)
                                            }
                                            placeholder="All"
                                            undefinable
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Account Category"
                                    name="account_category_id"
                                    render={({ field }) => (
                                        <AccountCategoryComboBox
                                            onChange={field.onChange}
                                            placeholder="All Category"
                                            undefinable
                                            value={field.value}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Collector"
                                    name="collector_id"
                                    render={({ field }) => {
                                        const selected =
                                            form.getValues('collector')
                                        return (
                                            <div className="flex items-center gap-2">
                                                <EmployeePicker
                                                    {...field}
                                                    onSelect={(v) => {
                                                        field.onChange(
                                                            v?.user_id
                                                        )
                                                        form.setValue(
                                                            'collector',
                                                            v?.user
                                                        )
                                                    }}
                                                    placeholder="ALL"
                                                    value={selected}
                                                />
                                                {selected && (
                                                    <Button
                                                        onClick={() => {
                                                            field.onChange(
                                                                undefined
                                                            )
                                                            form.setValue(
                                                                'collector',
                                                                undefined
                                                            )
                                                        }}
                                                        size="icon"
                                                        type="button"
                                                        variant="ghost"
                                                    >
                                                        <XIcon className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                            <FormFieldWrapper
                                control={form.control}
                                label="Print Type"
                                name="print_type"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="grid grid-cols-2 gap-3"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {[
                                            {
                                                value: 'summary',
                                                title: 'Summary',
                                                desc: 'Shows aggregated totals only',
                                            },
                                            {
                                                value: 'detail',
                                                title: 'Detail',
                                                desc: 'Displays full breakdown',
                                            },
                                        ].map((v) => {
                                            const selected =
                                                field.value === v.value

                                            return (
                                                <label
                                                    className={cn(
                                                        'relative flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all',
                                                        'hover:shadow-md hover:scale-[1.01]',
                                                        selected
                                                            ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-background border-primary shadow-sm'
                                                            : 'bg-muted/40'
                                                    )}
                                                    key={v.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem
                                                            value={v.value}
                                                        />
                                                        <span className="font-medium text-sm">
                                                            {v.title}
                                                        </span>
                                                    </div>

                                                    <span className="text-xs text-muted-foreground pl-6">
                                                        {v.desc}
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </RadioGroup>
                                )}
                            />
                        </div>
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

export const LoanBalanceAmountRangesSection = ({
    form,
    title = 'Loan Balance Amount Ranges',
    description = 'Define loan balance amount ranges',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TPortfolioAtRiskSchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'loan_balance_amount_ranges',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({ from: 0, to: 0 })
        },
        {
            keydown: true,
            enableOnFormTags: true,
        }
    )

    return (
        <Modal
            className={cn('!max-w-4xl border-muted w-full', className)}
            closeButtonClassName="sr-only"
            description={description}
            onOpenChange={setState}
            open={state}
            title={title}
            titleHeaderContainerClassName="sr-only"
            trigger={trigger}
            {...props}
        >
            <div className="flex justify-between">
                <div>
                    <p className="text-lg font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => append({ from: 0, to: 0 })}
                        size="xs"
                        type="button"
                        variant="secondary"
                    >
                        Add Entry
                    </Button>
                </div>
            </div>

            <Table
                className="border-separate border-spacing-0"
                wrapperClassName="border-none ring-2 ring-muted h-[60vh] rounded-xl bg-muted/30 ecoop-scroll overflow-auto"
            >
                <TableHeader className="sticky top-0 bg-popover/80">
                    <TableRow>
                        <TableHead className="w-[60px] text-center">
                            #
                        </TableHead>
                        <TableHead className="text-center">From</TableHead>
                        <TableHead className="text-center">To</TableHead>
                        <TableHead className="w-[60px]" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell className="text-center py-2">
                                {index + 1}
                            </TableCell>

                            <TableCell className="px-2 py-2">
                                <Input
                                    type="number"
                                    {...form.register(
                                        `loan_balance_amount_ranges.${index}.from`,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="px-2 py-2">
                                <Input
                                    type="number"
                                    {...form.register(
                                        `loan_balance_amount_ranges.${index}.to`,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="px-2 py-2">
                                <Button
                                    onClick={() => remove(index)}
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                >
                                    <TrashIcon className="size-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Modal>
    )
}

export const TermsActionSection = ({
    form,
    title = 'Terms Action Ranges',
    description = 'Define terms action ranges',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TPortfolioAtRiskSchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'terms_action',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({ from: 0, to: 0 })
        },
        {
            keydown: true,
            enableOnFormTags: true,
        }
    )

    return (
        <Modal
            className={cn('!max-w-4xl border-muted w-full', className)}
            closeButtonClassName="sr-only"
            description={description}
            onOpenChange={setState}
            open={state}
            title={title}
            titleHeaderContainerClassName="sr-only"
            trigger={trigger}
            {...props}
        >
            <div className="flex justify-between">
                <div>
                    <p className="text-lg font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => append({ from: 0, to: 0 })}
                        size="xs"
                        type="button"
                        variant="secondary"
                    >
                        Add Entry
                    </Button>
                </div>
            </div>

            <Table
                className="border-separate border-spacing-0"
                wrapperClassName="border-none ring-2 ring-muted h-[60vh] rounded-xl bg-muted/30 ecoop-scroll overflow-auto"
            >
                <TableHeader className="sticky top-0 bg-popover/80">
                    <TableRow>
                        <TableHead className="w-[60px] text-center">
                            #
                        </TableHead>
                        <TableHead className="text-center">From</TableHead>
                        <TableHead className="text-center">To</TableHead>
                        <TableHead className="w-[60px]" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell className="text-center py-2">
                                {index + 1}
                            </TableCell>

                            <TableCell className="px-2 py-2">
                                <Input
                                    type="number"
                                    {...form.register(
                                        `terms_action.${index}.from`,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="px-2 py-2">
                                <Input
                                    type="number"
                                    {...form.register(
                                        `terms_action.${index}.to`,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="px-2 py-2">
                                <Button
                                    onClick={() => remove(index)}
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                >
                                    <TrashIcon className="size-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Modal>
    )
}

export const PortfolioAtRiskCreateReportFormModal = ({
    title = 'Portfolio At Risk',
    description = 'Generate portfolio at risk report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IPortfolioAtRiskFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('sm:max-w-7xl', className)}
            description={description}
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <PortfolioAtRiskCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
