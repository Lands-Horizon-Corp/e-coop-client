import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import AreaCombobox from '@/modules/area/components/area-combobox'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import MemberDepartmentCombobox from '@/modules/member-department/components/member-department-combobox'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

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

export const AccountBalanceReportSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        include_zero_amount: z.boolean().default(false),
        export_to_excel: z.boolean().default(false),

        sort_by: z
            .enum(['by_passbook_no', 'by_name'])
            .default('by_passbook_no'),

        member_type_id: entityIdSchema.optional(),
        barangay: z.string().optional(),
        member_occupation_id: entityIdSchema.optional(),
        member_department_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),
        member_address_area_id: entityIdSchema.optional(),
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

export type TAccountBalanceReportSchema = z.infer<
    typeof AccountBalanceReportSchema
>

export interface IAccountBalanceReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TAccountBalanceReportSchema>,
            IGeneratedReport,
            Error,
            TAccountBalanceReportSchema
        > {}

const AccountBalanceCreateReportForm = ({
    className,
    ...formProps
}: IAccountBalanceReportFormProps) => {
    const form = useForm<TAccountBalanceReportSchema>({
        resolver: standardSchemaResolver(AccountBalanceReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: async () =>
            buildFormDefaults<TAccountBalanceReportSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,
                    include_zero_amount: false,
                    export_to_excel: false,
                    sort_by: 'by_passbook_no',
                    barangay: 'ALL',

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'AccountBalanceReport',
                        name: `account_balance_${toReadableDate(
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
        useFormHelper<TAccountBalanceReportSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(({ report_config, ...filters }) => {
        generateMutation.mutate({
            ...report_config,
            generated_report_type: form.getValues('export_to_excel')
                ? 'excel'
                : 'pdf',
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
                        label="Sort By"
                        name="sort_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'by_passbook_no',
                                        label: 'By Passbook No',
                                    },
                                    { value: 'by_name', label: 'By Name' },
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Member Type"
                            name="member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    {...field}
                                    onChange={(selected) =>
                                        field.onChange(selected?.id)
                                    }
                                    placeholder="All member type"
                                    undefinable
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Barangay"
                            name="barangay"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Occupation"
                            name="member_occupation_id"
                            render={({ field }) => (
                                <MemberOccupationCombobox
                                    {...field}
                                    onChange={(selected) =>
                                        field.onChange(selected?.id)
                                    }
                                    placeholder="All occupation"
                                    undefinable
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Department"
                            name="member_department_id"
                            render={({ field }) => (
                                <MemberDepartmentCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
                                    undefinable
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Group"
                            name="member_group_id"
                            render={({ field }) => (
                                <MemberGroupCombobox
                                    {...field}
                                    onChange={(selected) =>
                                        field.onChange(selected?.id)
                                    }
                                    placeholder="All group"
                                    undefinable
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Area"
                            name="member_address_area_id"
                            render={({ field }) => (
                                <AreaCombobox
                                    {...field}
                                    onChange={(selected) =>
                                        field.onChange(selected?.id)
                                    }
                                    placeholder="All area"
                                    undefinable
                                />
                            )}
                        />
                    </div>

                    <FormLabel
                        className="text-muted-foreground text-xs"
                        tabIndex={-1}
                    >
                        Other Options
                    </FormLabel>

                    <FormFieldWrapper
                        control={form.control}
                        name="include_zero_amount"
                        render={({ field }) => (
                            <label
                                className={cn(
                                    'group flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all',
                                    'bg-popover border-border',
                                    field.value &&
                                        'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                )}
                            >
                                <Checkbox
                                    checked={field.value}
                                    className={cn(
                                        'mt-1',
                                        field.value && 'border-primary'
                                    )}
                                    onCheckedChange={(val) =>
                                        field.onChange(!!val)
                                    }
                                />
                                <div className="flex flex-col">
                                    <span
                                        className={cn(
                                            'text-sm font-medium',
                                            field.value
                                                ? 'text-primary'
                                                : 'text-foreground'
                                        )}
                                    >
                                        Include Zero Amount
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Include accounts with zero balance in
                                        the report.
                                    </span>
                                </div>
                            </label>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="export_to_excel"
                        render={({ field }) => (
                            <label
                                className={cn(
                                    'group flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all',
                                    'bg-popover border-border',
                                    field.value &&
                                        'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                )}
                            >
                                <Checkbox
                                    checked={field.value}
                                    className={cn(
                                        'mt-1',
                                        field.value && 'border-primary'
                                    )}
                                    onCheckedChange={(val) =>
                                        field.onChange(!!val)
                                    }
                                />
                                <div className="flex flex-col">
                                    <span
                                        className={cn(
                                            'text-sm font-medium',
                                            field.value
                                                ? 'text-primary'
                                                : 'text-foreground'
                                        )}
                                    >
                                        Export to Excel
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Generate the report in Excel format
                                        instead of PDF.
                                    </span>
                                </div>
                            </label>
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

export default AccountBalanceCreateReportForm

export const AccountBalanceCreateReportFormModal = ({
    title = 'Account Balance',
    description = 'Define filters and configuration for account balance report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IAccountBalanceReportFormProps, 'className' | 'onClose'>
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
            <AccountBalanceCreateReportForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
