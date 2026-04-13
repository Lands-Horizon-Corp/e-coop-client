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
import { GridIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
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

export const TimeDepositBalanceSchema = z
    .object({
        title: z.string().default('TIME DEPOSIT BALANCE'),

        date: stringDateWithTransformSchema,

        member_type_id: z.string().optional(),

        groupings: z
            .enum(['no_grouping', 'terms', 'td_balance', 'terms_summary'])
            .default('no_grouping'),

        sort_by: z
            .enum(['by_td_no', 'by_amount', 'by_name', 'by_entry_date'])
            .default('by_td_no'),

        document_type: z.enum(['doc_no', 'cert_no']).default('doc_no'),

        exclude_zero_balance: z.boolean().default(false),
        filter_by_maturity: z.boolean().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TTimeDepositBalanceSchema = z.infer<typeof TimeDepositBalanceSchema>

export interface ITimeDepositBalanceFormProps
    extends
        IClassProps,
        IForm<
            Partial<TTimeDepositBalanceSchema>,
            IGeneratedReport,
            Error,
            TTimeDepositBalanceSchema
        > {}

const TimeDepositBalanceCreateReportForm = ({
    className,
    ...formProps
}: ITimeDepositBalanceFormProps) => {
    const form = useForm<TTimeDepositBalanceSchema>({
        resolver: standardSchemaResolver(TimeDepositBalanceSchema),
        defaultValues: {
            title: 'TIME DEPOSIT BALANCE',
            date: undefined,
            member_type_id: undefined,
            groupings: 'no_grouping',
            sort_by: 'by_td_no',
            document_type: 'doc_no',
            exclude_zero_balance: false,
            filter_by_maturity: false,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `time_deposit_balance_${toReadableDate(
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
        useFormHelper<TTimeDepositBalanceSchema>({
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
                    <FormFieldWrapper
                        control={form.control}
                        label="Title"
                        name="title"
                        render={({ field }) => <Input {...field} />}
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Date"
                            name="date"
                            render={({ field }) => <InputDate {...field} />}
                        />

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
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Groupings"
                            name="groupings"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'no_grouping',
                                            label: 'No Grouping',
                                        },
                                        { value: 'terms', label: 'Terms' },
                                        {
                                            value: 'td_balance',
                                            label: 'TD Balance',
                                        },
                                        {
                                            value: 'terms_summary',
                                            label: 'Terms Summary',
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

                        <FormFieldWrapper
                            control={form.control}
                            label="Sort By"
                            name="sort_by"
                            render={({ field }) => (
                                <div className="flex flex-col gap-2">
                                    <RadioGroup
                                        className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border gap-2"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {[
                                            {
                                                value: 'by_td_no',
                                                label: 'TD No',
                                            },
                                            {
                                                value: 'by_amount',
                                                label: 'Amount',
                                            },
                                            {
                                                value: 'by_name',
                                                label: 'Name',
                                            },
                                            {
                                                value: 'by_entry_date',
                                                label: 'Entry Date',
                                            },
                                        ].map((opt) => (
                                            <label
                                                className="flex items-center gap-2 text-sm"
                                                key={opt.value}
                                            >
                                                <RadioGroupItem
                                                    value={opt.value}
                                                />
                                                <span>{opt.label}</span>
                                            </label>
                                        ))}
                                    </RadioGroup>
                                </div>
                            )}
                        />
                    </div>

                    <Button
                        className="w-fit"
                        size="sm"
                        type="button"
                        variant="secondary"
                    >
                        <GridIcon /> Table
                    </Button>

                    <FormFieldWrapper
                        control={form.control}
                        label="Document Type"
                        name="document_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'doc_no',
                                        label: 'Document No',
                                        desc: 'Use standard document number.',
                                    },
                                    {
                                        value: 'cert_no',
                                        label: 'Certificate No',
                                        desc: 'Use certificate number format.',
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

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>

                    <div className="grid grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="exclude_zero_balance"
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
                                                Exclude Zero Balance
                                            </span>
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={(v) =>
                                                    field.onChange(!!v)
                                                }
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            Exclude accounts with zero balance.
                                        </span>
                                    </label>
                                )
                            }}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="filter_by_maturity"
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
                                                Filter by Maturity
                                            </span>
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={(v) =>
                                                    field.onChange(!!v)
                                                }
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            Only include matured time deposits.
                                        </span>
                                    </label>
                                )
                            }}
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

export default TimeDepositBalanceCreateReportForm

export const TimeDepositBalanceCreateReportFormModal = ({
    title = 'Time Deposit Balance',
    description = 'Generate time deposit balance report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITimeDepositBalanceFormProps, 'className' | 'onClose'>
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
            <TimeDepositBalanceCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
