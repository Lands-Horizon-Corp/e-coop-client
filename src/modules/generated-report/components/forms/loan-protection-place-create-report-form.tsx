import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { CurrencyInput } from '@/modules/currency'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
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

export const LoanProtectionPlanReportSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        account: z.any(),
        account_id: entityIdSchema.optional(),

        amount_covered: z.string().optional(),

        start_terms: z.string().optional(),
        end_terms: z.string().optional(),

        sort_by: z.enum(['name', 'date_release']).default('name'),
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

export type TLoanProtectionPlanReportSchema = z.infer<
    typeof LoanProtectionPlanReportSchema
>

export interface ILoanProtectionPlanReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanProtectionPlanReportSchema>,
            IGeneratedReport,
            Error,
            TLoanProtectionPlanReportSchema
        > {}

const LoanProtectionPlanCreateReportForm = ({
    className,
    ...formProps
}: ILoanProtectionPlanReportFormProps) => {
    const form = useForm<TLoanProtectionPlanReportSchema>({
        resolver: standardSchemaResolver(LoanProtectionPlanReportSchema),
        mode: 'onSubmit',
        defaultValues: async () =>
            buildFormDefaults<TLoanProtectionPlanReportSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,
                    amount_covered: '',
                    start_terms: '',
                    end_terms: '',
                    sort_by: 'name',

                    report_config: {
                        report_name: 'LoanProtectionReport',
                        name: `loan_protection_plan_${toReadableDate(
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

    const { formRef, handleFocusError } =
        useFormHelper<TLoanProtectionPlanReportSchema>({
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

    const error = serverRequestErrExtractor({
        error: generateMutation.error,
    })

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
                    className="space-y-3"
                    disabled={generateMutation.isPending || formProps.readOnly}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        label="Account"
                        name="account_id"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                allowClear
                                hideDescription
                                mode="all"
                                onSelect={(account) => {
                                    field.onChange(account?.id)
                                    form.setValue('account', account)
                                }}
                                placeholder="All Account"
                                triggerClassName="!w-full !min-w-0 flex-1"
                                value={form.watch('account')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Amount Covered"
                        name="amount_covered"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                currency={form.watch('account')?.currency}
                                onValueChange={(newValue = '') => {
                                    onChange(newValue)
                                }}
                                placeholder="0"
                            />
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Terms"
                            name="start_terms"
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="End Terms"
                            name="end_terms"
                            render={({ field }) => <Input {...field} />}
                        />
                    </div>

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
                                    { value: 'name', label: 'Name' },
                                    {
                                        value: 'date_release',
                                        label: 'Date Release',
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
                        form.reset(formProps.defaultValues)
                        generateMutation.reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Generate"
                />
            </form>
        </Form>
    )
}

export default LoanProtectionPlanCreateReportForm

export const LoanProtectionPlanCreateReportFormModal = ({
    title = 'Create Loan Protection Plan Report',
    description = 'Define filters for loan protection plan report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<
        ILoanProtectionPlanReportFormProps,
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
            <LoanProtectionPlanCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
