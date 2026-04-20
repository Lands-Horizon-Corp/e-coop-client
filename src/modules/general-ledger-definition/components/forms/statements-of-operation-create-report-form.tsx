import { UseFormReturn, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { MonthSelector } from '@/components/selects/month-select'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { getTemplateAt } from '../../../generated-report/generated-report-template-registry'
import {
    StatementOfOperationsReportSchema,
    TStatementOfOperationsReportSchema,
} from '../../general-ledger-definition.validation'

export interface IStatementOfOperationsReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TStatementOfOperationsReportSchema>,
            IGeneratedReport,
            Error,
            TStatementOfOperationsReportSchema
        > {}

export const StatementOfOperationsReportCreateForm = ({
    className,
    defaultValues,
    readOnly,
    onSuccess,
    onError,
}: IStatementOfOperationsReportFormProps) => {
    const form = useForm<TStatementOfOperationsReportSchema>({
        resolver: standardSchemaResolver(StatementOfOperationsReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            report_type: 'standard',
            as_of_previous_year: false,
            ...defaultValues,
            report_config: {
                // TODO: Report Template - Jervx
                ...getTemplateAt(undefined, 0),
                module: 'FinancialStatementDefinition',
                name: `statement_of_operations_report_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}`,
                ...defaultValues?.report_config,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: { onSuccess, onError },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TStatementOfOperationsReportSchema>({
            form,
            readOnly,
        })

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
                    className="space-y-4"
                    disabled={generateMutation.isPending || readOnly}
                >
                    <div className="flex gap-x-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Month *"
                            name="month"
                            render={({ field }) => (
                                <MonthSelector
                                    onMonthChange={field.onChange}
                                    selectedMonth={field.value}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Year *"
                            name="year"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled('year')}
                                />
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Report Type *"
                        name="report_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'standard', label: 'Standard' },
                                    {
                                        value: 'comparative_monthly',
                                        label: 'Comparative Monthly',
                                    },
                                    {
                                        value: 'comparative_yearly',
                                        label: 'Comparative Yearly',
                                    },
                                    {
                                        value: 'budget_forecasted',
                                        label: 'Budget Forecasted',
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
                        name="as_of_previous_year"
                        render={({ field }) => {
                            const isActive =
                                form.watch('report_type') ===
                                'comparative_yearly'

                            return (
                                <fieldset>
                                    <label
                                        className={cn(
                                            'group flex items-start gap-3 rounded-xl border p-4 transition-all duration-700 ease-out',
                                            'bg-popover border-border',
                                            isActive
                                                ? 'hover:border-primary/40 hover:shadow-sm cursor-pointer'
                                                : 'opacity-50 cursor-not-allowed pointer-events-none',
                                            field.value && isActive
                                                ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                                : ''
                                        )}
                                    >
                                        <Checkbox
                                            checked={field.value}
                                            className={cn(
                                                'mt-1 transition-all',
                                                field.value && 'border-primary'
                                            )}
                                            disabled={!isActive}
                                            onCheckedChange={(val) =>
                                                field.onChange(!!val)
                                            }
                                        />
                                        <div className="flex flex-col">
                                            <span
                                                className={cn(
                                                    'text-sm font-medium transition-colors',
                                                    field.value && isActive
                                                        ? 'text-primary'
                                                        : 'text-foreground'
                                                )}
                                            >
                                                As of Previous Year
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Use previous year's snapshot for
                                                comparison in comparative yearly
                                                report.
                                            </span>
                                        </div>
                                    </label>
                                </fieldset>
                            )
                        }}
                    />

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

export const StatementOfOperationsReportCreateFormModal = ({
    title = 'Create Statement of Operations Report',
    description = 'Define filters and configuration for statement of operations',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: IStatementOfOperationsReportFormProps
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
            <StatementOfOperationsReportCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
