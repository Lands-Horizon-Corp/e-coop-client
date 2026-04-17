import { useMemo } from 'react'

import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { AccountMultiPickerModal } from '@/modules/account/components/picker/account-multi-picker'
import AreaCombobox from '@/modules/area/components/area-combobox'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    ListBulletsBoldIcon,
    ListOrderedIcon,
    NotAllowedIcon,
    TrashIcon,
} from '@/components/icons'
import { CheckIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Form, FormLabel } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
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

export const memberFieldEnum = z.enum([
    'birthday',
    'age',
    'sex',
    'civil_status',
    'income_range',
    'spouse',
    'dependents',
    'beneficiaries',
    'share_capital',
    'savings_deposit',
    'special_savings',
    'time_deposits',
    'map_deposit',
    'loans',
])

export const StatementOfDepositsSchema = z
    .object({
        as_of_date: stringDateWithTransformSchema,

        start_pb_no: z.string().optional(),
        end_pb_no: z.string().optional(),

        member_type_id: z.string().optional(),
        member_address_area_id: z.string().optional(),

        exclude_account_action: z.boolean().default(false),
        acct_order_action: z.boolean().default(false),

        style: z
            .enum(['statement', 'statement_2', 'profile'])
            .default('statement'),

        exclude_account_ids: z.array(entityIdSchema).optional().default([]),
        exclude_accounts: z.array(z.any()).optional().default([]),

        accounts_order: z
            .array(
                z.object({
                    first_account_id: entityIdSchema.optional(),
                    first_account: z.any().optional(),

                    second_account_id: entityIdSchema.optional(),
                    second_account: z.any().optional(),

                    third_account_id: entityIdSchema.optional(),
                    third_account: z.any().optional(),
                })
            )
            .optional(),

        member_fields: z
            .array(memberFieldEnum)
            .optional()
            .default([
                'birthday',
                'age',
                'sex',
                'civil_status',
                'income_range',
                'spouse',
                'dependents',
                'beneficiaries',
                'share_capital',
                'savings_deposit',
                'special_savings',
                'time_deposits',
                'map_deposit',
                'loans',
            ]),
    })
    .and(WithGeneratedReportSchema)

export type TStatementOfDepositsSchema = z.infer<
    typeof StatementOfDepositsSchema
>

export interface IStatementOfDepositsFormProps
    extends
        IClassProps,
        IForm<
            Partial<TStatementOfDepositsSchema>,
            IGeneratedReport,
            Error,
            TStatementOfDepositsSchema
        > {}

