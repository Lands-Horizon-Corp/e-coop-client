import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { EmployeeMultiPickerModal } from '@/modules/employee/components/employee-multi-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import {
    WithSignatureSchema,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import {
    SignatureSectionModal,
    TWithSignatureSchema,
} from '@/components/form-components/form-signature-section'
import { SignatureLightIcon, TrashIcon } from '@/components/icons'
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

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const DailyCollectionDetailSchema = z
    .object({
        title: z.string().default('COLLECTION REPORT'),
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        teller_ids: z.array(entityIdSchema).optional(),
        tellers: z.array(z.any()).optional(),

        account_id: z.string().optional(),
        account: z.any().optional(),
        batch_no: z.coerce.number().optional(),

        groupings: z.enum(['by_teller', 'no_grouping']).default('no_grouping'),

        option_type: z.enum(['option_1', 'option_2']).default('option_1'),

        type: z.enum(['standard', 'micro_finance', 'all']).default('standard'),

        print_summary_cash_check: z.boolean().default(false),
        sundries_print_separate_page: z.boolean().default(false),

        daily_collection_entries: z
            .array(
                z.object({
                    trans_date: z.string().optional(),
                    visited: z.string().optional(),
                    responded: z.string().optional(),
                    last_or: z.string().optional(),

                    current_or_used: z
                        .object({
                            current_or_from_1: z.string().optional(),
                            current_or_to_1: z.string().optional(),
                            current_or_from_2: z.string().optional(),
                            current_or_to_2: z.string().optional(),
                        })
                        .optional(),

                    last_msp_or: z.string().optional(),

                    current_msp_or_used: z
                        .object({
                            msp_or_from_1: z.string().optional(),
                            msp_or_to_1: z.string().optional(),
                            msp_or_from_2: z.string().optional(),
                            msp_or_to_2: z.string().optional(),
                        })
                        .optional(),
                })
            )
            .optional()
            .default([]),
    })
    .and(WithGeneratedReportSchema)
    .and(WithSignatureSchema)

export type TDailyCollectionDetailSchema = z.infer<
    typeof DailyCollectionDetailSchema
>

export interface IDailyCollectionDetailFormProps
    extends
        IClassProps,
        IForm<
            Partial<TDailyCollectionDetailSchema>,
            IGeneratedReport,
            Error,
            TDailyCollectionDetailSchema
        > {}

