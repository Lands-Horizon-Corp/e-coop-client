import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { LOAN_MODE_OF_PAYMENT } from '@/modules/loan-transaction/loan.constants'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'
import { XIcon } from 'lucide-react'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
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

export const LoanMaturitySchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,
        filter_by_date_release_from: stringDateWithTransformSchema.optional(),
        filter_by_date_release_to: stringDateWithTransformSchema.optional(),
        member_type_id: entityIdSchema.optional(),
        barangay: z.string().optional(),
        account_id: entityIdSchema.optional(),
        account: z.any().optional(),
        teller_id: entityIdSchema.optional(),
        teller: z.any().optional(),
        collector_id: entityIdSchema.optional(),
        collector: z.any().optional(),
        group_by_loan_category: z.boolean().default(false),
        sort_by: z
            .enum(['passbook_number', 'member_name'])
            .default('passbook_number'),
        grouping: z
            .enum([
                'by_account',
                'by_barangay',
                'mclass_area_mtype_grp',
                'brgy_act_ltype',
                'no_grouping',
                'pd_by_prev_mos',
            ])
            .default('no_grouping'),
        mode_of_payment: z
            .enum([...LOAN_MODE_OF_PAYMENT, 'all'])
            .default('all'),
    })
    .and(WithGeneratedReportSchema)

export type TLoanMaturitySchema = z.infer<typeof LoanMaturitySchema>

export interface ILoanMaturityFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanMaturitySchema>,
            IGeneratedReport,
            Error,
            TLoanMaturitySchema
        > {}

const LoanMaturityCreateReportForm = ({
    className,
    ...formProps
}: ILoanMaturityFormProps) => {
    const form = useForm<TLoanMaturitySchema>({
        resolver: standardSchemaResolver(LoanMaturitySchema),
        defaultValues: async () =>
            buildFormDefaults<TLoanMaturitySchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,
                    sort_by: 'passbook_number',
                    grouping: 'no_grouping',
                    mode_of_payment: 'all',

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'LoanMaturityReport',
                        name: `loan_maturity_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TLoanMaturitySchema>({
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
                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Date Release From"
                            name="filter_by_date_release_from"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Date Release To"
                            name="filter_by_date_release_to"
                            render={({ field }) => <InputDate {...field} />}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Member Type"
                            name="member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All member type"
                                    undefinable
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Barangay"
                            name="barangay"
                            render={({ field }) => <Input {...field} />}
                        />

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
                                    onSelect={(acc) => {
                                        field.onChange(acc?.id)
                                        form.setValue('account', acc)
                                    }}
                                    placeholder="All Account"
                                    triggerClassName="!w-full !min-w-0 flex-1"
                                    value={form.getValues('account')}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Teller"
                            name="teller_id"
                            render={({ field }) => {
                                const selected = form.getValues('teller')
                                return (
                                    <div className="flex items-center gap-2">
                                        <EmployeePicker
                                            {...field}
                                            onSelect={(v) => {
                                                field.onChange(v?.user_id)
                                                form.setValue('teller', v?.user)
                                            }}
                                            placeholder="ALL Teller"
                                            value={selected}
                                        />
                                        {selected && (
                                            <Button
                                                onClick={() => {
                                                    field.onChange(undefined)
                                                    form.setValue(
                                                        'teller',
                                                        undefined
                                                    )
                                                }}
                                                size="icon"
                                                type="button"
                                                variant="ghost"
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                )
                            }}
                        />

                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            label="Collector"
                            name="collector_id"
                            render={({ field }) => {
                                const selected = form.getValues('collector')
                                return (
                                    <div className="flex items-center gap-2">
                                        <EmployeePicker
                                            {...field}
                                            onSelect={(v) => {
                                                field.onChange(v?.user_id)
                                                form.setValue(
                                                    'collector',
                                                    v?.user
                                                )
                                            }}
                                            placeholder="ALL"
                                            value={selected}
                                        />
                                        {selected && (
                                            <Button
                                                onClick={() => {
                                                    field.onChange(undefined)
                                                    form.setValue(
                                                        'collector',
                                                        undefined
                                                    )
                                                }}
                                                size="icon"
                                                type="button"
                                                variant="ghost"
                                            >
                                                <XIcon className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                )
                            }}
                        />
                    </div>

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>

                    <FormFieldWrapper
                        control={form.control}
                        name="group_by_loan_category"
                        render={({ field }) => {
                            const checked = field.value
                            return (
                                <label
                                    className={cn(
                                        'flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all',
                                        'hover:bg-accent/50',
                                        checked
                                            ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                            : 'bg-background border-border'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'text-sm font-medium',
                                            checked
                                                ? 'text-primary'
                                                : 'text-foreground'
                                        )}
                                    >
                                        Group By Loan Category
                                    </span>
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

                    <FormFieldWrapper
                        control={form.control}
                        label="Sort By"
                        name="sort_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'passbook_number',
                                        label: 'Passbook Number',
                                        desc: 'Sort records based on passbook number.',
                                    },
                                    {
                                        value: 'member_name',
                                        label: 'Member Name',
                                        desc: 'Sort records alphabetically.',
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
                        label="Grouping"
                        name="grouping"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    'by_account',
                                    'by_barangay',
                                    'mclass_area_mtype_grp',
                                    'brgy_act_ltype',
                                    'no_grouping',
                                    'pd_by_prev_mos',
                                ].map((v) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={v}
                                    >
                                        <RadioGroupItem value={v} />
                                        {v}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Mode of Payment"
                        name="mode_of_payment"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-4 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[...LOAN_MODE_OF_PAYMENT, 'all'].map((v) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={v}
                                    >
                                        <RadioGroupItem value={v} />
                                        {v}
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

export default LoanMaturityCreateReportForm

export const LoanMaturityCreateReportFormModal = ({
    title = 'Loan Maturity',
    description = 'Define filters and generate loan maturity report',
    className,
    formProps,
    closeOnSuccess = true,
    ...props
}: IModalProps & {
    closeOnSuccess?: boolean
    formProps?: Omit<ILoanMaturityFormProps, 'className' | 'onClose'>
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
            <LoanMaturityCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    if (closeOnSuccess) onOpenChange(false)
                }}
            />
        </Modal>
    )
}
