import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { AccountCategoryComboBox } from '@/modules/account-category'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import { XIcon } from '@/components/icons'
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

export const LoanStatementSchema = z
    .object({
        as_of_date: stringDateWithTransformSchema,

        member_id: entityIdSchema.optional(),
        member: z.any().optional(),

        account_id: entityIdSchema.optional(),
        account: z.any().optional(),

        account_category_id: entityIdSchema.optional(),

        group_id: entityIdSchema.optional(),

        collector_id: entityIdSchema.optional(),
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
        defaultValues: async () =>
            buildFormDefaults<TLoanStatementSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    as_of_date: undefined,

                    member_id: undefined,
                    member: undefined,

                    account_id: undefined,
                    account: undefined,

                    account_category_id: undefined,
                    group_id: undefined,

                    collector_id: undefined,
                    collector: undefined,

                    filter_by: 'all',

                    remarks: '',
                    include_notes: false,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        module: 'GeneratedReport',
                        name: `loan_statement_${toReadableDate(
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
                            label="Account Category"
                            name="account_category_id"
                            render={({ field }) => (
                                <AccountCategoryComboBox
                                    onChange={field.onChange}
                                    placeholder="All Category"
                                    undefinable
                                    value={field.value}
                                />
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