const DailyCollectionDetailCreateReportForm = ({
    className,
    ...formProps
}: IDailyCollectionDetailFormProps) => {
    const form = useForm<TDailyCollectionDetailSchema>({
        resolver: standardSchemaResolver(DailyCollectionDetailSchema),
        defaultValues: async () =>
            buildFormDefaults<TDailyCollectionDetailSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    title: 'COLLECTION REPORT',
                    start_date: undefined,
                    end_date: undefined,

                    teller_ids: undefined,
                    tellers: undefined,

                    account_id: undefined,
                    account: undefined,
                    batch_no: undefined,

                    groupings: 'no_grouping',
                    option_type: 'option_1',
                    type: 'standard',

                    print_summary_cash_check: false,
                    sundries_print_separate_page: false,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'DailyCollectionReport',
                        name: `daily_collection_detail_${toReadableDate(
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
        useFormHelper<TDailyCollectionDetailSchema>({
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
                    <div className="flex justify-end gap-x-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Title"
                            name="title"
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            className="w-fit"
                            control={form.control}
                            name="signatures"
                            render={({
                                field: { value: _value, ...field },
                            }) => {
                                return (
                                    <SignatureSectionModal
                                        form={
                                            form as unknown as UseFormReturn<TWithSignatureSchema>
                                        }
                                        trigger={
                                            <Button
                                                {...field}
                                                className="w-fit mt-6.5"
                                                size="sm"
                                                type="button"
                                                variant="secondary"
                                            >
                                                <SignatureLightIcon /> Sign
                                            </Button>
                                        }
                                    />
                                )
                            }}
                        />
                    </div>

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
                            label="Tellers"
                            name="teller_ids"
                            render={({ field }) => {
                                const tellers = form.getValues('tellers') ?? []
                                const teller_ids =
                                    form.watch('teller_ids') ?? []

                                return (
                                    <div className="flex flex-col gap-y-2">
                                        <EmployeeMultiPickerModal
                                            pickerProps={{
                                                defaultSelected: tellers,
                                                onConfirm: (employees) => {
                                                    field.onChange(
                                                        employees.map(
                                                            (emp) => emp.id
                                                        )
                                                    )
                                                    form.setValue(
                                                        'tellers',
                                                        employees
                                                    )
                                                },
                                            }}
                                            trigger={
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                >
                                                    {teller_ids.length === 0
                                                        ? 'Select tellers'
                                                        : `${field.value?.length} Tellers Selected`}
                                                </Button>
                                            }
                                        />
                                        {teller_ids.length > 0 && (
                                            <span className="text-sm text-muted-foreground">
                                                {teller_ids.length} teller(s)
                                                selected
                                            </span>
                                        )}
                                    </div>
                                )
                            }}
                        />
                        <div className="flex items-center gap-4">
                            <FormFieldWrapper
                                className="w-full"
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
                                className="w-fit"
                                control={form.control}
                                label="Batch No"
                                name="batch_no"
                                render={({ field }) => (
                                    <Input className="w-[80px]" {...field} />
                                )}
                            />
                        </div>
                    </div>

                    <BrowseDailyCollectionEntries
                        form={form}
                        trigger={
                            <Button type="button" variant="outline">
                                Browse Daily Collection Entries
                            </Button>
                        }
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Groupings"
                            name="groupings"
                            render={({ field }) => (
                                <RadioGroup
                                    className="p-4 rounded-xl bg-muted/60 border flex gap-4"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'by_teller',
                                            label: 'By Teller',
                                        },
                                        {
                                            value: 'no_grouping',
                                            label: 'No Grouping',
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
                            label="Option Type"
                            name="option_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="p-4 rounded-xl bg-muted/60 border flex gap-4"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'option_1',
                                            label: 'Option 1',
                                        },
                                        {
                                            value: 'option_2',
                                            label: 'Option 2',
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
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Type"
                        name="type"
                        render={({ field }) => (
                            <RadioGroup
                                className="p-4 rounded-xl bg-muted/60 border flex gap-4"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'standard',
                                        label: 'Standard',
                                    },
                                    {
                                        value: 'micro_finance',
                                        label: 'Micro Finance',
                                    },
                                    { value: 'all', label: 'All' },
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

                    <div className="grid grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="print_summary_cash_check"
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
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                Print Summary Cash & Check
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Include summarized cash and
                                                check totals.
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
                            name="sundries_print_separate_page"
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
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                Sundries Separate Page
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Print sundries in a separate
                                                page.
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

export default DailyCollectionDetailCreateReportForm

// PANG DCRE
const BrowseDailyCollectionEntries = ({
    form,
    title = 'Browse Daily Collection Entry',
    description = 'Manage daily collection entries',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TDailyCollectionDetailSchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'daily_collection_entries',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({
                trans_date: '',
                visited: '',
                responded: '',
                last_or: '',
                current_or_used: {},
                last_msp_or: '',
                current_msp_or_used: {},
            })
        },
        {
            keydown: true,
            enableOnFormTags: true,
        }
    )
    return (
        <Modal
            className={cn('!max-w-[97vw] border-muted w-full', className)}
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
                    <p className="text-lg font-medium">
                        Browse Daily Collection Entry
                    </p>
                    <p className="text-foreground/50 text-sm">
                        Manage daily collection entries
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        <KbdGroup>
                            <Kbd>Ctrl</Kbd>
                            <Kbd>Enter</Kbd>
                        </KbdGroup>{' '}
                    </p>
                    <Button
                        onClick={() =>
                            append({
                                trans_date: '',
                                visited: '',
                                responded: '',
                                last_or: '',
                                current_or_used: {},
                                last_msp_or: '',
                                current_msp_or_used: {},
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
                wrapperClassName="border-none ring-2 ring-muted h-[60vh]  rounded-xl bg-muted/30 ecoop-scroll overflow-auto"
            >
                <TableHeader className="bg-popover/80 sticky top-0">
                    <TableRow>
                        <TableHead
                            className="w-[60px] border-r text-center align-center"
                            rowSpan={2}
                        >
                            #
                        </TableHead>

                        <TableHead
                            className="min-w-[140px] border-r align-center"
                            rowSpan={2}
                        >
                            Trans. Date
                        </TableHead>

                        <TableHead
                            className="min-w-[100px] border-r align-center text-center"
                            rowSpan={2}
                        >
                            Visited
                        </TableHead>

                        <TableHead
                            className="min-w-[110px] border-r align-center text-center"
                            rowSpan={2}
                        >
                            Responded
                        </TableHead>

                        <TableHead
                            className="min-w-[120px] border-r align-center text-center"
                            rowSpan={2}
                        >
                            Last O.R.
                        </TableHead>

                        <TableHead
                            className="text-center border-r border-b min-w-[320px]"
                            colSpan={4}
                        >
                            Current O.R. Used
                        </TableHead>

                        <TableHead
                            className="min-w-[140px] border-r align-center text-center"
                            rowSpan={2}
                        >
                            Last MSP O.R.
                        </TableHead>

                        <TableHead
                            className="text-center border-r border-b min-w-[320px]"
                            colSpan={4}
                        >
                            Current MSP O.R. Used
                        </TableHead>

                        <TableHead
                            className="w-[60px] align-center"
                            rowSpan={2}
                        />
                    </TableRow>

                    <TableRow>
                        <TableHead className="min-w-[90px] border-r text-center">
                            From
                        </TableHead>
                        <TableHead className="min-w-[90px] border-r text-center">
                            To
                        </TableHead>
                        <TableHead className="min-w-[90px] border-r text-center">
                            From
                        </TableHead>
                        <TableHead className="min-w-[90px] border-r text-center">
                            To
                        </TableHead>

                        <TableHead className="min-w-[90px] border-r text-center">
                            From
                        </TableHead>
                        <TableHead className="min-w-[90px] border-r text-center">
                            To
                        </TableHead>
                        <TableHead className="min-w-[90px] border-r text-center">
                            From
                        </TableHead>
                        <TableHead className="min-w-[90px] border-r text-center">
                            To
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell className="py-2 px-2">
                                {index + 1}
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <InputDate
                                    {...form.register(
                                        `daily_collection_entries.${index}.trans_date`
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.visited`
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.responded`
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.last_or`
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.current_or_used.current_or_from_1`
                                    )}
                                />
                            </TableCell>
                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.current_or_used.current_or_to_1`
                                    )}
                                />
                            </TableCell>
                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.current_or_used.current_or_from_2`
                                    )}
                                />
                            </TableCell>
                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.current_or_used.current_or_to_2`
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.last_msp_or`
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.current_msp_or_used.msp_or_from_1`
                                    )}
                                />
                            </TableCell>
                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.current_msp_or_used.msp_or_to_1`
                                    )}
                                />
                            </TableCell>
                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.current_msp_or_used.msp_or_from_2`
                                    )}
                                />
                            </TableCell>
                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `daily_collection_entries.${index}.current_msp_or_used.msp_or_to_2`
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

export const DailyCollectionDetailCreateReportFormModal = ({
    title = 'Daily Collection Detail',
    description = 'Generate daily collection detail report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IDailyCollectionDetailFormProps, 'className' | 'onClose'>
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
            <DailyCollectionDetailCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
