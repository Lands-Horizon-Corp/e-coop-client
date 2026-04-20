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

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
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

export const OtherFundsEntrySchema = z
    .object({
        start_date: z.string(),
        end_date: z.string(),
        start_cv: z.string().optional(),
        end_cv: z.string().optional(),
        code: z.string().optional(),

        filter_type: z
            .enum(['date_release', 'entry_date'])
            .default('date_release'),
        print_type: z.enum(['summary', 'detail']).default('summary'),
        sort_by: z.enum(['cv_no', 'check_no']).default('cv_no'),
        report_type: z.enum(['standard', 'tabulated']).default('standard'),

        include_cancelled_cv: z.boolean().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TOtherFundsEntrySchema = z.infer<typeof OtherFundsEntrySchema>

export interface IOtherFundsEntryFormProps
    extends
        IClassProps,
        IForm<
            Partial<TOtherFundsEntrySchema>,
            IGeneratedReport,
            Error,
            TOtherFundsEntrySchema
        > {}

const OtherFundsEntryCreateReportForm = ({
    className,
    ...formProps
}: IOtherFundsEntryFormProps) => {
    const form = useForm<TOtherFundsEntrySchema>({
        resolver: standardSchemaResolver(OtherFundsEntrySchema),
        defaultValues: async () =>
            buildFormDefaults<TOtherFundsEntrySchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,
                    start_cv: undefined,
                    end_cv: undefined,
                    code: '',
                    filter_type: 'date_release',
                    print_type: 'summary',
                    sort_by: 'cv_no',
                    report_type: 'standard',
                    include_cancelled_cv: false,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        module: 'GeneratedReport',
                        name: `other_funds_entry_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TOtherFundsEntrySchema>(
        {
            form,
            ...formProps,
        }
    )

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
                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date"
                            name="start_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="End Date"
                            name="end_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        label="Code"
                        name="code"
                        render={({ field }) => <Input {...field} />}
                    />

                    <div className="grid grid-cols-3 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Filter Type"
                            name="filter_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid p-4 rounded-xl bg-muted/60 border gap-2"
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
                            label="Print Type"
                            name="print_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'summary',
                                            label: 'Summary',
                                        },
                                        {
                                            value: 'detail',
                                            label: 'Detail',
                                        },
                                    ].map((opt) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={opt.value}
                                        >
                                            <RadioGroupItem value={opt.value} />
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {opt.label}
                                                </span>
                                            </div>
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
                                    className="grid p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        { value: 'cv_no', label: 'CV Number' },
                                        {
                                            value: 'check_no',
                                            label: 'Check Number',
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
                    </div>

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
                                        value: 'standard',
                                        label: 'Standard',
                                        desc: 'Default structured format.',
                                    },
                                    {
                                        value: 'tabulated',
                                        label: 'Tabulated',
                                        desc: 'Spreadsheet-style layout.',
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
                    <FormLabel
                        className="text-muted-foreground text-xs"
                        tabIndex={-1}
                    >
                        Other Options
                    </FormLabel>
                    <FormFieldWrapper
                        control={form.control}
                        name="include_cancelled_cv"
                        render={({ field }) => {
                            const checked = field.value

                            return (
                                <label
                                    className={cn(
                                        'flex items-start justify-between gap-3 rounded-xl border p-4 cursor-pointer transition-all',
                                        'hover:bg-accent/50',
                                        checked
                                            ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                            : 'bg-background border-border'
                                    )}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                checked
                                                    ? 'text-primary'
                                                    : 'text-foreground'
                                            )}
                                        >
                                            Include Cancelled CV
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Include CVs that have been cancelled
                                            in the generated report output.
                                        </span>
                                    </div>

                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={(v) =>
                                            field.onChange(!!v)
                                        }
                                    />
                                </label>
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

export default OtherFundsEntryCreateReportForm

export const OtherFundsEntryCreateReportFormModal = ({
    title = 'Other Funds Entry',
    description = 'Generate other funds entry report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IOtherFundsEntryFormProps, 'className' | 'onClose'>
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
            <OtherFundsEntryCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
