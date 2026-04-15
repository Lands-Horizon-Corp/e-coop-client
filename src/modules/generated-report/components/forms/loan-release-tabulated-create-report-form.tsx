import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { AccountCategoryComboBox } from '@/modules/account-category'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

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

import { getTemplateAt } from '../../generated-report-template-registry'
import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const LoanReleasesReportSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        entry_type: z.enum(['disbursement', 'journal', 'all']).default('all'),

        loan_type: z
            .enum(['personal', 'jewelry', 'grocery', 'all'])
            .default('all'),

        report_type: z.enum(['tabulated', 'register']).default('tabulated'),

        account: z.any().optional(),
        account_id: entityIdSchema.optional(),
        account_category_id: entityIdSchema.optional(),

        start_cv: z.string().optional(),
        end_cv: z.string().optional(),

        include_excluded_to_gl: z.boolean().default(false),
        include_sundries_detail: z.boolean().default(false),
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

export type TLoanReleasesReportSchema = z.infer<typeof LoanReleasesReportSchema>

export interface ILoanReleasesReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanReleasesReportSchema>,
            IGeneratedReport,
            Error,
            TLoanReleasesReportSchema
        > {}

const LoanReleaseCreateReportForm = ({
    className,
    defaultValues,
    readOnly,
    onSuccess,
    onError,
}: ILoanReleasesReportFormProps) => {
    const form = useForm<TLoanReleasesReportSchema>({
        resolver: standardSchemaResolver(LoanReleasesReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            start_date: undefined,
            end_date: undefined,
            entry_type: 'all',
            loan_type: 'all',
            report_type: 'tabulated',
            account: undefined,
            account_id: undefined,
            account_category_id: undefined,
            start_cv: '',
            end_cv: '',
            include_excluded_to_gl: false,
            include_sundries_detail: false,
            ...defaultValues,
            report_config: {
                ...getTemplateAt(undefined, 0),
                module: 'LoanTransaction',
                name: `loan_releases_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}.pdf`,
                ...defaultValues?.report_config,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: { onSuccess, onError },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanReleasesReportSchema>({ form, readOnly })

    const onSubmit = form.handleSubmit(({ report_config, ...filters }) => {
        generateMutation.mutate({
            ...report_config,
            generated_report_type: 'pdf',
            filters,
        })
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: generateMutation.error })

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-3"
                    disabled={generateMutation.isPending || readOnly}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date *"
                            name="start_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled('start_date')}
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
                                    disabled={isDisabled('end_date')}
                                />
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Entry Type"
                        name="entry_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid  grid-cols-3 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'disbursement',
                                        label: 'Disbursement',
                                    },
                                    { value: 'journal', label: 'Journal' },
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

                    <FormFieldWrapper
                        control={form.control}
                        label="Loan Type"
                        name="loan_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-4 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
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
                                        className="flex text-sm items-center gap-2"
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
                        label="Report Type"
                        name="report_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'tabulated',
                                        label: 'Tabulated',
                                        desc: 'Summarized loan releases in table format.',
                                    },
                                    {
                                        value: 'register',
                                        label: 'Register',
                                        desc: 'Detailed transaction-level loan releases.',
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

                    <FormLabel
                        className="text-muted-foreground text-xs"
                        tabIndex={-1}
                    >
                        Other Options
                    </FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="include_excluded_to_gl"
                            render={({ field }) => (
                                <label
                                    className={cn(
                                        'group flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                        'bg-popover border-border',
                                        'hover:border-primary/40 hover:shadow-sm',
                                        field.value &&
                                            'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={field.value}
                                            className={cn(
                                                field.value && 'border-primary'
                                            )}
                                            onCheckedChange={(val) =>
                                                field.onChange(!!val)
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
                                            Include Excluded to GL
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Include transactions excluded from
                                        general ledger.
                                    </span>
                                </label>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="include_sundries_detail"
                            render={({ field }) => (
                                <label
                                    className={cn(
                                        'group flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                        'bg-popover border-border',
                                        'hover:border-primary/40 hover:shadow-sm',
                                        field.value &&
                                            'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={field.value}
                                            className={cn(
                                                field.value && 'border-primary'
                                            )}
                                            onCheckedChange={(val) =>
                                                field.onChange(!!val)
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
                                            Include Sundries Detail
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Show detailed breakdown of sundry
                                        entries.
                                    </span>
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
                        form.reset(defaultValues)
                        generateMutation.reset()
                    }}
                    readOnly={readOnly}
                    submitText="Generate"
                />
            </form>
        </Form>
    )
}

export default LoanReleaseCreateReportForm

export const LoanReleaseCreateReportFormModal = ({
    title = 'Create Loan Releases Report',
    description = 'Define filters and configuration for loan releases report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanReleasesReportFormProps, 'className' | 'onClose'>
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
            <LoanReleaseCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
