import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
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
import { stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
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

export const LoanCollectionDetailSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        filter_by_date_release_start_date:
            stringDateWithTransformSchema.optional(),
        filter_by_date_release_end_date:
            stringDateWithTransformSchema.optional(),

        mode_of_payment: z
            .enum([...LOAN_MODE_OF_PAYMENT, 'all'])
            .default('all'),

        payment_type: z.enum(['all', 'office', 'field']).default('all'),

        grouping: z
            .enum([
                'by_account',
                'by_group',
                'by_department',
                'by_barangay',
                'by_collector',
            ])
            .default('by_account'),

        member_type_id: z.string().optional(),

        barangay: z.string().optional(),

        member_group_id: z.string().optional(),
        member_department_id: z.string().optional(),

        account_id: z.string().optional(),
        account: z.any().optional(),

        collector_id: z.string().optional(),
        collector: z.any().optional(),

        past_due_below_starting_date: z.boolean().default(false),
        filter_by_teller_based_on_ledger: z.boolean().default(false),
        export_to_excel: z.boolean().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TLoanCollectionDetailSchema = z.infer<
    typeof LoanCollectionDetailSchema
>

export interface ILoanCollectionDetailFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanCollectionDetailSchema>,
            IGeneratedReport,
            Error,
            TLoanCollectionDetailSchema
        > {}

const LoanCollectionDetailCreateReportForm = ({
    className,
    ...formProps
}: ILoanCollectionDetailFormProps) => {
    const form = useForm<TLoanCollectionDetailSchema>({
        resolver: standardSchemaResolver(LoanCollectionDetailSchema),
        defaultValues: {
            start_date: undefined,
            end_date: undefined,

            filter_by_date_release_start_date: undefined,
            filter_by_date_release_end_date: undefined,

            mode_of_payment: 'all',
            payment_type: 'all',
            grouping: 'by_account',

            member_type_id: undefined,
            barangay: '',

            member_group_id: undefined,
            member_department_id: undefined,

            account_id: undefined,
            account: undefined,

            collector_id: undefined,
            collector: undefined,

            past_due_below_starting_date: false,
            filter_by_teller_based_on_ledger: false,
            export_to_excel: false,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `loan_collection_detail_${toReadableDate(
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

    const { formRef, handleFocusError } =
        useFormHelper<TLoanCollectionDetailSchema>({
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
                    <div className="grid grid-cols-2 gap-4">
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
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Release Start"
                            name="filter_by_date_release_start_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Release End"
                            name="filter_by_date_release_end_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Mode of Payment"
                        name="mode_of_payment"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-4 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[...LOAN_MODE_OF_PAYMENT, 'all'].map((v) => (
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
                        label="Payment Type"
                        name="payment_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'all', label: 'All' },
                                    { value: 'office', label: 'Office' },
                                    { value: 'field', label: 'Field' },
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
                        label="Grouping"
                        name="grouping"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'by_account', label: 'Account' },
                                    { value: 'by_group', label: 'Group' },
                                    {
                                        value: 'by_department',
                                        label: 'Department',
                                    },
                                    {
                                        value: 'by_barangay',
                                        label: 'Barangay',
                                    },
                                    {
                                        value: 'by_collector',
                                        label: 'Collector',
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

                    <div className="grid grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Member Type"
                            name="member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
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

                    <div className="grid grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Group"
                            name="member_group_id"
                            render={({ field }) => (
                                <MemberGroupCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
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
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
                                />
                            )}
                        />
                    </div>
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
                                    form.setValue('account', account)
                                }}
                                placeholder="All Account"
                                triggerClassName="!w-full !min-w-0 flex-1"
                                value={form.getValues('account')}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Collector"
                        name="collector_id"
                        render={() => (
                            <p className="text-sm">TODO Collector picker</p>
                        )}
                    />

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            {
                                name: 'past_due_below_starting_date',
                                label: 'Past Due Below Start',
                                desc: 'Include past due below start date.',
                            },
                            {
                                name: 'filter_by_teller_based_on_ledger',
                                label: 'Filter by Teller',
                                desc: 'Use ledger-based teller filtering.',
                            },
                            {
                                name: 'export_to_excel',
                                label: 'Export to Excel',
                                desc: 'Generate report in Excel format.',
                            },
                        ].map((opt) => (
                            <FormFieldWrapper
                                control={form.control}
                                key={opt.name}
                                name={
                                    opt.name as keyof TLoanCollectionDetailSchema
                                }
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

export default LoanCollectionDetailCreateReportForm

export const LoanCollectionDetailCreateReportFormModal = ({
    title = 'Loan Collection Detail',
    description = 'Generate loan collection detail report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanCollectionDetailFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('sm:max-w-3xl', className)}
            description={description}
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <LoanCollectionDetailCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
