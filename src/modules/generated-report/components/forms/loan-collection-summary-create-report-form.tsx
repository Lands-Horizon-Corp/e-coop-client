import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import { AccountMultiPickerModal } from '@/modules/account/components/picker/account-multi-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { LOAN_MODE_OF_PAYMENT } from '@/modules/loan-transaction/loan.constants'
import {
    PercentageSchema,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import { ListOrderedIcon, TrashIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormLabel } from '@/components/ui/form'
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

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const LoanCollectionSummarySchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        filter_by_date_release_start_date:
            stringDateWithTransformSchema.optional(),
        filter_by_date_release_end_date:
            stringDateWithTransformSchema.optional(),

        group_by: z
            .enum([
                'by_class',
                'by_area',
                'by_acct',
                'by_barangay',
                'by_category',
                'by_group',
                'by_collector',
                'by_department',
            ])
            .default('by_class'),

        mode_of_payment: z
            .enum([...LOAN_MODE_OF_PAYMENT, 'all'])
            .default('all'),

        report_type: z
            .enum(['standard', 'table', 'format_3'])
            .default('standard'),

        payment_type: z.enum(['all', 'office', 'field']).default('all'),

        past_due_below_starting_date: z.boolean().default(false),

        loan_collections: z
            .array(
                z.object({
                    description: z.string().optional(),
                    age: PercentageSchema.default(0),
                    account_entries_id: z
                        .array(entityIdSchema)
                        .optional()
                        .default([]),
                    account_entries: z
                        .array(z.any().optional())
                        .optional()
                        .default([]), // UI only
                })
            )
            .optional()
            .default([]),
    })
    .and(WithGeneratedReportSchema)

export type TLoanCollectionSummarySchema = z.infer<
    typeof LoanCollectionSummarySchema
>

export interface ILoanCollectionSummaryFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanCollectionSummarySchema>,
            IGeneratedReport,
            Error,
            TLoanCollectionSummarySchema
        > {}

const LoanCollectionSummaryCreateReportForm = ({
    className,
    ...formProps
}: ILoanCollectionSummaryFormProps) => {
    const form = useForm<TLoanCollectionSummarySchema>({
        resolver: standardSchemaResolver(LoanCollectionSummarySchema),
        defaultValues: async () =>
            buildFormDefaults<TLoanCollectionSummarySchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: '',
                    end_date: '',
                    group_by: 'by_class',
                    mode_of_payment: 'all',
                    report_type: 'standard',
                    payment_type: 'all',
                    past_due_below_starting_date: false,
                    loan_collections: [],
                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'LoanCollectionSummaryReport',
                        name: `loan_collection_summary_${toReadableDate(
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
        useFormHelper<TLoanCollectionSummarySchema>({
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
                            label="Release Date From"
                            name="filter_by_date_release_start_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Release Date To"
                            name="filter_by_date_release_end_date"
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
                                    { value: 'by_class', label: 'Class' },
                                    { value: 'by_area', label: 'Area' },
                                    { value: 'by_acct', label: 'Account' },
                                    { value: 'by_barangay', label: 'Barangay' },
                                    { value: 'by_category', label: 'Category' },
                                    { value: 'by_group', label: 'Group' },
                                    {
                                        value: 'by_collector',
                                        label: 'Collector',
                                    },
                                    {
                                        value: 'by_department',
                                        label: 'Department',
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
                                        <span>{v}</span>
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
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'standard', label: 'Standard' },
                                    { value: 'table', label: 'Table' },
                                    { value: 'format_3', label: 'Format 3' },
                                ].map((opt) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={opt.value}
                                    >
                                        <RadioGroupItem value={opt.value} />
                                        <span>{opt.label}</span>
                                        {opt.value === 'table' && (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                }}
                                            >
                                                <LoanCollectionsSection
                                                    form={form}
                                                    trigger={
                                                        <Button
                                                            disabled={
                                                                field.value !==
                                                                'table'
                                                            }
                                                            size="xs"
                                                            type="button"
                                                            variant="outline"
                                                        >
                                                            <ListOrderedIcon />
                                                            Collection
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Payment Type"
                        name="payment_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'all',
                                        label: 'All',
                                        desc: 'Include all payment sources.',
                                    },
                                    {
                                        value: 'office',
                                        label: 'Office',
                                        desc: 'Payments made in office.',
                                    },
                                    {
                                        value: 'field',
                                        label: 'Field',
                                        desc: 'Payments collected in field.',
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

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>

                    <FormFieldWrapper
                        control={form.control}
                        name="past_due_below_starting_date"
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
                                            Past Due Below Starting Date
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Include past due amounts prior to
                                            selected start date.
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

export default LoanCollectionSummaryCreateReportForm

export const LoanCollectionsSection = ({
    form,
    title = 'Loan Collections',
    description = 'Define loan collection list',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TLoanCollectionSummarySchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'loan_collections',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({
                description: '',
                age: 0,
                account_entries_id: [],
                account_entries: [],
            })
        },
        {
            keydown: true,
            enableOnFormTags: true,
        }
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
                    <p className="text-lg font-medium">Loan Collections</p>
                    <p className="text-sm text-muted-foreground">
                        Define loan collection configurations
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
                        onClick={() =>
                            append({
                                description: '',
                                age: 0,
                                account_entries_id: [],
                                account_entries: [],
                            })
                        }
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
                        <TableHead className="">Description</TableHead>
                        <TableHead className="text-center">Age (%)</TableHead>
                        <TableHead className="w-[800px] text-center">
                            Account Entries
                        </TableHead>
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
                                    className="w-fit"
                                    control={form.control}
                                    name={`loan_collections.${index}.description`}
                                    render={({ field }) => (
                                        <Input
                                            className="w-[100px]"
                                            {...field}
                                        />
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name={`loan_collections.${index}.age`}
                                    render={({ field }) => (
                                        <Input
                                            className="w-[100px]"
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            type="number"
                                            value={field.value ?? 0}
                                        />
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2 w-fit">
                                <FormFieldWrapper
                                    className="w-fit"
                                    control={form.control}
                                    name={`loan_collections.${index}.account_entries_id`}
                                    render={({ field }) => (
                                        <div className="flex flex-col w-fit gap-y-2">
                                            <AccountMultiPickerModal
                                                pickerProps={{
                                                    defaultSelected:
                                                        form.getValues(
                                                            `loan_collections.${index}.account_entries`
                                                        ),
                                                    onConfirm: (accounts) => {
                                                        field.onChange(
                                                            accounts.map(
                                                                (a) => a.id
                                                            )
                                                        )
                                                        form.setValue(
                                                            `loan_collections.${index}.account_entries`,
                                                            accounts
                                                        )
                                                    },
                                                }}
                                                trigger={
                                                    <Button
                                                        className="w-fit"
                                                        size="xs"
                                                        type="button"
                                                        variant="secondary"
                                                    >
                                                        {field?.value
                                                            ?.length === 0
                                                            ? 'Select Accounts'
                                                            : `${field.value?.length} Selected`}
                                                    </Button>
                                                }
                                            />
                                        </div>
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

export const LoanCollectionSummaryCreateReportFormModal = ({
    title = 'Loan Collection Summary',
    description = 'Generate loan collection summary report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanCollectionSummaryFormProps, 'className' | 'onClose'>
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
            <LoanCollectionSummaryCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
