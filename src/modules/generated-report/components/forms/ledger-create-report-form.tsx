import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toInputDateString, toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { GeneralLedgerSourceSchema } from '@/modules/general-ledger'
import GeneralLedgerSourceCombobox from '@/modules/general-ledger/components/pickers/general-ledger-source-combobox'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { WithGeneratedReportSchema } from '@/modules/generated-report/generated-report.validation'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import { ChatBubbleIcon, TrashIcon } from '@/components/icons'
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

export const LedgerCreateReportSchema = z
    .object({
        pb_no_from: z.string().optional(),
        pb_no_to: z.string().optional(),

        start_date: z.string().optional(),
        end_date: z.string().optional(),

        all_accounts: z
            .enum(['none', 'deposits', 'loans', 'a_r'])
            .default('none'),

        remarks: z
            .array(
                z.object({
                    date: z.string().optional(),
                    remarks: z.string().optional(),
                })
            )
            .default([]),

        source: GeneralLedgerSourceSchema.optional(),

        account_id: z.string().optional(),
        account: z.any().optional(),

        include_prev_ledger: z.boolean().default(false),
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

export type TLedgerCreateReportSchema = z.infer<typeof LedgerCreateReportSchema>

export interface ILedgerCreateReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLedgerCreateReportSchema>,
            IGeneratedReport,
            Error,
            TLedgerCreateReportSchema
        > {}

const LedgerCreateReportForm = ({
    className,
    ...formProps
}: ILedgerCreateReportFormProps) => {
    const form = useForm<TLedgerCreateReportSchema>({
        resolver: standardSchemaResolver(LedgerCreateReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: async () =>
            buildFormDefaults<TLedgerCreateReportSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    pb_no_from: '',
                    pb_no_to: '',
                    start_date: undefined,
                    end_date: undefined,
                    all_accounts: 'none',
                    remarks: [],
                    include_prev_ledger: false,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        module: 'GeneratedReport',
                        name: `ledger_${toReadableDate(
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
        useFormHelper<TLedgerCreateReportSchema>({
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
                            label="P.B. No. From"
                            name="pb_no_from"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="P.B. No. To"
                            name="pb_no_to"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date"
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
                            label="End Date"
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
                        label="All Accounts"
                        name="all_accounts"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-4 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    { value: 'none', label: 'None' },
                                    { value: 'deposits', label: 'Deposits' },
                                    { value: 'loans', label: 'Loans' },
                                    { value: 'a_r', label: 'A/R' },
                                ].map((opt) => (
                                    <label
                                        className="flex items-center gap-2 text-xs"
                                        key={opt.value}
                                    >
                                        <RadioGroupItem value={opt.value} />
                                        {opt.label}
                                    </label>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <div className="flex items-end gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Source"
                            name="source"
                            render={({ field }) => (
                                <GeneralLedgerSourceCombobox
                                    {...field}
                                    onChange={(v) => field.onChange(v)}
                                    placeholder="All"
                                    undefinable
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Acct. No."
                            name="account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    {...field}
                                    allowClear
                                    hideDescription
                                    mode="all"
                                    onSelect={(account) => {
                                        field.onChange(account.id)
                                        form.setValue('account', account)
                                    }}
                                    placeholder="All Account"
                                    triggerClassName="!w-full !min-w-0 flex-1"
                                    value={form.getValues('account')}
                                />
                            )}
                        />
                        <RemarksSection
                            form={form}
                            trigger={
                                <Button
                                    className="w-fit"
                                    type="button"
                                    variant="outline"
                                >
                                    <ChatBubbleIcon /> Remarks
                                </Button>
                            }
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        name="include_prev_ledger"
                        render={({ field }) => {
                            const isSelected = !!field.value

                            return (
                                <label
                                    className={cn(
                                        'relative flex flex-col gap-1 rounded-xl border p-4 cursor-pointer transition-all',
                                        'hover:bg-accent/50',
                                        isSelected
                                            ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                            : 'bg-background border-border'
                                    )}
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
                                            Include Prev. Ledger
                                        </span>

                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(val) =>
                                                field.onChange(!!val)
                                            }
                                        />
                                    </div>

                                    <span className="text-xs text-muted-foreground">
                                        Includes previous ledger balances in the
                                        generated report.
                                    </span>
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

export default LedgerCreateReportForm

// PANG REMARKS SECTION
export const RemarksSection = ({
    form,
    title = 'Remarks',
    description = 'Add report remarks by date',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TLedgerCreateReportSchema>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'remarks',
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({
                date: '',
                remarks: '',
            })
        },
        {
            keydown: true,
            enableOnFormTags: true,
        }
    )

    return (
        <Modal
            className={cn('!max-w-4xl border-muted w-full', className)}
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
                    <p className="text-lg font-medium">Remarks</p>
                    <p className="text-sm text-muted-foreground">
                        Add report remarks by date
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
                                date: toInputDateString(new Date()),
                                remarks: '',
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
                        <TableHead className="w-[60px] text-center">
                            #
                        </TableHead>
                        <TableHead className="min-w-[180px]">Date</TableHead>
                        <TableHead className="min-w-[400px]">Remarks</TableHead>
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
                                <InputDate
                                    {...form.register(`remarks.${index}.date`)}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    {...form.register(
                                        `remarks.${index}.remarks`
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

export const LedgerCreateReportFormModal = ({
    title = 'Ledger Report',
    description = 'Generate ledger report with filters',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILedgerCreateReportFormProps, 'className' | 'onClose'>
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
            <LedgerCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
