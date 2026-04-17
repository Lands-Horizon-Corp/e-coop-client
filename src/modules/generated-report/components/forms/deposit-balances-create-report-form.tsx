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
import { CurrencyInput } from '@/modules/currency'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import { GeneralLedgerSourceSchema } from '@/modules/general-ledger'
import { GeneralLedgerSourceMultiPickerModal } from '@/modules/general-ledger/components/pickers/general-ledger-source-multi-picker'
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
import { SwitchArrowIcon, TagIcon, TrashIcon, XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormLabel } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
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

export const DepositBalancesSchema = z
    .object({
        title: z.string().default('DEPOSIT BALANCE'),
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        report_type: z.enum(['detail', 'summary']).default('summary'),

        receivable_only: z.boolean().default(false),
        include_closed_acct: z.boolean().default(false),
        adj_by_date_of_entry: z.boolean().default(false),
        exclude_with_write_off_loan: z.boolean().default(false),
        damayan_only: z.boolean().default(false),
        include_zero_amt: z.boolean().default(false),

        deposit_balances: z
            .array(
                z.object({
                    from: z.number(),
                    to: z.number(),
                })
            )
            .default([]),

        filter_by_source: z
            .array(GeneralLedgerSourceSchema)
            .optional()
            .default([]),

        group_by: z
            .enum([
                'by_member_type',
                'by_barangay',
                'by_stocks',
                'by_area',
                'by_occupation',
                'by_sex',
                'by_deposit_bal',
                'by_area_grp',
                'by_department',
                'by_group',
                'by_mem_class',
                'no_grouping',
            ])
            .default('no_grouping'),

        sort_by: z
            .enum(['by_passbook_no', 'by_name', 'amount'])
            .default('amount'),

        sex: z.enum(['all', 'male', 'female']).default('all'),

        exclude_other_ded: z.boolean().default(false),
        exclude_int_icpr: z.boolean().default(false),

        amount_filter_type: z
            .enum(['below', 'equal_or_above', 'all'])
            .default('all'),
        amount_value: z.number().default(0),

        option_type: z
            .enum([
                'option_1',
                'option_2',
                'option_3',
                'option_4',
                'option_5',
                'single',
                'others',
            ])
            .default('single'),

        select_other_account_ids: z
            .array(entityIdSchema)
            .optional()
            .default([]),
        select_other_accounts: z.array(z.any()).optional().default([]),

        debit_credit: z.enum(['none', 'by_total', 'by_entry']).default('none'),

        loan_status: z.enum(['all', 'delinquent', 'non_dq']).default('all'),

        account_id: entityIdSchema.optional(),
        account: z.any().optional(),

        member_type_id: entityIdSchema.optional(),
        barangay: z.string().optional(),
        member_occupation_id: entityIdSchema.optional(),
        member_department_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),
        member_address_area_id: entityIdSchema.optional(),

        account_category_id: entityIdSchema.optional(),

        collector_id: entityIdSchema.optional(),
        collector: z.any().optional(),
    })
    .and(WithGeneratedReportSchema)

export type TDepositBalancesSchema = z.infer<typeof DepositBalancesSchema>

export interface IDepositBalancesFormProps
    extends
        IClassProps,
        IForm<
            Partial<TDepositBalancesSchema>,
            IGeneratedReport,
            Error,
            TDepositBalancesSchema
        > {}

