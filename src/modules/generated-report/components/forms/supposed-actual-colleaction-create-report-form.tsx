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

export const SupposedActualCollectionSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        group_by: z
            .enum([
                'member_type',
                'area',
                'area_month',
                'barangay',
                'group',
                'area_mop',
                'occupation',
                'month',
                'no_group',
            ])
            .default('no_group'),

        filter_by_teller: z
            .enum(['member_tbl', 'tlr_member', 'per_or'])
            .default('member_tbl'),

        report_type: z.enum(['summary', 'detail']).default('summary'),

        sort_by: z.enum(['by_pb_no', 'by_name']).default('by_pb_no'),

        loan_status: z.enum(['all', 'current', 'dq']).default('all'),

        member_type_id: entityIdSchema.optional(),

        account_id: entityIdSchema.optional(),
        account: z.any().optional(),

        barangay: z.string().optional(),

        member_occupation_id: entityIdSchema.optional(),
        member_address_area_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),

        collector_id: entityIdSchema.optional(),
        collector: z.any().optional(),

        account_category_id: entityIdSchema.optional(),

        include_interest: z.boolean().default(false),
        filter_by_dosri: z.boolean().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TSupposedActualCollectionSchema = z.infer<
    typeof SupposedActualCollectionSchema
>

export interface ISupposedActualCollectionFormProps
    extends
        IClassProps,
        IForm<
            Partial<TSupposedActualCollectionSchema>,
            IGeneratedReport,
            Error,
            TSupposedActualCollectionSchema
        > {}

const SupposedActualCollectionCreateReportForm = ({
    className,
    ...formProps
}: ISupposedActualCollectionFormProps) => {
    const form = useForm<TSupposedActualCollectionSchema>({
        resolver: standardSchemaResolver(SupposedActualCollectionSchema),
        defaultValues: async () =>
            buildFormDefaults<TSupposedActualCollectionSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,

                    group_by: 'no_group',
                    filter_by_teller: 'member_tbl',
                    report_type: 'summary',
                    sort_by: 'by_pb_no',
                    loan_status: 'all',

                    member_type_id: undefined,

                    account_id: undefined,
                    account: undefined,

                    barangay: '',

                    member_occupation_id: undefined,
                    member_address_area_id: undefined,
                    member_group_id: undefined,

                    collector_id: undefined,

                    account_category_id: undefined,

                    include_interest: false,
                    filter_by_dosri: false,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        module: 'GeneratedReport',
                        name: `supposed_actual_collection_${toReadableDate(
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
        useFormHelper<TSupposedActualCollectionSchema>({
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
                                    {
                                        value: 'member_type',
                                        label: 'Member Type',
                                    },
                                    { value: 'area', label: 'Area' },
                                    {
                                        value: 'area_month',
                                        label: 'Area Month',
                                    },
                                    {
                                        value: 'barangay',
                                        label: 'Barangay',
                                    },
                                    { value: 'group', label: 'Group' },
                                    {
                                        value: 'area_mop',
                                        label: 'Area MOP',
                                    },
                                    {
                                        value: 'occupation',
                                        label: 'Occupation',
                                    },
                                    { value: 'month', label: 'Month' },
                                    {
                                        value: 'no_group',
                                        label: 'No Group',
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

                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Report Type"
                            name="report_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        { value: 'summary', label: 'Summary' },
                                        { value: 'detail', label: 'Detail' },
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
                                    className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'by_pb_no',
                                            label: 'Passbook No',
                                        },
                                        { value: 'by_name', label: 'Name' },
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

                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Filter By Teller"
                            name="filter_by_teller"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'member_tbl',
                                            label: 'Member Table',
                                        },
                                        {
                                            value: 'tlr_member',
                                            label: 'Teller Member',
                                        },
                                        { value: 'per_or', label: 'Per OR' },
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
                            label="Loan Status"
                            name="loan_status"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        { value: 'all', label: 'All' },
                                        { value: 'current', label: 'Current' },
                                        { value: 'dq', label: 'Delinquent' },
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

                    <div className="grid grid-cols-2 gap-3">
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
                            name="member_address_area_id"
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
                            label="Barangay"
                            name="barangay"
                            render={({ field }) => (
                                <Input {...field} placeholder="All" />
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
                    </div>

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>

                    <div className="grid grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="include_interest"
                            render={({ field }) => {
                                const checked = field.value
                                return (
                                    <label
                                        className={cn(
                                            'flex items-start justify-between gap-3 rounded-xl border p-4 cursor-pointer transition-all',
                                            checked
                                                ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                : 'bg-background border-border'
                                        )}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium">
                                                Include Interest
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Include computed interest in
                                                totals.
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
                            name="filter_by_dosri"
                            render={({ field }) => {
                                const checked = field.value
                                return (
                                    <label
                                        className={cn(
                                            'flex items-start justify-between gap-3 rounded-xl border p-4 cursor-pointer transition-all',
                                            checked
                                                ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                : 'bg-background border-border'
                                        )}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium">
                                                Filter by DOSRI
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Limit results to DOSRI-related
                                                records.
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

export default SupposedActualCollectionCreateReportForm

export const SupposedActualCollectionCreateReportFormModal = ({
    title = 'Supposed and Actual Collection',
    description = 'Generate supposed vs actual collection report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<
        ISupposedActualCollectionFormProps,
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
            className={cn('sm:max-w-4xl', className)}
            description={description}
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <SupposedActualCollectionCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
