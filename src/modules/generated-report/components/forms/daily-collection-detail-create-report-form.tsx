import { useRef, useState } from 'react'

import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker, IAccount } from '@/modules/account'
import { AccountMultiPickerModal } from '@/modules/account/components/picker/account-multi-picker'
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
import {
    DragHandleIcon,
    SignatureLightIcon,
    TrashIcon,
    XIcon,
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

import { IClassProps, IForm, TEntityId } from '@/types'

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

        account_column_list: z
            .array(
                z.object({
                    account_id: entityIdSchema,
                    account: z.any().optional(), // FOR UI only
                })
            )
            .min(1, 'Must have minimum of 1 account column to display')
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

                    account_column_list: [],

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
                    <div className="flex justify-end items-end gap-x-2">
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
                                                className="w-full"
                                                size="sm"
                                                type="button"
                                                variant="secondary"
                                            >
                                                <SignatureLightIcon />{' '}
                                                Signatures
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

                    <div className="grid grid-cols-2 gap-x-4">
                        <BrowseDailyCollectionEntries
                            form={form}
                            trigger={
                                <Button type="button" variant="outline">
                                    Browse Daily Collection Entries
                                </Button>
                            }
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="account_column_list"
                            render={({ field }) => {
                                const accounts =
                                    form.getValues('account_column_list') ?? []

                                return (
                                    <div className="flex flex-col gap-y-2">
                                        <AccountListOrderModal
                                            account_column={accounts}
                                            onApply={(items) => {
                                                const ids = items.map(
                                                    (i) => i.account_id
                                                )
                                                const fullAccounts = items.map(
                                                    (i) => i
                                                )

                                                field.onChange(ids)
                                                form.setValue(
                                                    'account_column_list',
                                                    fullAccounts
                                                )
                                            }}
                                            trigger={
                                                <Button
                                                    // disabled={isDisabled(
                                                    //     field.name
                                                    // )}
                                                    type="button"
                                                    variant="outline"
                                                >
                                                    {(field.value ?? [])
                                                        .length === 0
                                                        ? 'Define Report Account Columns'
                                                        : `${(field.value ?? []).length} Acc Column Defined`}
                                                </Button>
                                            }
                                        />
                                    </div>
                                )
                            }}
                        />
                    </div>

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

// PANG ACCOUNT COLUMN DEFINER
const DND_TYPE = 'ACCOUNT_COLUMN_ITEM'

type TAccountEntry = {
    account_id: TEntityId
    account?: IAccount
}

const reindex = (cols: TAccountEntry[]): TAccountEntry[] =>
    cols.map((c, i) => ({ ...c, index: i }))

export const AccountListOrder = ({
    account_column,
    onApply,
}: {
    account_column: TAccountEntry[]
    onApply: (newAccountColumns: TAccountEntry[]) => void
}) => {
    const [items, setItems] = useState<TAccountEntry[]>(account_column)

    const handleConfirm = (accounts: IAccount[]) => {
        const selectedIds = new Set(accounts.map((a) => a.id))
        const kept = items.filter((c) => selectedIds.has(c.account_id))
        const existingIds = new Set(kept.map((c) => c.account_id))
        const added: TAccountEntry[] = accounts
            .filter((a) => !existingIds.has(a.id))
            .map((a) => ({ account_id: a.id, account: a }))
        setItems(reindex([...kept, ...added]))
    }

    const removeAt = (i: number) => {
        const next = items.slice()
        next.splice(i, 1)
        setItems(reindex(next))
    }

    const moveItem = (from: number, to: number) => {
        if (from === to) return
        setItems((prev) => {
            const next = prev.slice()
            const [moved] = next.splice(from, 1)
            next.splice(to, 0, moved)
            return reindex(next)
        })
    }

    const defaultSelected = items
        .map((c) => (c.account ? c.account : { id: c.account_id }))
        .filter(Boolean) as IAccount[]

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h4 className="text-base font-medium">
                            Define Account Column
                        </h4>
                        <p className="text-muted-foreground text-sm">
                            Drag and Drop to re-order
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <AccountMultiPickerModal
                            pickerProps={{
                                defaultSelected,
                                onConfirm: handleConfirm,
                            }}
                            trigger={
                                <Button type="button" variant="outline">
                                    {items.length === 0
                                        ? 'Select account'
                                        : `${items.length} Accounts Selected`}
                                </Button>
                            }
                        />
                    </div>
                </div>

                <Separator className="my-3" />

                <div className="overflow-y-scroll ecoop-scroll min-h-0 max-h-full flex-1">
                    {items.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No accounts selected. Click + to add.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {items.map((col, i) => (
                                <AccountRow
                                    entry={col}
                                    index={i}
                                    key={`${col.account_id}-${i}`}
                                    moveItem={moveItem}
                                    removeAt={removeAt}
                                />
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    <Button onClick={() => onApply(items)} type="button">
                        Apply
                    </Button>
                </div>
            </div>
        </DndProvider>
    )
}

const AccountRow = ({
    entry,
    index,
    moveItem,
    removeAt,
}: {
    entry: TAccountEntry
    index: number
    moveItem: (from: number, to: number) => void
    removeAt: (i: number) => void
}) => {
    const ref = useRef<HTMLLIElement>(null)

    const [{ isDragging }, drag, preview] = useDrag({
        type: DND_TYPE,
        item: { index },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    })

    const [{ isOver }, drop] = useDrop({
        accept: DND_TYPE,
        collect: (monitor: DropTargetMonitor) => ({
            isOver: monitor.isOver(),
        }),
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveItem(item.index, index)
                item.index = index
            }
        },
    })

    preview(drop(ref))

    const label = entry.account?.name ?? entry.account?.name ?? entry.account_id

    return (
        <li
            className="flex items-center gap-2 rounded-md border bg-card p-2 text-card-foreground data-[dragging]:opacity-50 data-[over]:border-primary"
            data-dragging={isDragging || undefined}
            data-over={isOver || undefined}
            ref={ref}
        >
            <Button
                aria-label="Drag to reorder"
                className="cursor-grab active:cursor-grabbing"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={drag as any}
                size="icon"
                type="button"
                variant="ghost"
            >
                <DragHandleIcon />
            </Button>
            <span className="w-6 text-center text-xs text-muted-foreground tabular-nums">
                {index + 1}
            </span>
            <div className="flex-1 truncate text-sm">{label}</div>
            <Button
                aria-label="Remove account"
                onClick={() => removeAt(index)}
                size="icon"
                type="button"
                variant="ghost"
            >
                <XIcon />
            </Button>
        </li>
    )
}

export const AccountListOrderModal = ({
    account_column,
    onApply,
    open,
    onOpenChange,
    ...props
}: {
    account_column: TAccountEntry[]
    onApply: (newAccountColumns: TAccountEntry[]) => void
} & IModalProps) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    return (
        <Modal
            {...props}
            className="!max-w-xl flex flex-col max-h-[80vh]"
            closeButtonClassName="sr-only"
            description="Arrange and select accounts"
            onOpenChange={setState}
            open={state}
            title="Define Account Column"
            titleHeaderContainerClassName="sr-only"
        >
            <div className="flex flex-col h-full min-h-0">
                <AccountListOrder
                    account_column={account_column}
                    onApply={(data) => {
                        onApply(data)
                        setState(false)
                    }}
                />
            </div>
        </Modal>
    )
}

export const DailyCollectionDetailCreateReportFormModal = ({
    title = 'Daily Collection Detail',
    description = 'Generate daily collection detail report',
    className,
    formProps,
    closeOnSuccess = true,
    ...props
}: IModalProps & {
    closeOnSuccess?: boolean
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
                    if (closeOnSuccess) onOpenChange(false)
                }}
            />
        </Modal>
    )
}
