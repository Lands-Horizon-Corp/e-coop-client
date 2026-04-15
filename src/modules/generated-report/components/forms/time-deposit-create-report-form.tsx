import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

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
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const TimeDepositReportSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,
        type: z
            .enum([
                'all',
                'advise_not_advise',
                'monthly',
                'quarterly',
                'semi_annual',
            ])
            .default('all'),
        document_type: z.enum(['td_no', 'cert_no']).default('td_no'),
        amount_display: z
            .enum(['prev_balance', 'unearned_int'])
            .default('prev_balance'),
        sort_by: z
            .enum(['by_td_no', 'by_amount', 'by_name', 'by_entry_date'])
            .default('by_td_no'),
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

export type TTimeDepositReportSchema = z.infer<typeof TimeDepositReportSchema>

export interface ITimeDepositReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TTimeDepositReportSchema>,
            IGeneratedReport,
            Error,
            TTimeDepositReportSchema
        > {}

const TimeDepositCreateReportForm = ({
    className,
    ...formProps
}: ITimeDepositReportFormProps) => {
    const form = useForm<TTimeDepositReportSchema>({
        resolver: standardSchemaResolver(TimeDepositReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            start_date: undefined,
            end_date: undefined,
            type: 'all',
            document_type: 'td_no',
            amount_display: 'prev_balance',
            sort_by: 'by_td_no',
            ...formProps.defaultValues,
            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'Account',
                name: `time_deposit_${toReadableDate(new Date(), 'MMddyy_mmss')}.pdf`,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TTimeDepositReportSchema>({
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date *"
                            name="start_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled(field.name)}
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
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Type"
                        name="type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'all', label: 'All' },
                                    {
                                        value: 'advise_not_advise',
                                        label: 'Advise / Not Advise',
                                    },
                                    { value: 'monthly', label: 'Monthly' },
                                    { value: 'quarterly', label: 'Quarterly' },
                                    {
                                        value: 'semi_annual',
                                        label: 'Semi Annual',
                                    },
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
                        label="Document Type"
                        name="document_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'td_no', label: 'TD No' },
                                    {
                                        value: 'cert_no',
                                        label: 'Certificate No',
                                    },
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
                        label="Amount Display"
                        name="amount_display"
                        render={({ field }) => (
                            <div className="flex flex-col gap-2">
                                <p className="text-xs text-muted-foreground">
                                    Select how you want the amounts to be
                                    displayed in the report.
                                </p>
                                <RadioGroup
                                    className="grid grid-cols-2 gap-3"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <label
                                        className={cn(
                                            'relative flex flex-col gap-1 rounded-lg border p-3 cursor-pointer transition-all hover:bg-accent/50',
                                            field.value === 'prev_balance'
                                                ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                : 'bg-background border-border'
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p
                                                className={cn(
                                                    'text-sm font-medium transition-colors',
                                                    field.value ===
                                                        'prev_balance'
                                                        ? 'text-primary'
                                                        : 'text-foreground'
                                                )}
                                            >
                                                Previous Balance
                                            </p>
                                            <RadioGroupItem value="prev_balance" />
                                        </div>
                                    </label>

                                    <label
                                        className={cn(
                                            'relative flex flex-col gap-1 rounded-lg border p-3 cursor-pointer transition-all hover:bg-accent/50',
                                            field.value === 'unearned_int'
                                                ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                : 'bg-background border-border'
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p
                                                className={cn(
                                                    'text-sm font-medium transition-colors',
                                                    field.value ===
                                                        'unearned_int'
                                                        ? 'text-primary'
                                                        : 'text-foreground'
                                                )}
                                            >
                                                Unearned Interest
                                            </p>
                                            <RadioGroupItem value="unearned_int" />
                                        </div>
                                    </label>
                                </RadioGroup>
                            </div>
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
                                    { value: 'by_td_no', label: 'By TD No' },
                                    { value: 'by_amount', label: 'By Amount' },
                                    { value: 'by_name', label: 'By Name' },
                                    {
                                        value: 'by_entry_date',
                                        label: 'By Entry Date',
                                    },
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

export default TimeDepositCreateReportForm

export const TimeDepositCreateReportFormModal = ({
    title = 'Create Time Deposit Report',
    description = 'Define filters and report configuration for Time Deposit report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITimeDepositReportFormProps, 'className' | 'onClose'>
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
            <TimeDepositCreateReportForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