const DepositBalancesCreateReportForm = ({
    className,
    ...formProps
}: IDepositBalancesFormProps) => {
    const form = useForm<TDepositBalancesSchema>({
        resolver: standardSchemaResolver(DepositBalancesSchema),
        defaultValues: {
            title: 'DEPOSIT BALANCE',
            start_date: undefined,
            end_date: undefined,

            report_type: 'summary',

            receivable_only: false,
            include_closed_acct: false,
            adj_by_date_of_entry: false,
            exclude_with_write_off_loan: false,
            damayan_only: false,
            include_zero_amt: false,

            deposit_balances: [],
            filter_by_source: [],

            group_by: 'no_grouping',
            sort_by: 'amount',
            sex: 'all',

            exclude_other_ded: false,
            exclude_int_icpr: false,

            amount_filter_type: 'all',
            amount_value: 0,

            option_type: 'single',

            select_other_account_ids: [],
            select_other_accounts: [],

            debit_credit: 'none',
            loan_status: 'all',

            account_id: undefined,
            account: undefined,

            barangay: '',
            member_type_id: undefined,
            member_occupation_id: undefined,
            member_department_id: undefined,
            member_group_id: undefined,
            member_address_area_id: undefined,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `deposit_balances_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TDepositBalancesSchema>(
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
                    className="space-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="space-y-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Title"
                                name="title"
                                render={({ field }) => <Input {...field} />}
                            />

                            <div className="flex items-end gap-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Start Date"
                                    name="start_date"
                                    render={({ field }) => (
                                        <InputDate {...field} />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="End Date"
                                    name="end_date"
                                    render={({ field }) => (
                                        <InputDate {...field} />
                                    )}
                                />
                            </div>

                            <div className="flex gap-x-2">
                                <div className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2 flex-1">
                                    {[
                                        {
                                            value: 'receivable_only',
                                            label: 'Receivable Only',
                                        },
                                        {
                                            value: 'include_closed_acct',
                                            label: 'Include Closed Account',
                                        },
                                        {
                                            value: 'adj_by_date_of_entry',
                                            label: 'Adjust by Date of Entry',
                                        },
                                        {
                                            value: 'exclude_with_write_off_loan',
                                            label: 'Exclude with Write-off Loan',
                                        },
                                        {
                                            value: 'damayan_only',
                                            label: 'Damayan Only',
                                        },
                                        {
                                            value: 'include_zero_amt',
                                            label: 'Include Zero Amount',
                                        },
                                    ].map(({ value, label }) => (
                                        <FormFieldWrapper
                                            control={form.control}
                                            key={value}
                                            name={
                                                value as keyof TDepositBalancesSchema
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
                                <div className="space-y-2">
                                    <DepositBalancesSection
                                        form={form}
                                        trigger={
                                            <Button
                                                className="w-full"
                                                type="button"
                                                variant="outline"
                                            >
                                                <SwitchArrowIcon /> Deposit
                                                Balances
                                            </Button>
                                        }
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="filter_by_source"
                                        render={({ field }) => (
                                            <GeneralLedgerSourceMultiPickerModal
                                                pickerProps={{
                                                    defaultSelected:
                                                        field.value ?? [],
                                                    onConfirm: (val) =>
                                                        field.onChange(val),
                                                }}
                                                trigger={
                                                    <Button
                                                        className="w-full"
                                                        type="button"
                                                        variant="outline"
                                                    >
                                                        <TagIcon />
                                                        {field.value?.length
                                                            ? `${field.value.length} Sources Selected`
                                                            : 'Select Sources'}
                                                    </Button>
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <FormFieldWrapper
                                control={form.control}
                                label="Group By"
                                name="group_by"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="grid grid-cols-4 p-4 rounded-xl bg-muted/60 border gap-2"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {[
                                            {
                                                value: 'by_member_type',
                                                label: 'By Member Type',
                                            },
                                            {
                                                value: 'by_barangay',
                                                label: 'By Barangay',
                                            },
                                            {
                                                value: 'by_stocks',
                                                label: 'By Stocks',
                                            },
                                            {
                                                value: 'by_area',
                                                label: 'By Area',
                                            },
                                            {
                                                value: 'by_occupation',
                                                label: 'By Occupation',
                                            },
                                            {
                                                value: 'by_sex',
                                                label: 'By Sex',
                                            },
                                            {
                                                value: 'by_deposit_bal',
                                                label: 'By Deposit Balance',
                                            },
                                            {
                                                value: 'by_area_grp',
                                                label: 'By Area Group',
                                            },
                                            {
                                                value: 'by_department',
                                                label: 'By Department',
                                            },
                                            {
                                                value: 'by_group',
                                                label: 'By Group',
                                            },
                                            {
                                                value: 'by_mem_class',
                                                label: 'By Member Class',
                                            },
                                            {
                                                value: 'no_grouping',
                                                label: 'No Grouping',
                                            },
                                        ].map(({ value, label }) => (
                                            <label
                                                className="flex items-center gap-2 text-sm"
                                                key={value}
                                            >
                                                <RadioGroupItem value={value} />
                                                <span>{label}</span>
                                            </label>
                                        ))}
                                    </RadioGroup>
                                )}
                            />
                            <div className="grid grid-cols-4 gap-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Sort By"
                                    name="sort_by"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {[
                                                {
                                                    value: 'by_passbook_no',
                                                    label: 'By Passbook No',
                                                },
                                                {
                                                    value: 'by_name',
                                                    label: 'By Name',
                                                },
                                                {
                                                    value: 'amount',
                                                    label: 'Amount',
                                                },
                                            ].map(({ value, label }) => (
                                                <label
                                                    className="flex items-center gap-2 text-sm"
                                                    key={value}
                                                >
                                                    <RadioGroupItem
                                                        value={value}
                                                    />
                                                    <span>{label}</span>
                                                </label>
                                            ))}
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
                                            {[
                                                { value: 'all', label: 'All' },
                                                {
                                                    value: 'male',
                                                    label: 'Male',
                                                },
                                                {
                                                    value: 'female',
                                                    label: 'Female',
                                                },
                                            ].map(({ value, label }) => (
                                                <label
                                                    className="flex items-center gap-2 text-sm"
                                                    key={value}
                                                >
                                                    <RadioGroupItem
                                                        value={value}
                                                    />
                                                    <span>{label}</span>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    )}
                                />{' '}
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Debit / Credit"
                                    name="debit_credit"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {[
                                                {
                                                    value: 'none',
                                                    label: 'None',
                                                },
                                                {
                                                    value: 'by_total',
                                                    label: 'By Total',
                                                },
                                                {
                                                    value: 'by_entry',
                                                    label: 'By Entry',
                                                },
                                            ].map(({ value, label }) => (
                                                <label
                                                    className="flex items-center gap-2 text-sm"
                                                    key={value}
                                                >
                                                    <RadioGroupItem
                                                        value={value}
                                                    />
                                                    <span>{label}</span>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Loan Status"
                                    name="loan_status"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {[
                                                { value: 'all', label: 'All' },
                                                {
                                                    value: 'delinquent',
                                                    label: 'Delinquent',
                                                },
                                                {
                                                    value: 'non_dq',
                                                    label: 'Non DQ',
                                                },
                                            ].map(({ value, label }) => (
                                                <label
                                                    className="flex items-center gap-2 text-sm"
                                                    key={value}
                                                >
                                                    <RadioGroupItem
                                                        value={value}
                                                    />
                                                    <span>{label}</span>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <FormLabel
                                    className="text-muted-foreground text-xs"
                                    tabIndex={-1}
                                >
                                    Amount Type
                                </FormLabel>
                                <div className="grid grid-cols-3 gap-4 p-4 items-baseline rounded-xl bg-muted/60 border">
                                    <div className="space-y-2">
                                        {[
                                            {
                                                key: 'exclude_other_ded',
                                                label: 'Exclude Other Deduction',
                                            },
                                            {
                                                key: 'exclude_int_icpr',
                                                label: 'Exclude Interest / ICPR',
                                            },
                                        ].map(({ key, label }) => (
                                            <FormFieldWrapper
                                                control={form.control}
                                                key={key}
                                                name={
                                                    key as keyof TDepositBalancesSchema
                                                }
                                                render={({ field }) => (
                                                    <label className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={
                                                                !!field.value
                                                            }
                                                            onCheckedChange={(
                                                                v
                                                            ) =>
                                                                field.onChange(
                                                                    !!v
                                                                )
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
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="amount_filter_type"
                                        render={({ field }) => (
                                            <RadioGroup
                                                className="grid grid-cols-2 items-start gap-2"
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                {[
                                                    {
                                                        value: 'below',
                                                        label: 'Below',
                                                    },
                                                    {
                                                        value: 'equal_or_above',
                                                        label: 'Equal or Above',
                                                    },
                                                    {
                                                        value: 'all',
                                                        label: 'All',
                                                    },
                                                ].map(({ value, label }) => (
                                                    <label
                                                        className="flex items-center gap-2 text-sm"
                                                        key={value}
                                                    >
                                                        <RadioGroupItem
                                                            value={value}
                                                        />
                                                        <span>{label}</span>
                                                    </label>
                                                ))}
                                                <FormFieldWrapper
                                                    control={form.control}
                                                    label="Amount"
                                                    name="amount_value"
                                                    render={({
                                                        field: {
                                                            onChange,
                                                            ...field
                                                        },
                                                    }) => (
                                                        <CurrencyInput
                                                            {...field}
                                                            className="w-[120px]"
                                                            onValueChange={(
                                                                newValue = ''
                                                            ) => {
                                                                onChange(
                                                                    newValue
                                                                )
                                                            }}
                                                            placeholder="Amount"
                                                        />
                                                    )}
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                </div>
                            </div>
                            <FormFieldWrapper
                                control={form.control}
                                label="Option Type"
                                name="option_type"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {[
                                            {
                                                value: 'option_1',
                                                label: 'Option 1',
                                            },
                                            {
                                                value: 'option_2',
                                                label: 'Option 2',
                                            },
                                            {
                                                value: 'option_3',
                                                label: 'Option 3',
                                            },
                                            {
                                                value: 'option_4',
                                                label: 'Option 4',
                                            },
                                            {
                                                value: 'option_5',
                                                label: 'Option 5',
                                            },
                                            {
                                                value: 'single',
                                                label: 'Single',
                                            },
                                            {
                                                value: 'others',
                                                label: 'Others',
                                            },
                                        ].map(({ value, label }) => (
                                            <label
                                                className="flex items-center gap-2 text-sm"
                                                key={value}
                                            >
                                                <RadioGroupItem value={value} />
                                                <span>{label}</span>

                                                {value === 'others' && (
                                                    <FormFieldWrapper
                                                        control={form.control}
                                                        name="select_other_account_ids"
                                                        render={({ field }) => (
                                                            <div className="flex flex-col gap-y-2 ml-2">
                                                                <AccountMultiPickerModal
                                                                    pickerProps={{
                                                                        defaultSelected:
                                                                            form.getValues(
                                                                                'select_other_accounts'
                                                                            ),
                                                                        onConfirm:
                                                                            (
                                                                                accounts
                                                                            ) => {
                                                                                field.onChange(
                                                                                    accounts.map(
                                                                                        (
                                                                                            a
                                                                                        ) =>
                                                                                            a.id
                                                                                    )
                                                                                )
                                                                                form.setValue(
                                                                                    'select_other_accounts',
                                                                                    accounts
                                                                                )
                                                                            },
                                                                    }}
                                                                    trigger={
                                                                        <Button
                                                                            className="w-fit"
                                                                            disabled={
                                                                                form.watch(
                                                                                    'option_type'
                                                                                ) !==
                                                                                'others'
                                                                            }
                                                                            size="xs"
                                                                            type="button"
                                                                            variant="secondary"
                                                                        >
                                                                            {field
                                                                                ?.value
                                                                                ?.length ===
                                                                            0
                                                                                ? 'Select Others'
                                                                                : `${field.value?.length} Others Selected`}
                                                                        </Button>
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                )}
                                            </label>
                                        ))}
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

export const DepositBalancesSection = ({
    form,
    title = 'Deposit Balances',
    description = 'Define deposit balance ranges',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TDepositBalancesSchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'deposit_balances',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({
                from: 0,
                to: 0,
            })
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
                    <p className="text-lg font-medium">Deposit Balances</p>
                    <p className="text-sm text-muted-foreground">
                        Define deposit balance ranges
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        <KbdGroup>
                            <Kbd>Ctrl</Kbd>
                            <Kbd>Enter</Kbd>
                        </KbdGroup>{' '}
                    </p>
                    <Button
                        onClick={() =>
                            append({
                                from: 0,
                                to: 0,
                            })
                        }
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
                <TableHeader className="bg-popover/80 sticky top-0">
                    <TableRow>
                        <TableHead className="w-[60px] text-center">
                            #
                        </TableHead>
                        <TableHead className="min-w-[200px] text-center">
                            From
                        </TableHead>
                        <TableHead className="min-w-[200px] text-center">
                            To
                        </TableHead>
                        <TableHead className="w-[60px]" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell className="text-center py-2">
                                {index + 1}
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    type="number"
                                    {...form.register(
                                        `deposit_balances.${index}.from`,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    type="number"
                                    {...form.register(
                                        `deposit_balances.${index}.to`,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
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

export const DepositBalancesCreateReportFormModal = ({
    title = 'Deposit Balance',
    description = 'Generate deposit balance report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IDepositBalancesFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('!max-w-[80vw]', className)}
            description={description}
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <DepositBalancesCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