const StatementOfDepositsCreateReportForm = ({
    className,
    ...formProps
}: IStatementOfDepositsFormProps) => {
    const form = useForm<TStatementOfDepositsSchema>({
        resolver: standardSchemaResolver(StatementOfDepositsSchema),
        defaultValues: {
            as_of_date: undefined,

            start_pb_no: '',
            end_pb_no: '',

            member_type_id: undefined,
            member_address_area_id: undefined,

            exclude_account_action: false,
            acct_order_action: false,

            style: 'statement',

            exclude_account_ids: [],
            exclude_accounts: [],

            accounts_order: [],

            member_fields: [
                'birthday',
                'age',
                'sex',
                'civil_status',
                'income_range',
                'spouse',
                'dependents',
                'beneficiaries',
                'share_capital',
                'savings_deposit',
                'special_savings',
                'time_deposits',
                'map_deposit',
                'loans',
            ],

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `statement_of_deposits_${toReadableDate(
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

    const { formRef, handleFocusError } =
        useFormHelper<TStatementOfDepositsSchema>({
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
                            label="Start Passbook No"
                            name="start_pb_no"
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="End Passbook No"
                            name="end_pb_no"
                            render={({ field }) => <Input {...field} />}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Member Type"
                            name="member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All"
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
                                />
                            )}
                        />
                    </div>
                    <div className="flex gap-x-2 justify-start">
                        <FormFieldWrapper
                            className="w-fit"
                            control={form.control}
                            name="exclude_account_ids"
                            render={({ field }) => (
                                <div className="flex flex-col gap-y-2">
                                    <AccountMultiPickerModal
                                        pickerProps={{
                                            defaultSelected:
                                                form.getValues(
                                                    'exclude_accounts'
                                                ),
                                            onConfirm: (accounts) => {
                                                field.onChange(
                                                    accounts.map((a) => a.id)
                                                )
                                                form.setValue(
                                                    'exclude_accounts',
                                                    accounts
                                                )
                                            },
                                        }}
                                        trigger={
                                            <Button
                                                className="w-fit"
                                                size="sm"
                                                type="button"
                                                variant="secondary"
                                            >
                                                <NotAllowedIcon />
                                                {field?.value?.length === 0
                                                    ? 'Select Exclude Account'
                                                    : `${field.value?.length} Excluded Account${field?.value?.length === 0 ? '' : 's'}`}
                                            </Button>
                                        }
                                    />
                                </div>
                            )}
                        />
                        <AccountOrderSection
                            form={form}
                            trigger={
                                <Button
                                    className="w-fit"
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >
                                    <ListOrderedIcon /> Account Order
                                </Button>
                            }
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Style"
                        name="style"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'statement',
                                        label: 'Statement',
                                    },
                                    {
                                        value: 'statement_2',
                                        label: 'Statement 2',
                                    },
                                    {
                                        value: 'profile',
                                        label: 'Profile',
                                    },
                                ].map((opt) => (
                                    <label
                                        className="flex items-center gap-2 text-sm"
                                        key={opt.value}
                                    >
                                        <RadioGroupItem value={opt.value} />
                                        <span>{opt.label}</span>
                                        {opt.value === 'profile' && (
                                            <FormFieldWrapper
                                                control={form.control}
                                                name="member_fields"
                                                render={({ field }) => (
                                                    <MemberFieldsMultiPicker
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        trigger={
                                                            <Button
                                                                {...field}
                                                                className="w-fit"
                                                                disabled={
                                                                    form.watch(
                                                                        'style'
                                                                    ) !==
                                                                    'profile'
                                                                }
                                                                size="xs"
                                                                type="button"
                                                                variant="secondary"
                                                            >
                                                                <ListBulletsBoldIcon />{' '}
                                                                Fields
                                                            </Button>
                                                        }
                                                        value={
                                                            field.value ?? []
                                                        }
                                                    />
                                                )}
                                            />
                                        )}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <FormLabel className="text-xs text-muted-foreground">
                        Actions
                    </FormLabel>

                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="exclude_account_action"
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
                                                Exclude Accounts
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Enable selection of accounts to
                                                exclude.
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
                            name="acct_order_action"
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
                                                Account Order
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Customize account display order.
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

export default StatementOfDepositsCreateReportForm

// PANG ACCOUNT ORDER SECTION

export const AccountOrderSection = ({
    form,
    title = 'Account Order',
    description = 'Define ordering of accounts',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TStatementOfDepositsSchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'accounts_order',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({
                first_account_id: undefined,
                first_account: undefined,
                second_account_id: undefined,
                second_account: undefined,
                third_account_id: undefined,
                third_account: undefined,
            })
        },
        {
            keydown: true,
            enableOnFormTags: true,
        }
    )

    return (
        <Modal
            className={cn('!max-w-5xl border-muted w-full', className)}
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
                    <p className="text-lg font-medium">Account Order</p>
                    <p className="text-sm text-muted-foreground">
                        Define ordering of accounts
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
                                first_account_id: undefined,
                                first_account: undefined,
                                second_account_id: undefined,
                                second_account: undefined,
                                third_account_id: undefined,
                                third_account: undefined,
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
                        <TableHead className="min-w-[260px]">
                            First Account
                        </TableHead>
                        <TableHead className="min-w-[260px]">
                            Second Account
                        </TableHead>
                        <TableHead className="min-w-[260px]">
                            Third Account
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
                                <AccountPicker
                                    allowClear
                                    hideDescription
                                    mode="all"
                                    onSelect={(account) => {
                                        form.setValue(
                                            `accounts_order.${index}.first_account_id`,
                                            account?.id
                                        )
                                        form.setValue(
                                            `accounts_order.${index}.first_account`,
                                            account
                                        )
                                    }}
                                    placeholder="Select Account"
                                    triggerClassName="!w-full !min-w-0 flex-1"
                                    value={form.watch(
                                        `accounts_order.${index}.first_account`
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <AccountPicker
                                    allowClear
                                    hideDescription
                                    mode="all"
                                    onSelect={(account) => {
                                        form.setValue(
                                            `accounts_order.${index}.second_account_id`,
                                            account?.id
                                        )
                                        form.setValue(
                                            `accounts_order.${index}.second_account`,
                                            account
                                        )
                                    }}
                                    placeholder="Select Account"
                                    triggerClassName="!w-full !min-w-0 flex-1"
                                    value={form.watch(
                                        `accounts_order.${index}.second_account`
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <AccountPicker
                                    allowClear
                                    hideDescription
                                    mode="all"
                                    onSelect={(account) => {
                                        form.setValue(
                                            `accounts_order.${index}.third_account_id`,
                                            account?.id
                                        )
                                        form.setValue(
                                            `accounts_order.${index}.third_account`,
                                            account
                                        )
                                    }}
                                    placeholder="Select Account"
                                    triggerClassName="!w-full !min-w-0 flex-1"
                                    value={form.watch(
                                        `accounts_order.${index}.third_account`
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

// Pang Member field toggle
export const MEMBER_FIELDS = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'age', label: 'Age' },
    { value: 'sex', label: 'Sex' },
    { value: 'civil_status', label: 'Civil Status' },
    { value: 'income_range', label: 'Income Range' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'dependents', label: 'Dependents' },
    { value: 'beneficiaries', label: 'Beneficiaries' },
    { value: 'share_capital', label: 'Share Capital' },
    { value: 'savings_deposit', label: 'Savings Deposit' },
    { value: 'special_savings', label: 'Special Savings' },
    { value: 'time_deposits', label: 'Time Deposits' },
    { value: 'map_deposit', label: 'MAP Deposit' },
    { value: 'loans', label: 'Loans' },
] as const

export type TMemberField = (typeof MEMBER_FIELDS)[number]['value']

const MemberFieldsMultiPicker = ({
    value = [],
    onChange,
    className,
    open,
    onOpenChange,
    ...modalProps
}: IModalProps & {
    value?: TMemberField[]
    onChange?: (val: TMemberField[]) => void
    className?: string
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const selectedSet = useMemo(() => new Set(value), [value])

    const toggle = (val: TMemberField) => {
        const next = new Set(selectedSet)

        if (next.has(val)) next.delete(val)
        else next.add(val)

        onChange?.(Array.from(next))
    }

    return (
        <Popover modal onOpenChange={setState} open={state}>
            {modalProps.trigger && (
                <PopoverTrigger asChild>{modalProps.trigger}</PopoverTrigger>
            )}

            <PopoverContent
                className={cn(
                    'w-[--radix-popover-trigger-width] p-0 rounded-xl border-0 ring-2 ring-muted-foreground/50',
                    className
                )}
            >
                <Command className="rounded-xl">
                    <CommandInput placeholder="Search fields..." />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No field found.</CommandEmpty>

                        <CommandGroup>
                            {MEMBER_FIELDS.map((item) => {
                                const isSelected = selectedSet.has(item.value)

                                return (
                                    <CommandItem
                                        key={item.value}
                                        onSelect={() => toggle(item.value)}
                                        value={item.label}
                                    >
                                        <span className="truncate">
                                            {item.label}
                                        </span>

                                        <CheckIcon
                                            className={cn(
                                                'ml-auto',
                                                isSelected
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export const StatementOfDepositsCreateReportFormModal = ({
    title = 'Statement of Deposits',
    description = 'Generate statement of deposits report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IStatementOfDepositsFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('!max-w-2xl', className)}
            description={description}
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <StatementOfDepositsCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
