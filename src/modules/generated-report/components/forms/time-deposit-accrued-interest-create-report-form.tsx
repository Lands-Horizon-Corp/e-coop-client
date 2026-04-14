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
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
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

export const TimeDepositAccruedInterestSchema = z
    .object({
        from_date: stringDateWithTransformSchema,
        to_date: stringDateWithTransformSchema,
        member_type_id: z.string().optional(),
        groupings: z.enum(['no_grouping', 'terms']).default('no_grouping'),
        sort_by: z
            .enum(['by_td_no', 'by_amount', 'by_name'])
            .default('by_td_no'),
    })
    .and(WithGeneratedReportSchema)

export type TTimeDepositAccruedInterestSchema = z.infer<
    typeof TimeDepositAccruedInterestSchema
>

export interface ITimeDepositAccruedInterestFormProps
    extends
        IClassProps,
        IForm<
            Partial<TTimeDepositAccruedInterestSchema>,
            IGeneratedReport,
            Error,
            TTimeDepositAccruedInterestSchema
        > {}

const TimeDepositAccruedInterestCreateReportForm = ({
    className,
    ...formProps
}: ITimeDepositAccruedInterestFormProps) => {
    const form = useForm<TTimeDepositAccruedInterestSchema>({
        resolver: standardSchemaResolver(TimeDepositAccruedInterestSchema),
        defaultValues: {
            from_date: undefined,
            to_date: undefined,
            member_type_id: undefined,
            groupings: 'no_grouping',
            sort_by: 'by_td_no',

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `time_deposit_accrued_interest_${toReadableDate(
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
        useFormHelper<TTimeDepositAccruedInterestSchema>({
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
                            label="From Date"
                            name="from_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="To Date"
                            name="to_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                    </div>

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
                        label="Sort By"
                        name="sort_by"
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                className="flex flex-wrap gap-1.5"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'by_td_no', label: 'TD No' },
                                    { value: 'by_amount', label: 'Amount' },
                                    { value: 'by_name', label: 'Name' },
                                ].map((opt) => {
                                    const active = field.value === opt.value

                                    return (
                                        <label key={opt.value}>
                                            <RadioGroupItem
                                                className="sr-only"
                                                value={opt.value}
                                            />
                                            <div
                                                className={cn(
                                                    'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-all select-none',
                                                    active
                                                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                                        : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                                )}
                                                onClick={() =>
                                                    field.onChange(opt.value)
                                                }
                                            >
                                                {opt.label}
                                            </div>
                                        </label>
                                    )
                                })}
                            </RadioGroup>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Groupings"
                        name="groupings"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'no_grouping',
                                        label: 'No Grouping',
                                        desc: 'No grouping applied, raw listing output.',
                                    },
                                    {
                                        value: 'terms',
                                        label: 'Terms',
                                        desc: 'Group results by term duration.',
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

export default TimeDepositAccruedInterestCreateReportForm

export const TimeDepositAccruedInterestCreateReportFormModal = ({
    title = 'Time Deposit Accrued Interest',
    description = 'Generate time deposit accrued interest report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<
        ITimeDepositAccruedInterestFormProps,
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
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <TimeDepositAccruedInterestCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
