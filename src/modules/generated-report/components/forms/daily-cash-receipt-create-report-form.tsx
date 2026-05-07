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
import { stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import Modal, { IModalProps } from '@/components/modals/modal'
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
import {
    AccountColumnListFormSection,
    WithAccountColumnListSchema,
} from './account-column-list-form-section'

export const DailyCashReceiptJournalReportSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        report_type: z
            .enum(['by_teller', 'by_daily_total'])
            .default('by_teller'),

        generic_text_printing: z.boolean().optional().default(false),
    })
    .and(WithGeneratedReportSchema)
    .and(WithAccountColumnListSchema)
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

export type TDailyCashReceiptJournalReportSchema = z.infer<
    typeof DailyCashReceiptJournalReportSchema
>

export interface IDailyCashCollectionReceiptJournalReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TDailyCashReceiptJournalReportSchema>,
            IGeneratedReport,
            Error,
            TDailyCashReceiptJournalReportSchema
        > {}

const DailyCashCollectionReceiptJournalCreateReportForm = ({
    className,
    ...formProps
}: IDailyCashCollectionReceiptJournalReportFormProps) => {
    const form = useForm<TDailyCashReceiptJournalReportSchema>({
        resolver: standardSchemaResolver(DailyCashReceiptJournalReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: async () =>
            buildFormDefaults<TDailyCashReceiptJournalReportSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,
                    report_type: 'by_teller',
                    generic_text_printing: false,

                    account_column_list: [],
                    account_column_list_showable_first: 3,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'DailyCashReceiptReport',
                        name: `daily_cash_collection_${toReadableDate(
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

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TDailyCashReceiptJournalReportSchema>({
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
                        label="Report Type"
                        name="report_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'by_teller',
                                        label: 'By Teller',
                                        desc: 'Group the daily cash collection by teller.',
                                    },
                                    {
                                        value: 'by_daily_total',
                                        label: 'By Daily Total',
                                        desc: 'Show the overall daily total cash collected.',
                                    },
                                ].map((opt) => {
                                    const isSelected = field.value === opt.value
                                    return (
                                        <label
                                            className={cn(
                                                'relative flex flex-col gap-1 rounded-lg border p-3 cursor-pointer transition-all',
                                                'hover:bg-accent/50',
                                                isSelected
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                    : 'bg-background border-border'
                                            )}
                                            key={opt.value}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p
                                                    className={cn(
                                                        'text-sm font-medium transition-colors',
                                                        isSelected
                                                            ? 'text-primary'
                                                            : 'text-foreground'
                                                    )}
                                                >
                                                    {opt.label}
                                                </p>
                                                <RadioGroupItem
                                                    value={opt.value}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {opt.desc}
                                            </p>
                                        </label>
                                    )
                                })}
                            </RadioGroup>
                        )}
                    />

                    <AccountColumnListFormSection form={form} />
                    <FormLabel
                        className="text-muted-foreground text-xs"
                        tabIndex={-1}
                    >
                        Other Options
                    </FormLabel>
                    <FormFieldWrapper
                        control={form.control}
                        name="generic_text_printing"
                        render={({ field }) => (
                            <fieldset>
                                <label
                                    className={cn(
                                        'group flex items-start gap-3 rounded-xl border p-4 cursor-pointer',
                                        'transition-all duration-700 ease-out',
                                        'bg-popover border-border',
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
                                            Generic Text Printing
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Enable to print the report in plain
                                            text format.
                                        </span>
                                    </div>
                                </label>
                            </fieldset>
                        )}
                    />

                    <Separator />
                    <PrintSettingsSection
                        displayMode="dropdown"
                        form={
                            form as unknown as UseFormReturn<TWithReportConfigSchema>
                        }
                        registryKey="cash_receipt_journal_report_template"
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

export default DailyCashCollectionReceiptJournalCreateReportForm

export const DailyCashCollectionReceiptJournalCreateReportFormModal = ({
    title = 'Create Daily Cash Collection Report',
    description = 'Define filters and report configuration for daily cash collection',
    className,
    formProps,
    closeOnSuccess = true,
    ...props
}: IModalProps & {
    closeOnSuccess?: boolean
    formProps?: Omit<
        IDailyCashCollectionReceiptJournalReportFormProps,
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
            className={cn('sm:max-w-xl', className)}
            description={description}
            title={title}
            {...props}
            onOpenChange={onOpenChange}
            open={open}
        >
            <DailyCashCollectionReceiptJournalCreateReportForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    if (closeOnSuccess) onOpenChange(false)
                }}
            />
        </Modal>
    )
}
