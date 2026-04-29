import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { LOAN_MODE_OF_PAYMENT } from '@/modules/loan-transaction/loan.constants'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
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

const formatLabel = (v: string) =>
    v.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export const LoanBalancesSchema = z
    .object({
        title: z.string().default('Schedule of Loan Receivable'),

        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        adj_by_date_of_entry: z.boolean().default(false),
        jv_by_date_of_entry: z.boolean().default(false),
        filtered_by_close_loan: z.boolean().default(false),
        exclude_renewal: z.boolean().default(false),
        print_summary_of_acct: z.boolean().default(false),
        group_by_loan_category: z.boolean().default(false),
        investment: z.boolean().default(false),
        litigation: z.boolean().default(false),

        group_by: z
            .enum([
                'acct_no',
                'barangay',
                'mtype_area_grp_coll',
                'mtype_area_grp',
                'mclass_area_mtype_grp',
                'occupation',
                'sex',
                'mtype_grp',
                'mtype_tlr_grp_rnw',
                'mclass_area_mtype_grp_close',
                'area',
                'group',
                'cat_ltype',
                'acct_stat',
                'year_acct',
                'member',
                'area_amort',
                'purpose',
                'no_group',
            ])
            .default('no_group'),

        include_amount: z.enum(['all', 'delinquent', 'non_dq']).default('all'),

        type: z.enum(['all', 'non_dosri', 'dosri']).default('all'),

        gender: z.enum(['all', 'male', 'female']).default('all'),

        sort_by: z
            .enum(['by_amount', 'by_passbook_no', 'by_name'])
            .default('by_amount'),

        member_type_id: entityIdSchema.optional(),
        account_id: entityIdSchema.optional(),
        account: z.any().optional(),

        barangay: z.string().optional(),

        member_occupation_id: entityIdSchema.optional(),
        member_address_area_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),
        member_classification_id: entityIdSchema.optional(),

        category: z.string().optional(),

        mode_of_payment: z
            .enum([...LOAN_MODE_OF_PAYMENT, 'all'])
            .default('all'),

        print_type: z.enum(['summary', 'detail']).default('summary'),
    })
    .and(WithGeneratedReportSchema)

export type TLoanBalancesSchema = z.infer<typeof LoanBalancesSchema>

export interface ILoanBalancesFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanBalancesSchema>,
            IGeneratedReport,
            Error,
            TLoanBalancesSchema
        > {}

const LoanBalancesCreateReportForm = ({
    className,
    ...formProps
}: ILoanBalancesFormProps) => {
    const form = useForm<TLoanBalancesSchema>({
        resolver: standardSchemaResolver(LoanBalancesSchema),
        defaultValues: async () =>
            buildFormDefaults<TLoanBalancesSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    title: 'Schedule of Loan Receivable',

                    start_date: undefined,
                    end_date: undefined,

                    adj_by_date_of_entry: false,
                    jv_by_date_of_entry: false,
                    filtered_by_close_loan: false,
                    exclude_renewal: false,
                    print_summary_of_acct: false,
                    group_by_loan_category: false,
                    investment: false,
                    litigation: false,

                    group_by: 'no_group',
                    include_amount: 'all',
                    type: 'all',
                    gender: 'all',
                    sort_by: 'by_amount',

                    member_type_id: undefined,
                    account_id: undefined,
                    account: undefined,

                    barangay: '',

                    member_occupation_id: undefined,
                    member_address_area_id: undefined,
                    member_group_id: undefined,
                    member_classification_id: undefined,

                    category: '',

                    mode_of_payment: 'all',
                    print_type: 'summary',

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'LoanBalancesReport',
                        name: `loan_balances_${toReadableDate(
                            new Date(),
                            'MMddyy_mmss'
                        )}`,
                    },
                },
                overrideDefaults: formProps.defaultValues,
            }),
    })

    const generateMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } = useFormHelper<TLoanBalancesSchema>({
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
                    <FormFieldWrapper
                        control={form.control}
                        label="Title"
                        name="title"
                        render={({ field }) => <Input {...field} />}
                    />

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
                                    'acct_no',
                                    'barangay',
                                    'mtype_area_grp_coll',
                                    'mtype_area_grp',
                                    'mclass_area_mtype_grp',
                                    'occupation',
                                    'sex',
                                    'mtype_grp',
                                    'mtype_tlr_grp_rnw',
                                    'mclass_area_mtype_grp_close',
                                    'area',
                                    'group',
                                    'cat_ltype',
                                    'acct_stat',
                                    'year_acct',
                                    'member',
                                    'area_amort',
                                    'purpose',
                                    'no_group',
                                ].map((v) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={v}
                                    >
                                        <RadioGroupItem value={v} />
                                        <span>{formatLabel(v)}</span>
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <div className="grid grid-cols-4 gap-x-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Include Amount"
                            name="include_amount"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid  p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {['all', 'delinquent', 'non_dq'].map(
                                        (v) => (
                                            <label
                                                className="flex items-center gap-2 text-sm"
                                                key={v}
                                            >
                                                <RadioGroupItem value={v} />
                                                <span>{formatLabel(v)}</span>
                                            </label>
                                        )
                                    )}
                                </RadioGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Type"
                            name="type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {['all', 'non_dosri', 'dosri'].map((v) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={v}
                                        >
                                            <RadioGroupItem value={v} />
                                            <span>{formatLabel(v)}</span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Gender"
                            name="gender"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {['all', 'male', 'female'].map((v) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={v}
                                        >
                                            <RadioGroupItem value={v} />
                                            <span>{formatLabel(v)}</span>
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
                                    className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        'by_amount',
                                        'by_passbook_no',
                                        'by_name',
                                    ].map((v) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={v}
                                        >
                                            <RadioGroupItem value={v} />
                                            <span>{formatLabel(v)}</span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>

                    <FormLabel
                        className="text-muted-foreground text-xs"
                        tabIndex={-1}
                    >
                        Other Options
                    </FormLabel>

                    <div className="grid p-4 grid-cols-3 rounded-xl bg-muted/60 border gap-2">
                        {[
                            'adj_by_date_of_entry',
                            'jv_by_date_of_entry',
                            'filtered_by_close_loan',
                            'exclude_renewal',
                            'print_summary_of_acct',
                            'group_by_loan_category',
                            'investment',
                            'litigation',
                        ].map((k) => (
                            <FormFieldWrapper
                                control={form.control}
                                key={k}
                                name={k as keyof TLoanBalancesSchema}
                                render={({ field }) => {
                                    const checked = field.value
                                    return (
                                        <label className="flex items-center gap-x-2">
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={(v) =>
                                                    field.onChange(!!v)
                                                }
                                            />
                                            <span className="text-sm">
                                                {formatLabel(k)}
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
                    disableSubmit={isPending}
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

export const LoanBalancesCreateReportFormModal = ({
    title = 'Loan Balances',
    description = 'Generate loan balances report',
    className,
    formProps,
    closeOnSuccess = true,
    ...props
}: IModalProps & {
    closeOnSuccess?: boolean
    formProps?: Omit<ILoanBalancesFormProps, 'className' | 'onClose'>
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
            <LoanBalancesCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    if (closeOnSuccess) onOpenChange(false)
                }}
            />
        </Modal>
    )
}
