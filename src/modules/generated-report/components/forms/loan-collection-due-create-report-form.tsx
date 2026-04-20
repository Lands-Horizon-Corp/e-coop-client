import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { AccountCategoryComboBox } from '@/modules/account-category'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { LOAN_MODE_OF_PAYMENT } from '@/modules/loan-transaction/loan.constants'
import MemberDepartmentCombobox from '@/modules/member-department/components/member-department-combobox'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import { XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormLabel } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const LoanCollectionDueSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        member_type_id: entityIdSchema.optional(),
        barangay: z.string().optional(),

        account_id: entityIdSchema.optional(),
        account: z.any().optional(),

        account_category_id: entityIdSchema.optional(),
        collector_id: entityIdSchema.optional(),
        collector: z.any().optional(),

        member_group_id: entityIdSchema.optional(),
        member_department_id: entityIdSchema.optional(),

        filter_by_date_release_start_date:
            stringDateWithTransformSchema.optional(),
        filter_by_date_release_end_date:
            stringDateWithTransformSchema.optional(),

        include_interest: z.boolean().default(false),
        include_arrears: z.boolean().default(false),
        group_by_loan_category: z.boolean().default(false),

        sort_by: z.enum(['by_pb_no', 'by_name']).default('by_pb_no'),

        payment_type: z.enum(['all', 'office', 'field']).default('all'),

        mode_of_payment: z
            .enum([...LOAN_MODE_OF_PAYMENT, 'all'])
            .default('all'),

        group_by: z
            .enum([
                'barangay',
                'cat_tlr_ltype',
                'collector_variance',
                'brgy_ltype',
                'group',
                'department',
                'brgy_acct_ltype',
                'pd_by_prev_mos',
                'bgry_amount',
            ])
            .default('barangay'),

        loan_type: z
            .enum(['all', 'current', 'past_due_by_amort', 'past_due_by_mat'])
            .default('all'),

        amount_type: z.enum(['actual', 'supposed']).default('actual'),
    })
    .and(WithGeneratedReportSchema)

export type TLoanCollectionDueSchema = z.infer<typeof LoanCollectionDueSchema>

export interface ILoanCollectionDueFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanCollectionDueSchema>,
            IGeneratedReport,
            Error,
            TLoanCollectionDueSchema
        > {}

