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

export const CashCheckDisbursementReportSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,
        start_cv: z.string().optional(),
        end_cv: z.string().optional(),
        account: z.any().optional(),
        account_id: z.string().optional(),

        include_loan_releases: z.boolean().default(false),
        include_withdrawals: z.boolean().default(false),

        filter_type: z
            .enum(['date_release', 'entry_date'])
            .default('date_release'),

        report_type: z
            .enum(['standard', 'tabulated', 'single_col'])
            .default('standard'),

        print_type: z.enum(['summary', 'detail']).default('summary'),

        display_type: z.enum(['check_no', 'pb_no']).default('check_no'),

        sort_by: z.enum(['cv_no', 'check_no']).default('cv_no'),

        no_grouping: z.boolean().default(false),
        include_cancelled_cv: z.boolean().default(false),
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

export type TCashCheckDisbursementReportSchema = z.infer<
    typeof CashCheckDisbursementReportSchema
>

export interface ICashCheckDisbursementReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TCashCheckDisbursementReportSchema>,
            IGeneratedReport,
            Error,
            TCashCheckDisbursementReportSchema
        > {}

const CashCheckDisbursementReportCreateForm = ({
    className,
    ...formProps
}: ICashCheckDisbursementReportFormProps) => {
    const form = useForm<TCashCheckDisbursementReportSchema>({
        resolver: standardSchemaResolver(CashCheckDisbursementReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            start_date: undefined,
            end_date: undefined,
            start_cv: '',
            end_cv: '',
            account: undefined,
            account_id: undefined,
            include_loan_releases: false,
            include_withdrawals: false,
            filter_type: 'date_release',
            report_type: 'standard',
            print_type: 'summary',
            display_type: 'check_no',
            sort_by: 'cv_no',
            no_grouping: false,
            include_cancelled_cv: false,
            ...formProps.defaultValues,
            report_config: {
                module: 'Disbursement',
                name: `cash_check_disbursement_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}.pdf`,
                ...formProps.defaultValues?.report_config,
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
        useFormHelper<TCashCheckDisbursementReportSchema>({
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

    const error = serverRequestErrExtractor({
        error: generateMutation.error,
    })

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-3"
                    disabled={generateMutation.isPending || formProps.readOnly}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date *"
                            name="start_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="End Date *"
                            name="end_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start CV"
                            name="start_cv"
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="End CV"
                            name="end_cv"
                            render={({ field }) => <Input {...field} />}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Account"
                        name="account"
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
                                triggerClassName="!w-full !min-w-0 flex-1"
                                value={form.watch('account')}
                            />
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="include_loan_releases"
                            render={({ field }) => (
                                <label
                                    className={cn(
                                        'group flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                        'bg-popover border-border',
                                        field.value &&
                                            'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(v) =>
                                                field.onChange(!!v)
                                            }
                                        />
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                field.value
                                                    ? 'text-primary'
                                                    : 'text-foreground'
                                            )}
                                        >
                                            Include Loan Releases
                                        </span>
                                    </div>
                                </label>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="include_withdrawals"
                            render={({ field }) => (
                                <label
                                    className={cn(
                                        'group flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                        'bg-popover border-border',
                                        field.value &&
                                            'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(v) =>
                                                field.onChange(!!v)
                                            }
                                        />
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                field.value
                                                    ? 'text-primary'
                                                    : 'text-foreground'
                                            )}
                                        >
                                            Include Withdrawals
                                        </span>
                                    </div>
                                </label>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 text-sm sm:grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Filter Type"
                            name="filter_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'date_release',
                                            label: 'Date Release',
                                        },
                                        {
                                            value: 'entry_date',
                                            label: 'Entry Date',
                                        },
                                    ].map((opt) => (
                                        <label
                                            className="flex items-center gap-2"
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
                            label="Print Type"
                            name="print_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        { value: 'summary', label: 'Summary' },
                                        { value: 'detail', label: 'Detail' },
                                    ].map((opt) => (
                                        <label
                                            className="flex items-center gap-2"
                                            key={opt.value}
                                        >
                                            <RadioGroupItem value={opt.value} />
                                            {opt.label}
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
                                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'standard',
                                        label: 'Standard',
                                        desc: 'Default grouped layout.',
                                    },
                                    {
                                        value: 'tabulated',
                                        label: 'Tabulated',
                                        desc: 'Summarized table view.',
                                    },
                                    {
                                        value: 'single_col',
                                        label: 'Single Column',
                                        desc: 'Compact layout.',
                                    },
                                ].map((opt) => {
                                    const isSelected = field.value === opt.value
                                    return (
                                        <label
                                            className={cn(
                                                'flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                                isSelected
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <FormFieldWrapper
                            control={form.control}
                            label="Display Type"
                            name="display_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'check_no',
                                            label: 'Check No',
                                        },
                                        { value: 'pb_no', label: 'PB No' },
                                    ].map((opt) => (
                                        <label
                                            className="flex items-center gap-2"
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
                                        { value: 'cv_no', label: 'CV No' },
                                        {
                                            value: 'check_no',
                                            label: 'Check No',
                                        },
                                    ].map((opt) => (
                                        <label
                                            className="flex items-center gap-2"
                                            key={opt.value}
                                        >
                                            <RadioGroupItem value={opt.value} />
                                            {opt.label}
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="no_grouping"
                            render={({ field }) => (
                                <label
                                    className={cn(
                                        'group flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                        'bg-popover border-border',
                                        field.value &&
                                            'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(v) =>
                                                field.onChange(!!v)
                                            }
                                        />
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                field.value
                                                    ? 'text-primary'
                                                    : 'text-foreground'
                                            )}
                                        >
                                            No Grouping
                                        </span>
                                    </div>
                                </label>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="include_cancelled_cv"
                            render={({ field }) => (
                                <label
                                    className={cn(
                                        'group flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                        'bg-popover border-border',
                                        field.value &&
                                            'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(v) =>
                                                field.onChange(!!v)
                                            }
                                        />
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                field.value
                                                    ? 'text-primary'
                                                    : 'text-foreground'
                                            )}
                                        >
                                            Include Cancelled CV
                                        </span>
                                    </div>
                                </label>
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
                    disableSubmit={
                        !form.formState.isDirty || generateMutation.isPending
                    }
                    error={error}
                    isLoading={generateMutation.isPending}
                    onReset={() => {
                        form.reset(formProps.defaultValues)
                        generateMutation.reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Generate"
                />
            </form>
        </Form>
    )
}

export default CashCheckDisbursementReportCreateForm

export const CashCheckDisbursementReportCreateFormModal = ({
    title = 'Create Cash Check Disbursement Report',
    description = 'Define filters and configuration for cash check disbursement',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<
        ICashCheckDisbursementReportFormProps,
        'className' | 'onClose'
    >
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('sm:max-w-2xl', className)}
            description={description}
            title={title}
            {...props}
            onOpenChange={onOpenChange}
            open={open}
        >
            <CashCheckDisbursementReportCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
