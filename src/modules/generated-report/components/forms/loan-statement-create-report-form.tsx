import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
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

export const LoanStatementSchema = z
    .object({
        as_of_date: stringDateWithTransformSchema,

        member_id: z.string().optional(),
        member: z.any().optional(),

        account_id: z.string().optional(),
        account: z.any().optional(),

        category_id: z.string().optional(),
        category_description: z.any().optional(),

        group_id: z.string().optional(),

        collector_id: z.string().optional(),
        collector: z.any().optional(),

        filter_by: z.enum(['all', 'due']).default('all'),

        remarks: z.string().optional(),
        include_notes: z.boolean().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TLoanStatementSchema = z.infer<typeof LoanStatementSchema>

export interface ILoanStatementFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanStatementSchema>,
            IGeneratedReport,
            Error,
            TLoanStatementSchema
        > {}

const LoanStatementCreateReportForm = ({
    className,
    ...formProps
}: ILoanStatementFormProps) => {
    const form = useForm<TLoanStatementSchema>({
        resolver: standardSchemaResolver(LoanStatementSchema),
        defaultValues: {
            as_of_date: undefined,

            member_id: undefined,
            member: undefined,

            account_id: undefined,
            account: undefined,

            category_id: undefined,
            category_description: undefined,

            group_id: undefined,

            collector_id: undefined,
            collector: undefined,

            filter_by: 'all',

            remarks: '',
            include_notes: false,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `loan_statement_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TLoanStatementSchema>({
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
                        label="As of Date"
                        name="as_of_date"
                        render={({ field }) => <InputDate {...field} />}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Member"
                            name="member_id"
                            render={({ field }) => (
                                <MemberPicker
                                    {...field}
                                    onSelect={(v) => {
                                        field.onChange(v?.id)
                                        form.setValue('member', v)
                                    }}
                                    value={form.getValues('member')}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Account"
                            name="account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    {...field}
                                    allowClear
                                    mode="all"
                                    onSelect={(v) => {
                                        field.onChange(v?.id)
                                        form.setValue('account', v)
                                    }}
                                    placeholder="All Account"
                                    triggerClassName="!w-full !min-w-0 flex-1"
                                    value={form.getValues('account')}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Category"
                            name="category_id"
                            render={({ field }) => (
                                // TODO: TO IMPLEMENT
                                <p {...field}>TO IMPLEMENT CATEGORY</p>
                                // <CategoryPicker
                                //     {...field}
                                //     onSelect={(v) => {
                                //         field.onChange(v?.id)
                                //         form.setValue('category_description', v)
                                //     }}
                                //     value={form.getValues('category_description')}
                                // />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Group"
                            name="group_id"
                            render={({ field }) => (
                                <MemberGroupCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All Group"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Collector"
                            name="collector_id"
                            render={({ field }) => (
                                // TODO: TO IMPLEMENT
                                <p {...field}>TODO Collector</p>
                                // <CollectorPicker
                                //     {...field}
                                //     onSelect={(v) => {
                                //         field.onChange(v?.id)
                                //         form.setValue('collector', v)
                                //     }}
                                //     value={form.getValues('collector')}
                                // />
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Filter By"
                        name="filter_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'all',
                                        label: 'All',
                                        desc: 'Include all records regardless of status.',
                                    },
                                    {
                                        value: 'due',
                                        label: 'Due Only',
                                        desc: 'Only include records that are currently due.',
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

                    <FormFieldWrapper
                        control={form.control}
                        label="Remarks"
                        name="remarks"
                        render={({ field }) => <Input {...field} />}
                    />

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>
                    <FormFieldWrapper
                        control={form.control}
                        name="include_notes"
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
                                            Include Notes
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Attach additional notes in the
                                            generated loan statement report.
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

export default LoanStatementCreateReportForm

export const LoanStatementCreateReportFormModal = ({
    title = 'Loan Statement',
    description = 'Generate loan statement report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanStatementFormProps, 'className' | 'onClose'>
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
            <LoanStatementCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