const LoanCollectionDueCreateReportForm = ({
    className,
    ...formProps
}: ILoanCollectionDueFormProps) => {
    const form = useForm<TLoanCollectionDueSchema>({
        resolver: standardSchemaResolver(LoanCollectionDueSchema),
        defaultValues: async () =>
            buildFormDefaults<TLoanCollectionDueSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,

                    member_type_id: undefined,
                    barangay: '',

                    account_id: undefined,
                    account: undefined,

                    account_category_id: undefined,
                    collector_id: undefined,

                    member_group_id: undefined,
                    member_department_id: undefined,

                    filter_by_date_release_start_date: undefined,
                    filter_by_date_release_end_date: undefined,

                    include_interest: false,
                    include_arrears: false,
                    group_by_loan_category: false,

                    sort_by: 'by_pb_no',
                    payment_type: 'all',
                    mode_of_payment: 'all',
                    group_by: 'barangay',
                    loan_type: 'all',
                    amount_type: 'actual',
                },
                overrideDefaults: formProps.defaultValues,
                transform: (data) => ({
                    ...data,
                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        ...data.report_config,
                        module: 'GeneratedReport',
                        name: `loan_collection_due_${toReadableDate(
                            new Date(),
                            'MMddyy_mmss'
                        )}`,
                    },
                }),
            }),
    })

    const generateMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TLoanCollectionDueSchema>({
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
            <PersistFormHeadless
                form={form}
                persistKey={formProps.persistKey}
            />
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="grid grid-cols-4 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date"
                            name="start_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="End Date"
                            name="end_date"
                            render={({ field }) => <InputDate {...field} />}
                        />{' '}
                        <FormFieldWrapper
                            control={form.control}
                            label="Date Release From"
                            name="filter_by_date_release_start_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Date Release To"
                            name="filter_by_date_release_end_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Member Type"
                            name="member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
                                    undefinable
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Barangay"
                            name="barangay"
                            render={({ field }) => (
                                <Input {...field} placeholder="All" />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 items-start gap-x-2">
                        <div className="grid gap-2">
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
                                        value={form.getValues('account')}
                                    />
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
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
                                    label="Department"
                                    name="member_department_id"
                                    render={({ field }) => (
                                        <MemberDepartmentCombobox
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

                        <div className="grid gap-x-2 gap-2">
                            <FormFieldWrapper
                                control={form.control}
                                label="Sort By"
                                name="sort_by"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="grid grid-cols-2 p-2.5 rounded-xl bg-muted/60 border gap-2"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {[
                                            {
                                                value: 'by_pb_no',
                                                label: 'Passbook No',
                                            },
                                            { value: 'by_name', label: 'Name' },
                                        ].map((opt) => (
                                            <label
                                                className="flex items-center gap-2 text-sm"
                                                key={opt.value}
                                            >
                                                <RadioGroupItem
                                                    value={opt.value}
                                                />
                                                <span>{opt.label}</span>
                                            </label>
                                        ))}
                                    </RadioGroup>
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Payment Type"
                                name="payment_type"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="grid grid-cols-3 p-2.5 rounded-xl bg-muted/60 border gap-2"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {[
                                            { value: 'all', label: 'All' },
                                            {
                                                value: 'office',
                                                label: 'Office',
                                            },
                                            { value: 'field', label: 'Field' },
                                        ].map((opt) => (
                                            <label
                                                className="flex items-center gap-2 text-sm"
                                                key={opt.value}
                                            >
                                                <RadioGroupItem
                                                    value={opt.value}
                                                />
                                                <span>{opt.label}</span>
                                            </label>
                                        ))}
                                    </RadioGroup>
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-x-2">
                        <FormFieldWrapper
                            className="col-span-2 h-full"
                            control={form.control}
                            label="Mode of Payment"
                            name="mode_of_payment"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[...LOAN_MODE_OF_PAYMENT, 'all'].map(
                                        (v) => (
                                            <label
                                                className="flex items-center gap-2 text-sm"
                                                key={v}
                                            >
                                                <RadioGroupItem value={v} />
                                                <span>{v}</span>
                                            </label>
                                        )
                                    )}
                                </RadioGroup>
                            )}
                        />
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            label="Loan Type"
                            name="loan_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 p-4 rounded-xl pb-8.5 bg-muted/60 border gap-4"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        { value: 'all', label: 'All' },
                                        { value: 'current', label: 'Current' },
                                        {
                                            value: 'past_due_by_amort',
                                            label: 'Past Due by Amort.',
                                        },
                                        {
                                            value: 'past_due_by_mat',
                                            label: 'Past Due by Mat.',
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
                        label="Group By"
                        name="group_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'barangay',
                                        label: 'Barangay',
                                    },
                                    {
                                        value: 'cat_tlr_ltype',
                                        label: 'Category Teller Loan Type',
                                    },
                                    {
                                        value: 'collector_variance',
                                        label: 'Collector Variance',
                                    },
                                    {
                                        value: 'brgy_ltype',
                                        label: 'Barangay Loan Type',
                                    },
                                    { value: 'group', label: 'Group' },
                                    {
                                        value: 'department',
                                        label: 'Department',
                                    },
                                    {
                                        value: 'brgy_acct_ltype',
                                        label: 'Barangay Account Loan Type',
                                    },
                                    {
                                        value: 'pd_by_prev_mos',
                                        label: 'Past Due by Previous Months',
                                    },
                                    {
                                        value: 'bgry_amount',
                                        label: 'Barangay Amount',
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
                        label="Amount Type"
                        name="amount_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'actual',
                                        label: 'Actual',
                                        desc: 'Based on actual collected amounts.',
                                    },
                                    {
                                        value: 'supposed',
                                        label: 'Supposed',
                                        desc: 'Based on expected or scheduled amounts.',
                                    },
                                ].map((opt) => {
                                    const isSelected = field.value === opt.value
                                    return (
                                        <label
                                            className={cn(
                                                'flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                                isSelected
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                    : 'bg-background border-border'
                                            )}
                                            key={opt.value}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
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

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            {
                                name: 'include_interest',
                                label: 'Include Interest',
                                desc: 'Include interest values in computation.',
                            },
                            {
                                name: 'include_arrears',
                                label: 'Include Arrears',
                                desc: 'Include arrears in total computation.',
                            },
                            {
                                name: 'group_by_loan_category',
                                label: 'Group by Loan Category',
                                desc: 'Organize results per loan category.',
                            },
                        ].map((opt) => (
                            <FormFieldWrapper
                                control={form.control}
                                key={opt.name}
                                name={
                                    opt.name as
                                        | 'include_interest'
                                        | 'include_arrears'
                                        | 'group_by_loan_category'
                                }
                                render={({ field }) => {
                                    const checked = field.value
                                    return (
                                        <label
                                            className={cn(
                                                'flex flex-col justify-between gap-2 rounded-xl border p-4 cursor-pointer transition-all',
                                                checked
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                    : 'bg-background border-border'
                                            )}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium">
                                                    {opt.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {opt.desc}
                                                </span>
                                            </div>
                                            <div className="flex justify-end">
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={(v) =>
                                                        field.onChange(!!v)
                                                    }
                                                />
                                            </div>
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

export default LoanCollectionDueCreateReportForm

export const LoanCollectionDueCreateReportFormModal = ({
    title = 'Loan Collection Due',
    description = 'Generate collection due report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanCollectionDueFormProps, 'className' | 'onClose'>
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
            <LoanCollectionDueCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
