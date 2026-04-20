import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import AreaCombobox from '@/modules/area/components/area-combobox'
import { CurrencyInput } from '@/modules/currency'
import {
    IGeneratedReport,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import {
    TWithReportConfigSchema,
    WithGeneratedReportSchema,
} from '@/modules/generated-report/generated-report.validation'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import {
    CakeIcon,
    MoneyBagIcon,
    MoneyStackIcon,
    TrashIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

export const MemberListingSchema = z
    .object({
        date_filter_mode: z
            .enum(['membership_date', 'birth_date'])
            .default('membership_date'),

        from_date: stringDateWithTransformSchema,
        to_date: stringDateWithTransformSchema,

        with_mem_fee: z.boolean().default(false),
        exclude_other_info: z.boolean().default(false),
        include_closed_acct: z.boolean().default(false),
        damayan_only: z.boolean().default(false),

        group_by: z
            .enum([
                'barangay',
                'occupation',
                'classification',
                'age_range',
                'year',
                'month',
                'age_year',
                'no_grouping',
                'area',
                'education',
                'share_capital',
                'group',
                'collector',
                'income_range',
            ])
            .default('no_grouping'),

        header_groupings: z
            .enum(['by_member_type', 'by_barangay'])
            .default('by_member_type'),

        sort_by: z
            .enum(['passbook_number', 'member_name'])
            .default('member_name'),

        report_type: z.enum(['summary', 'detail']).default('summary'),

        loan_balance_filter: z
            .enum(['all', 'w_o_loan_bal', 'with_loan_bal'])
            .default('all'),

        member_type_id: entityIdSchema.optional(),
        barangay: z.string().optional(),
        member_occupation_id: entityIdSchema.optional(),
        member_classification_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),
        area_id: entityIdSchema.optional(),
        collector_id: entityIdSchema.optional(),

        age_ranges: z
            .array(
                z.object({
                    from: z.coerce.number().min(1).default(0),
                    to: z.coerce.number().min(1).default(0),
                })
            )
            .optional()
            .default([]),

        income_ranges: z
            .array(
                z.object({
                    from: z.coerce.number().min(1).default(0),
                    to: z.coerce.number().min(1).default(0),
                })
            )
            .optional()
            .default([]),

        share_capital_ranges: z
            .array(
                z.object({
                    from: z.coerce.number().min(1).default(0),
                    to: z.coerce.number().min(1).default(0),
                })
            )
            .optional()
            .default([]),
    })
    .and(WithGeneratedReportSchema)

export type TMemberListingSchema = z.infer<typeof MemberListingSchema>

export interface IMemberListingFormProps
    extends
        IClassProps,
        IForm<
            Partial<TMemberListingSchema>,
            IGeneratedReport,
            Error,
            TMemberListingSchema
        > {}

const MemberListingCreateReportForm = ({
    className,
    ...formProps
}: IMemberListingFormProps) => {
    const form = useForm<TMemberListingSchema>({
        resolver: standardSchemaResolver(MemberListingSchema),
        defaultValues: async () =>
            buildFormDefaults<TMemberListingSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    date_filter_mode: 'membership_date',
                    from_date: undefined,
                    to_date: undefined,

                    with_mem_fee: false,
                    exclude_other_info: false,
                    include_closed_acct: false,
                    damayan_only: false,

                    group_by: 'no_grouping',
                    header_groupings: 'by_member_type',
                    sort_by: 'member_name',
                    report_type: 'summary',
                    loan_balance_filter: 'all',

                    member_type_id: undefined,
                    barangay: '',
                    member_occupation_id: undefined,
                    member_classification_id: undefined,
                    member_group_id: undefined,
                    area_id: undefined,
                    collector_id: undefined,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        module: 'GeneratedReport',
                        name: `member_listing_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TMemberListingSchema>({
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
                    className="space-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Date Filter Mode"
                            name="date_filter_mode"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 gap-3"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'membership_date',
                                            title: 'Membership Date',
                                            desc: 'Filter members by their membership registration date',
                                        },
                                        {
                                            value: 'birth_date',
                                            title: 'Birth Date',
                                            desc: 'Filter members by their date of birth',
                                        },
                                    ].map((v) => {
                                        const selected = field.value === v.value

                                        return (
                                            <label
                                                className={cn(
                                                    'relative flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all',
                                                    'hover:shadow-md hover:scale-[1.01]',
                                                    selected
                                                        ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-background border-primary shadow-sm'
                                                        : 'bg-muted/40'
                                                )}
                                                key={v.value}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <RadioGroupItem
                                                        value={v.value}
                                                    />
                                                    <span className="font-medium text-sm">
                                                        {v.title}
                                                    </span>
                                                </div>

                                                <span className="text-xs text-muted-foreground pl-6">
                                                    {v.desc}
                                                </span>
                                            </label>
                                        )
                                    })}
                                </RadioGroup>
                            )}
                        />

                        <div className="flex gap-2">
                            <FormFieldWrapper
                                control={form.control}
                                label="From Date"
                                name="from_date"
                                render={({ field }) => <InputDate {...field} />}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="To Date"
                                name="to_date"
                                render={({ field }) => <InputDate {...field} />}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-muted/60 border">
                            {[
                                {
                                    key: 'with_mem_fee',
                                    label: 'With Membership Fee',
                                },
                                {
                                    key: 'exclude_other_info',
                                    label: 'Exclude Other Info',
                                },
                                {
                                    key: 'include_closed_acct',
                                    label: 'Include Closed Account',
                                },
                                {
                                    key: 'damayan_only',
                                    label: 'Damayan Only',
                                },
                            ].map((opt) => (
                                <FormFieldWrapper
                                    control={form.control}
                                    key={opt.key}
                                    name={opt.key as keyof TMemberListingSchema}
                                    render={({ field }) => (
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={!!field.value}
                                                onCheckedChange={(v) =>
                                                    field.onChange(!!v)
                                                }
                                            />
                                            <span className="text-sm">
                                                {opt.label}
                                            </span>
                                        </label>
                                    )}
                                />
                            ))}
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="Group By"
                            name="group_by"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-3 gap-2 p-4 rounded-xl bg-muted/60 border"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        'barangay',
                                        'occupation',
                                        'classification',
                                        'age_range',
                                        'year',
                                        'month',
                                        'age_year',
                                        'no_grouping',
                                        'area',
                                        'education',
                                        'share_capital',
                                        'group',
                                        'collector',
                                        'income_range',
                                    ].map((v) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={v}
                                        >
                                            <RadioGroupItem value={v} />
                                            <span>{v}</span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>

                    <div className="gap-x-4 grid grid-cols-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Header Groupings"
                            name="header_groupings"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid gap-2 p-4 rounded-xl bg-muted/60 border"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'by_member_type',
                                            label: 'By Member Type',
                                        },
                                        {
                                            value: 'by_barangay',
                                            label: 'By Barangay',
                                        },
                                    ].map((v) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={v.value}
                                        >
                                            <RadioGroupItem value={v.value} />
                                            <span>{v.label}</span>
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
                                    className="grid gap-2 p-4 rounded-xl bg-muted/60 border"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'passbook_number',
                                            label: 'Passbook Number',
                                        },
                                        {
                                            value: 'member_name',
                                            label: 'Member Name',
                                        },
                                    ].map((v) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={v.value}
                                        >
                                            <RadioGroupItem value={v.value} />
                                            <span>{v.label}</span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Report Type"
                            name="report_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid gap-2 p-4 rounded-xl bg-muted/60 border"
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
                                    ].map((v) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={v.value}
                                        >
                                            <RadioGroupItem value={v.value} />
                                            <span>{v.label}</span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />

                        <FormFieldWrapper
                            className="col-span-3"
                            control={form.control}
                            label="Loan Balance Filter"
                            name="loan_balance_filter"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-3 gap-2 p-4 rounded-xl bg-muted/60 border"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'all',
                                            label: 'All',
                                        },
                                        {
                                            value: 'w_o_loan_bal',
                                            label: 'Without Loan Balance',
                                        },
                                        {
                                            value: 'with_loan_bal',
                                            label: 'With Loan Balance',
                                        },
                                    ].map((v) => (
                                        <label
                                            className="flex items-center gap-2 text-sm"
                                            key={v.value}
                                        >
                                            <RadioGroupItem value={v.value} />
                                            <span>{v.label}</span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <AgeRangesSection
                            form={form}
                            trigger={
                                <Button
                                    className="w-full"
                                    type="button"
                                    variant="outline"
                                >
                                    <CakeIcon />
                                    Age Ranges
                                </Button>
                            }
                        />

                        <IncomeRangesSection
                            form={form}
                            trigger={
                                <Button
                                    className="w-full"
                                    type="button"
                                    variant="outline"
                                >
                                    <MoneyBagIcon />
                                    Income Ranges
                                </Button>
                            }
                        />

                        <ShareCapitalRangesSection
                            form={form}
                            trigger={
                                <Button
                                    className="w-full"
                                    type="button"
                                    variant="outline"
                                >
                                    <MoneyStackIcon />
                                    Share Capital Ranges
                                </Button>
                            }
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
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
                                <Input {...field} placeholder="Barangay" />
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
                            label="Classification"
                            name="member_classification_id"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Classification"
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
                            label="Collector"
                            name="collector_id"
                            render={({ field }) => (
                                <Input {...field} placeholder="Collector" />
                            )}
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

export const AgeRangesSection = ({
    form,
    title = 'Age Ranges',
    description = 'Define age ranges',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TMemberListingSchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'age_ranges',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({ from: 0, to: 0 })
        },
        { keydown: true, enableOnFormTags: true }
    )

    return (
        <Modal
            className={cn('!max-w-lg border-muted w-full', className)}
            closeButtonClassName="sr-only"
            description={description}
            onOpenChange={setState}
            open={state}
            title={title}
            titleHeaderContainerClassName="sr-only"
            trigger={trigger}
            {...props}
        >
            <div className="flex justify-between">
                <div>
                    <p className="text-lg font-medium">Age Ranges</p>
                    <p className="text-sm text-muted-foreground">
                        Define age ranges
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        <KbdGroup>
                            <Kbd>Ctrl</Kbd>
                            <Kbd>Enter</Kbd>
                        </KbdGroup>
                    </p>
                    <Button
                        onClick={() => append({ from: 0, to: 0 })}
                        size="xs"
                        type="button"
                        variant="secondary"
                    >
                        Add Entry
                    </Button>
                </div>
            </div>

            <Table
                className="border-separate border-spacing-0"
                wrapperClassName="border-none ring-2 ring-muted h-[60vh] rounded-xl bg-muted/30 ecoop-scroll overflow-auto"
            >
                <TableHeader className="bg-popover/80 sticky top-0">
                    <TableRow>
                        <TableHead className="w-[60px] text-center">
                            #
                        </TableHead>
                        <TableHead className="text-center">From</TableHead>
                        <TableHead className="text-center">To</TableHead>
                        <TableHead className="w-[60px]" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell className="text-center py-2">
                                {index + 1}
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    type="text"
                                    {...form.register(
                                        `age_ranges.${index}.from`,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    type="text"
                                    {...form.register(
                                        `age_ranges.${index}.to`,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Button
                                    onClick={() => remove(index)}
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                >
                                    <TrashIcon className="size-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Modal>
    )
}

export const IncomeRangesSection = ({
    form,
    title = 'Income Ranges',
    description = 'Define income ranges',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TMemberListingSchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'income_ranges',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({ from: 0, to: 0 })
        },
        { keydown: true, enableOnFormTags: true }
    )

    return (
        <Modal
            className={cn('!max-w-lg border-muted w-full', className)}
            closeButtonClassName="sr-only"
            description={description}
            onOpenChange={setState}
            open={state}
            title={title}
            titleHeaderContainerClassName="sr-only"
            trigger={trigger}
            {...props}
        >
            <div className="flex justify-between">
                <div>
                    <p className="text-lg font-medium">Income Ranges</p>
                    <p className="text-sm text-muted-foreground">
                        Define income ranges
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        <KbdGroup>
                            <Kbd>Ctrl</Kbd>
                            <Kbd>Enter</Kbd>
                        </KbdGroup>
                    </p>
                    <Button
                        onClick={() => append({ from: 0, to: 0 })}
                        size="xs"
                        type="button"
                        variant="secondary"
                    >
                        Add Entry
                    </Button>
                </div>
            </div>

            <Table
                className="border-separate border-spacing-0"
                wrapperClassName="border-none ring-2 ring-muted h-[60vh] rounded-xl bg-muted/30 ecoop-scroll overflow-auto"
            >
                <TableHeader className="bg-popover/80 sticky top-0">
                    <TableRow>
                        <TableHead className="w-[60px] text-center">
                            #
                        </TableHead>
                        <TableHead className=" text-center">From</TableHead>
                        <TableHead className=" text-center">To</TableHead>
                        <TableHead className="w-[60px]" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell className="text-center py-2">
                                {index + 1}
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name={`income_ranges.${index}.from`}
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            className=""
                                            onValueChange={(newValue = '') => {
                                                onChange(newValue)
                                            }}
                                            placeholder="From"
                                        />
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name={`income_ranges.${index}.to`}
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            className=""
                                            onValueChange={(newValue = '') => {
                                                onChange(newValue)
                                            }}
                                            placeholder="From"
                                        />
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Button
                                    onClick={() => remove(index)}
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                >
                                    <TrashIcon className="size-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Modal>
    )
}

export const ShareCapitalRangesSection = ({
    form,
    title = 'Share Capital Ranges',
    description = 'Define share capital ranges',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TMemberListingSchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'share_capital_ranges',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({ from: 0, to: 0 })
        },
        { keydown: true, enableOnFormTags: true }
    )

    return (
        <Modal
            className={cn('!max-w-lg border-muted w-full', className)}
            closeButtonClassName="sr-only"
            description={description}
            onOpenChange={setState}
            open={state}
            title={title}
            titleHeaderContainerClassName="sr-only"
            trigger={trigger}
            {...props}
        >
            <div className="flex justify-between">
                <div>
                    <p className="text-lg font-medium">Share Capital Ranges</p>
                    <p className="text-sm text-muted-foreground">
                        Define share capital ranges
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        <KbdGroup>
                            <Kbd>Ctrl</Kbd>
                            <Kbd>Enter</Kbd>
                        </KbdGroup>
                    </p>
                    <Button
                        onClick={() => append({ from: 0, to: 0 })}
                        size="xs"
                        type="button"
                        variant="secondary"
                    >
                        Add Entry
                    </Button>
                </div>
            </div>

            <Table
                className="border-separate border-spacing-0"
                wrapperClassName="border-none ring-2 ring-muted h-[60vh] rounded-xl bg-muted/30 ecoop-scroll overflow-auto"
            >
                <TableHeader className="bg-popover/80 sticky top-0">
                    <TableRow>
                        <TableHead className="w-[60px] text-center">
                            #
                        </TableHead>
                        <TableHead className="text-center">From</TableHead>
                        <TableHead className="text-center">To</TableHead>
                        <TableHead className="w-[60px]" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell className="text-center py-2">
                                {index + 1}
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name={`share_capital_ranges.${index}.from`}
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            onValueChange={(newValue = '') => {
                                                onChange(newValue)
                                            }}
                                            placeholder="From"
                                        />
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name={`share_capital_ranges.${index}.to`}
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            onValueChange={(newValue = '') => {
                                                onChange(newValue)
                                            }}
                                            placeholder="To"
                                        />
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Button
                                    onClick={() => remove(index)}
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                >
                                    <TrashIcon className="size-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Modal>
    )
}

export const MemberListingCreateReportFormModal = ({
    title = 'Member Listing',
    description = 'Generate member listing report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberListingFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('!max-w-4xl', className)}
            description={description}
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <MemberListingCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
