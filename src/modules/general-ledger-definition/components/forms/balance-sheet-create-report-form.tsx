// BalanceSheetReportCreateForm.tsx
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
import { Form, FormLabel } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import {
    BalanceSheetReportSchema,
    TBalanceSheetReportSchema,
} from '../../general-ledger-definition.validation'

export interface IBalanceSheetReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TBalanceSheetReportSchema>,
            IGeneratedReport,
            Error,
            TBalanceSheetReportSchema
        > {}

export const BalanceSheetReportCreateForm = ({
    className,
    defaultValues,
    readOnly,
    onSuccess,
    onError,
}: IBalanceSheetReportFormProps) => {
    const form = useForm<TBalanceSheetReportSchema>({
        resolver: standardSchemaResolver(BalanceSheetReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            report_type: 'standard',
            as_of_previous_year: false,
            sort_by_link_code: false,
            ...defaultValues,
            report_config: {
                module: 'FinancialStatementDefinition',
                name: `balance_sheet_report_${toReadableDate(
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
        useFormHelper<TBalanceSheetReportSchema>({ form, readOnly })

    const onSubmit = form.handleSubmit(({ report_config, ...filters }) => {
        generateMutation.mutate({
            ...report_config,
            generated_report_type: 'pdf',
            filters,
        })
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: generateMutation.error })
    const watchReportType = form.watch('report_type')

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-2"
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
                                        value: 'closed_book',
                                        label: 'Closed Book',
                                    },
                                    {
                                        value: 'budget_forecasting',
                                        label: 'Budget Forecasting',
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

                    <FormLabel
                        className="text-muted-foreground text-xs"
                        tabIndex={-1}
                    >
                        Other Options
                    </FormLabel>
                    <div className="flex gap-x-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="as_of_previous_year"
                            render={({ field }) => {
                                const isActive =
                                    watchReportType === 'comparative_yearly'
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
                                                    field.value &&
                                                        'border-primary'
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
                                                    Include previous year's
                                                    balance for comparison.
                                                </span>
                                            </div>
                                        </label>
                                    </fieldset>
                                )
                            }}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="sort_by_link_code"
                            render={({ field }) => (
                                <fieldset>
                                    <label
                                        className={cn(
                                            'group flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-700 ease-out',
                                            'bg-popover border-border',
                                            'hover:border-primary/40 hover:shadow-sm',
                                            field.value &&
                                                'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                        )}
                                    >
                                        <Checkbox
                                            checked={field.value}
                                            className={cn(
                                                'mt-1 transition-all',
                                                field.value && 'border-primary'
                                            )}
                                            onCheckedChange={(val) =>
                                                field.onChange(!!val)
                                            }
                                        />
                                        <div className="flex flex-col">
                                            <span
                                                className={cn(
                                                    'text-sm font-medium transition-colors',
                                                    field.value
                                                        ? 'text-primary'
                                                        : 'text-foreground'
                                                )}
                                            >
                                                Sort by Link Code
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Sort the balance sheet by link
                                                code for easier reference.
                                            </span>
                                        </div>
                                    </label>
                                </fieldset>
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

export const BalanceSheetReportCreateFormModal = ({
    title = 'Create Balance Sheet Report',
    description = 'Define Filters and Report configuration for balance sheet',
    className,
    formProps,
    ...props
}: IModalProps & { formProps?: IBalanceSheetReportFormProps }) => {
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
            <BalanceSheetReportCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
