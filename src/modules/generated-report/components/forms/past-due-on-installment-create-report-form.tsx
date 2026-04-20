import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { AccountCategoryComboBox } from '@/modules/account-category'
import AreaCombobox from '@/modules/area/components/area-combobox'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import { XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

export const PastDueOnInstallmentSchema = z
    .object({
        as_of_date: stringDateWithTransformSchema,

        group_by_loan_category: z.boolean().default(false),

        group_by: z
            .enum([
                'no_group',
                'barangay',
                'group',
                'area',
                'mmember_type',
                'member_area',
                'member_type_grp',
                'member_type_area_grp',
                'member_class_area_type_grp',
            ])
            .default('no_group'),

        sort_by: z.enum(['by_pb_no', 'by_name']).default('by_pb_no'),

        member_type_id: entityIdSchema.optional(),

        account_id: entityIdSchema.optional(),
        account: z.any().optional(),

        barangay: z.string().optional(),
        member_occupation_id: entityIdSchema.optional(),
        area_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),

        account_category_id: entityIdSchema.optional(),
        collector_id: entityIdSchema.optional(),
        collector: z.any().optional(),
    })
    .and(WithGeneratedReportSchema)

export type TPastDueOnInstallmentSchema = z.infer<
    typeof PastDueOnInstallmentSchema
>

export interface IPastDueOnInstallmentFormProps
    extends
        IClassProps,
        IForm<
            Partial<TPastDueOnInstallmentSchema>,
            IGeneratedReport,
            Error,
            TPastDueOnInstallmentSchema
        > {}

const PastDueOnInstallmentCreateReportForm = ({
    className,
    ...formProps
}: IPastDueOnInstallmentFormProps) => {
    const form = useForm<TPastDueOnInstallmentSchema>({
        resolver: standardSchemaResolver(PastDueOnInstallmentSchema),
        defaultValues: async () =>
            buildFormDefaults<TPastDueOnInstallmentSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    as_of_date: undefined,

                    group_by_loan_category: false,

                    group_by: 'no_group',
                    sort_by: 'by_pb_no',

                    member_type_id: undefined,

                    account_id: undefined,
                    account: undefined,

                    barangay: '',
                    member_occupation_id: undefined,
                    area_id: undefined,
                    member_group_id: undefined,

                    account_category_id: undefined,
                    collector_id: undefined,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        module: 'GeneratedReport',
                        name: `past_due_on_installment_${toReadableDate(
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
        useFormHelper<TPastDueOnInstallmentSchema>({
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
    const error = serverRequestErrExtractor({
        error: rawError,
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
                    className="grid gap-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="As Of Date"
                        name="as_of_date"
                        render={({ field }) => <InputDate {...field} />}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="group_by_loan_category"
                        render={({ field }) => {
                            const checked = field.value
                            return (
                                <label
                                    className={cn(
                                        'flex items-start justify-between gap-3 rounded-xl border p-4 cursor-pointer',
                                        checked &&
                                            'bg-gradient-to-br from-popover to-primary/20 border-primary'
                                    )}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium">
                                            Group By Loan Category
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Organize results based on loan
                                            categories.
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

                    <FormFieldWrapper
                        control={form.control}
                        label="Group By"
                        name="group_by"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'no_group', label: 'No Group' },
                                    { value: 'barangay', label: 'Barangay' },
                                    { value: 'group', label: 'Group' },
                                    { value: 'area', label: 'Area' },
                                    {
                                        value: 'mmember_type',
                                        label: 'Member Type',
                                    },
                                    {
                                        value: 'member_area',
                                        label: 'Member Area',
                                    },
                                    {
                                        value: 'member_type_grp',
                                        label: 'Member Type Group',
                                    },
                                    {
                                        value: 'member_type_area_grp',
                                        label: 'Member Type Area Group',
                                    },
                                    {
                                        value: 'member_class_area_type_grp',
                                        label: 'Member Class Area Type Group',
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
                            <RadioGroup
                                className="grid grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'by_pb_no',
                                        label: 'Passbook No',
                                        desc: 'Sort records by passbook number.',
                                    },
                                    {
                                        value: 'by_name',
                                        label: 'Name',
                                        desc: 'Sort records alphabetically by member name.',
                                    },
                                ].map((opt) => {
                                    const selected = field.value === opt.value
                                    return (
                                        <label
                                            className={cn(
                                                'flex flex-col gap-1 rounded-xl border p-3 cursor-pointer',
                                                selected &&
                                                    'bg-gradient-to-br from-popover to-primary/20 border-primary'
                                            )}
                                            key={opt.value}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
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

                    <div className="grid grid-cols-3 gap-4">
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            label="Account"
                            name="account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    {...field}
                                    mode="all"
                                    onSelect={(v) => {
                                        field.onChange(v?.id)
                                        form.setValue('account', v)
                                    }}
                                    value={form.getValues('account')}
                                />
                            )}
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
                                    undefinable
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Barangay"
                            name="barangay"
                            render={({ field }) => (
                                <Input {...field} placeholder="All" />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Occupation"
                            name="member_occupation_id"
                            render={({ field }) => (
                                <MemberOccupationCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
                                    undefinable
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Area"
                            name="area_id"
                            render={({ field }) => (
                                <AreaCombobox
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
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
                                    undefinable
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

export const PastDueOnInstallmentCreateReportFormModal = ({
    title = 'Past Due on Installment',
    description = 'Generate past due installment report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IPastDueOnInstallmentFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('sm:max-w-4xl', className)}
            description={description}
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <PastDueOnInstallmentCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
