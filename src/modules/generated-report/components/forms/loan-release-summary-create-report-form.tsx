import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import EmployeePicker from '@/modules/employee/components/employee-picker'
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
import { XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormLabel } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const LoanReleaseSummarySchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,
        processor_id: entityIdSchema.optional(),
        processor: z.any().optional(),
        groupings: z
            .enum([
                'by_class_cat',
                'by_account',
                'by_area',
                'barangay',
                'group',
                'by_category',
                'by_purpose',
                'by_occupation',
            ])
            .default('by_class_cat'),
        mode_of_payment: z
            .enum([...LOAN_MODE_OF_PAYMENT, 'all'])
            .default('all'),
        loan_amount_type: z.enum(['granted', 'applied']).default('granted'),
        format: z
            .enum([
                'format_1',
                'format_2',
                'processor',
                'release',
                'format_5',
                'age_range',
            ])
            .default('format_1'),
        loan_type: z.enum(['all', 'disbursement', 'journal']).default('all'),
        include_terms: z.boolean().default(false),
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

export type TLoanReleaseSummarySchema = z.infer<typeof LoanReleaseSummarySchema>

export interface ILoanReleaseSummaryFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanReleaseSummarySchema>,
            IGeneratedReport,
            Error,
            TLoanReleaseSummarySchema
        > {}

const LoanReleaseSummaryCreateReportForm = ({
    className,
    ...formProps
}: ILoanReleaseSummaryFormProps) => {
    const form = useForm<TLoanReleaseSummarySchema>({
        resolver: standardSchemaResolver(LoanReleaseSummarySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            start_date: undefined,
            end_date: undefined,
            loan_amount_type: 'granted',
            loan_type: 'all',
            format: 'format_1',
            mode_of_payment: 'all',
            groupings: 'by_class_cat',
            ...formProps.defaultValues,
            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `loan_release_summary_${toReadableDate(
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
        useFormHelper<TLoanReleaseSummarySchema>({
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

                    <FormFieldWrapper
                        control={form.control}
                        label="Processor"
                        name="processor_id"
                        render={({ field }) => {
                            const selected = form.getValues('processor')

                            return (
                                <div className="flex items-center gap-2">
                                    <EmployeePicker
                                        {...field}
                                        onSelect={(value) => {
                                            field.onChange(value?.user_id)
                                            form.setValue(
                                                'processor',
                                                value?.user
                                            )
                                        }}
                                        placeholder="ALL Employee"
                                        value={selected}
                                    />

                                    {selected && (
                                        <Button
                                            onClick={() => {
                                                field.onChange(undefined)
                                                form.setValue(
                                                    'processor',
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
                                    'by_class_cat',
                                    'by_account',
                                    'by_area',
                                    'barangay',
                                    'group',
                                    'by_category',
                                    'by_purpose',
                                    'by_occupation',
                                ].map((v) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={v}
                                    >
                                        <RadioGroupItem value={v} />
                                        {v}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

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
                                {['all', ...LOAN_MODE_OF_PAYMENT].map((v) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={v}
                                    >
                                        <RadioGroupItem value={v} />
                                        {v}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Loan Amount Type"
                        name="loan_amount_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'granted',
                                        label: 'Granted',
                                        desc: 'Shows approved and released loan amounts.',
                                    },
                                    {
                                        value: 'applied',
                                        label: 'Applied',
                                        desc: 'Includes all applied loan amounts regardless of approval.',
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
                        label="Format"
                        name="format"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    'format_1',
                                    'format_2',
                                    'processor',
                                    'release',
                                    'format_5',
                                    'age_range',
                                ].map((v) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={v}
                                    >
                                        <RadioGroupItem value={v} />
                                        {v}
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
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {['all', 'disbursement', 'journal'].map((v) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={v}
                                    >
                                        <RadioGroupItem value={v} />
                                        {v}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            {
                                name: 'include_terms',
                                label: 'Include Terms',
                                desc: 'Displays loan terms and duration in the report.',
                            },
                            {
                                name: 'include_cancelled_cv',
                                label: 'Include Cancelled C.V.',
                                desc: 'Includes cancelled cash vouchers in the results.',
                            },
                        ].map((opt) => (
                            <FormFieldWrapper
                                control={form.control}
                                key={opt.name}
                                name={
                                    opt.name as
                                        | 'include_terms'
                                        | 'include_cancelled_cv'
                                }
                                render={({ field }) => {
                                    const checked = field.value
                                    return (
                                        <label
                                            className={cn(
                                                'relative flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                                'hover:bg-accent/50',
                                                checked
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                    : 'bg-background border-border'
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={cn(
                                                        'text-sm font-medium',
                                                        checked
                                                            ? 'text-primary'
                                                            : 'text-foreground'
                                                    )}
                                                >
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

export default LoanReleaseSummaryCreateReportForm

export const LoanReleaseSummaryCreateReportFormModal = ({
    title = 'Loan Release Summary',
    description = 'Define filters and generate loan release summary report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanReleaseSummaryFormProps, 'className' | 'onClose'>
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
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <LoanReleaseSummaryCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
