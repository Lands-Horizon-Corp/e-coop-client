import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const DailyWithdrawalSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        start_ref_no: z.string().optional(),
        end_ref_no: z.string().optional(),

        teller_id: entityIdSchema.optional(),
        teller: z.any().optional(),

        sort_by: z
            .enum(['teller_or_passbook', 'teller_or_name', 'teller'])
            .default('teller'),

        option_type: z
            .enum([
                'option_1',
                'option_2',
                'option_3',
                'option_4',
                'option_5',
                'option_6',
            ])
            .default('option_1'),

        print_type: z.enum(['summary', 'detail']).default('summary'),
    })
    .and(WithGeneratedReportSchema)

export type TDailyWithdrawalSchema = z.infer<typeof DailyWithdrawalSchema>

export interface IDailyWithdrawalFormProps
    extends
        IClassProps,
        IForm<
            Partial<TDailyWithdrawalSchema>,
            IGeneratedReport,
            Error,
            TDailyWithdrawalSchema
        > {}

const DailyWithdrawalCreateReportForm = ({
    className,
    ...formProps
}: IDailyWithdrawalFormProps) => {
    const form = useForm<TDailyWithdrawalSchema>({
        resolver: standardSchemaResolver(DailyWithdrawalSchema),
        defaultValues: async () =>
            buildFormDefaults<TDailyWithdrawalSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,

                    start_ref_no: '',
                    end_ref_no: '',

                    teller_id: undefined,
                    teller: undefined,

                    sort_by: 'teller',
                    option_type: 'option_1',
                    print_type: 'summary',

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'DailyWithdrawalReport',
                        name: `daily_withdrawal_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TDailyWithdrawalSchema>(
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
                            label="Start Ref No"
                            name="start_ref_no"
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="End Ref No"
                            name="end_ref_no"
                            render={({ field }) => <Input {...field} />}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Teller"
                        name="teller_id"
                        render={({ field }) => (
                            <EmployeePicker
                                {...field}
                                onSelect={(v) => {
                                    field.onChange(v?.user_id)
                                    form.setValue('teller', v)
                                }}
                                value={form.getValues('teller')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Sort By"
                        name="sort_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 rounded-xl bg-muted/60 border"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'teller_or_passbook',
                                        label: 'Teller / Passbook',
                                    },
                                    {
                                        value: 'teller_or_name',
                                        label: 'Teller / Name',
                                    },
                                    { value: 'teller', label: 'Teller Only' },
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
                        label="Option Type"
                        name="option_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 rounded-xl bg-muted/60 border"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'option_1', label: 'Option 1' },
                                    { value: 'option_2', label: 'Option 2' },
                                    { value: 'option_3', label: 'Option 3' },
                                    { value: 'option_4', label: 'Option 4' },
                                    { value: 'option_5', label: 'Option 5' },
                                    { value: 'option_6', label: 'Option 6' },
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
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'summary',
                                        label: 'Summary',
                                        desc: 'Consolidated withdrawal report output.',
                                    },
                                    {
                                        value: 'detail',
                                        label: 'Detail',
                                        desc: 'Full transaction-level breakdown.',
                                    },
                                ].map((opt) => {
                                    const isSelected = field.value === opt.value

                                    return (
                                        <label
                                            className={cn(
                                                'flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
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

export default DailyWithdrawalCreateReportForm

export const DailyWithdrawalCreateReportFormModal = ({
    title = 'Daily Withdrawal',
    description = 'Generate daily withdrawal report',
    className,
    formProps,
    closeOnSuccess = true,
    ...props
}: IModalProps & {
    closeOnSuccess?: boolean
    formProps?: Omit<IDailyWithdrawalFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('sm:max-w-3xl', className)}
            description={description}
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <DailyWithdrawalCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    if (closeOnSuccess) onOpenChange(false)
                }}
            />
        </Modal>
    )
}
