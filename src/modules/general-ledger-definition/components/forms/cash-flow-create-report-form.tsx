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
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import {
    CashFlowReportSchema,
    TCashFlowReportSchema,
} from '../../general-ledger-definition.validation'

export interface ICashFlowReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TCashFlowReportSchema>,
            IGeneratedReport,
            Error,
            TCashFlowReportSchema
        > {}

export const CashFlowReportCreateForm = ({
    className,
    defaultValues,
    readOnly,
    onSuccess,
    onError,
}: ICashFlowReportFormProps) => {
    const form = useForm<TCashFlowReportSchema>({
        resolver: standardSchemaResolver(CashFlowReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            comparative_type: 'yearly',
            ...defaultValues,
            report_config: {
                module: 'FinancialStatementDefinition',
                name: `cash_flow_report_${toReadableDate(
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
        useFormHelper<TCashFlowReportSchema>({
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
                        label="Comparative Type"
                        name="comparative_type"
                        render={({ field }) => (
                            <fieldset className="grid grid-cols-2 gap-2">
                                {[
                                    {
                                        value: 'yearly',
                                        label: 'Yearly',
                                        description:
                                            'Compare against previous year.',
                                    },
                                    {
                                        value: 'monthly',
                                        label: 'Monthly',
                                        description:
                                            'Compare against previous month.',
                                    },
                                ].map((opt) => {
                                    const active = field.value === opt.value

                                    return (
                                        <label
                                            className={cn(
                                                'group flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-700 ease-out',
                                                'bg-popover border-border',
                                                'hover:border-primary/40 hover:shadow-sm',
                                                active &&
                                                    'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                            )}
                                            key={opt.value}
                                        >
                                            <RadioGroup
                                                className="contents"
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <RadioGroupItem
                                                    className="mt-1"
                                                    value={opt.value}
                                                />
                                            </RadioGroup>

                                            <div className="flex flex-col">
                                                <span
                                                    className={cn(
                                                        'text-sm font-medium transition-colors',
                                                        active
                                                            ? 'text-primary'
                                                            : 'text-foreground'
                                                    )}
                                                >
                                                    {opt.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {opt.description}
                                                </span>
                                            </div>
                                        </label>
                                    )
                                })}
                            </fieldset>
                        )}
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

export const CashFlowReportCreateFormModal = ({
    title = 'Create Cash Flow Report',
    description = 'Define filters and configuration for cash flow report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: ICashFlowReportFormProps
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
            <CashFlowReportCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
