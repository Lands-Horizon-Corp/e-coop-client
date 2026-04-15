import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountCategoryComboBox } from '@/modules/account-category'
import { AccountMultiPickerModal } from '@/modules/account/components/picker/account-multi-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import LoanPicker from '@/modules/loan-transaction/components/loan-picker'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const LoanReceivableSchema = z
    .object({
        as_of_date: stringDateWithTransformSchema,

        filter_by_date_release_from: stringDateWithTransformSchema.optional(),
        filter_by_date_release_to: stringDateWithTransformSchema.optional(),

        exclude_account_ids: z.array(entityIdSchema).optional(),
        exclude_account: z.array(z.any()).optional(),

        loan_amount_type: z
            .enum(['loan_bal', 'arrears', 'arrears_dist'])
            .default('loan_bal'),

        include_excluded_account: z
            .enum(['no', 'current', 'aging'])
            .default('no'),

        include_amount: z
            .enum(['all', 'delinquent', 'non_delinq'])
            .default('all'),

        report_type: z
            .enum(['all', 'dosri', 'loan_type', 'non_dosri', 'group'])
            .default('all'),

        filter_by: z
            .enum(['by_amortization', 'by_maturity'])
            .default('by_amortization'),

        investment_only: z.boolean().default(false),

        member_group_id: entityIdSchema.optional(),
        member_group: z.any().optional(),
        include_share_cap: z.boolean().default(false),

        loan_transaction_id: entityIdSchema.optional(),
        loan_transaction: z.any().optional(),
        exclude_zero_expose_amount: z.boolean().default(false),

        account_category_id: entityIdSchema.optional(),

        over_12_mos_format: z.boolean().default(false),
        fall_to_current_1_30_days: z.boolean().default(false),
        current_no_exposed_amt: z.boolean().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TLoanReceivableSchema = z.infer<typeof LoanReceivableSchema>

export interface ILoanReceivableFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanReceivableSchema>,
            IGeneratedReport,
            Error,
            TLoanReceivableSchema
        > {}

const LoanReceivableCreateReportForm = ({
    className,
    ...formProps
}: ILoanReceivableFormProps) => {
    const form = useForm<TLoanReceivableSchema>({
        resolver: standardSchemaResolver(LoanReceivableSchema),
        defaultValues: {
            as_of_date: undefined,

            filter_by_date_release_from: undefined,
            filter_by_date_release_to: undefined,

            exclude_account_ids: [],
            exclude_account: [],

            loan_amount_type: 'loan_bal',
            include_excluded_account: 'no',
            include_amount: 'all',
            report_type: 'all',
            filter_by: 'by_amortization',

            investment_only: false,

            member_group_id: undefined,
            member_group: undefined,
            include_share_cap: false,

            loan_transaction_id: undefined,
            loan_transaction: undefined,
            exclude_zero_expose_amount: false,

            account_category_id: '',

            over_12_mos_format: false,
            fall_to_current_1_30_days: false,
            current_no_exposed_amt: false,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `loan_receivable_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TLoanReceivableSchema>({
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
                    <FormFieldWrapper
                        control={form.control}
                        label="As of Date"
                        name="as_of_date"
                        render={({ field }) => <InputDate {...field} />}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Release From"
                            name="filter_by_date_release_from"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Release To"
                            name="filter_by_date_release_to"
                            render={({ field }) => <InputDate {...field} />}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Exclude Accounts"
                        name="exclude_account_ids"
                        render={({ field }) => (
                            <div className="flex flex-col gap-y-2">
                                <AccountMultiPickerModal
                                    pickerProps={{
                                        defaultSelected:
                                            form.getValues('exclude_account'),
                                        onConfirm: (accounts) => {
                                            field.onChange(
                                                accounts.map(
                                                    (account) => account.id
                                                )
                                            )
                                            form.setValue(
                                                'exclude_account',
                                                accounts
                                            )
                                        },
                                    }}
                                    trigger={
                                        <Button
                                            // disabled={isDisabled(field.name)}
                                            type="button"
                                            variant="outline"
                                        >
                                            {field?.value?.length === 0
                                                ? 'Select account to exclude'
                                                : `${field.value?.length} Accounts Excluded`}
                                        </Button>
                                    }
                                />
                                {(field.value ?? []).length > 0 && (
                                    <span className="text-sm text-muted-foreground">
                                        {field.value?.length} account(s)
                                        excluded
                                    </span>
                                )}
                            </div>
                        )}
                    />

                    <div className="grid grid-cols-3 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Loan Amount Type"
                            name="loan_amount_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols- p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'loan_bal',
                                            label: 'Loan Balance',
                                        },
                                        { value: 'arrears', label: 'Arrears' },
                                        {
                                            value: 'arrears_dist',
                                            label: 'Arrears Distribution',
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
                            label="Include Excluded Account"
                            name="include_excluded_account"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols- p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        { value: 'no', label: 'No' },
                                        { value: 'current', label: 'Current' },
                                        { value: 'aging', label: 'Aging' },
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
                            label="Include Amount"
                            name="include_amount"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols- p-4 rounded-xl bg-muted/60 border gap-2"
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
                                            value: 'non_delinq',
                                            label: 'Non Delinquent',
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
                        label="Report Type"
                        name="report_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'all', label: 'All' },
                                    { value: 'dosri', label: 'DOSRI' },
                                    { value: 'loan_type', label: 'Loan Type' },
                                    { value: 'non_dosri', label: 'Non DOSRI' },
                                    { value: 'group', label: 'Group' },
                                ].map((opt) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={opt.value}
                                    >
                                        <RadioGroupItem value={opt.value} />
                                        <span>{opt.label}</span>
                                    </label>
                                ))}

                                <FormFieldWrapper
                                    control={form.control}
                                    name="investment_only"
                                    render={({ field }) => (
                                        <label className="flex items-center gap-x-4 w-fit">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(v) =>
                                                    field.onChange(!!v)
                                                }
                                            />
                                            <span className="text-sm">
                                                Investment Only
                                            </span>
                                        </label>
                                    )}
                                />
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Filter By"
                        name="filter_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'by_amortization',
                                        label: 'By Amortization',
                                        desc: 'Filter based on amortization schedule.',
                                    },
                                    {
                                        value: 'by_maturity',
                                        label: 'By Maturity',
                                        desc: 'Filter based on loan maturity date.',
                                    },
                                ].map((opt) => {
                                    const isSelected = field.value === opt.value
                                    return (
                                        <label
                                            className={cn(
                                                'relative flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                                'hover:bg-accent/50',
                                                isSelected
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                    : 'bg-background border-border'
                                            )}
                                            key={opt.value}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={cn(
                                                        'text-sm font-medium',
                                                        isSelected
                                                            ? 'text-primary'
                                                            : 'text-foreground'
                                                    )}
                                                >
                                                    {opt.label}
                                                </span>
                                                <RadioGroupItem
                                                    value={opt.value}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {opt.desc}
                                            </span>
                                        </label>
                                    )
                                })}
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Member Group"
                        name="member_group_id"
                        render={({ field }) => (
                            <div className="flex w-full gap-x-2 items-center">
                                <MemberGroupCombobox
                                    {...field}
                                    className="flex-1"
                                    onChange={(v) => {
                                        field.onChange(v?.id)
                                        form.setValue('member_group', v)
                                    }}
                                    placeholder="All"
                                    undefinable
                                />
                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    name="include_share_cap"
                                    render={({ field }) => (
                                        <label className="flex items-center gap-x-2 rounded-xl border p-2 bg-muted">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(v) =>
                                                    field.onChange(!!v)
                                                }
                                            />
                                            <span className="text-sm">
                                                Include Share Cap
                                            </span>
                                        </label>
                                    )}
                                />
                            </div>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Loan Transaction"
                        name="loan_transaction_id"
                        render={({ field }) => (
                            <div className="flex w-full gap-x-2 items-center">
                                <LoanPicker
                                    mode="branch"
                                    {...field}
                                    onSelect={(v) => {
                                        field.onChange(v?.id)
                                        form.setValue('loan_transaction', v)
                                    }}
                                    placeholder="All"
                                    triggerClassName="flex-1"
                                    value={form.getValues('loan_transaction')}
                                />
                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    name="exclude_zero_expose_amount"
                                    render={({ field }) => (
                                        <label className="flex items-center gap-x-2 rounded-xl border p-2 bg-muted">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(v) =>
                                                    field.onChange(!!v)
                                                }
                                            />
                                            <span className="text-sm">
                                                Exclude Zero Exposed
                                            </span>
                                        </label>
                                    )}
                                />
                            </div>
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

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            {
                                name: 'over_12_mos_format',
                                label: 'Over 12 Mos Format',
                                desc: 'Apply format for over 12 months.',
                            },
                            {
                                name: 'fall_to_current_1_30_days',
                                label: '1-30 Days',
                                desc: 'Move balances to current 1-30 days.',
                            },
                            {
                                name: 'current_no_exposed_amt',
                                label: 'No Exposed Amount',
                                desc: 'Hide exposed amount in current.',
                            },
                        ].map((opt) => (
                            <FormFieldWrapper
                                control={form.control}
                                key={opt.name}
                                name={opt.name as keyof TLoanReceivableSchema}
                                render={({ field }) => {
                                    const checked = field.value
                                    return (
                                        <label
                                            className={cn(
                                                'flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                                checked
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                    : 'bg-background border-border'
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    {opt.label}
                                                </span>
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={(v) =>
                                                        field.onChange(!!v)
                                                    }
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {opt.desc}
                                            </span>
                                        </label>
                                    )
                                }}
                            />
                        ))}
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

export default LoanReceivableCreateReportForm

export const LoanReceivableCreateReportFormModal = ({
    title = 'Loan Receivable',
    description = 'Generate loan receivable report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanReceivableFormProps, 'className' | 'onClose'>
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
            <LoanReceivableCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
