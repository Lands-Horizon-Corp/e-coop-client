import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
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

export const TDThisMonthYTDReportSchema = z
    .object({
        title: z.string().default('TIME DEPOSIT BALANCE'),
        date: stringDateWithTransformSchema,

        member_type_id: entityIdSchema.optional(),

        exclude_zero_balance: z.boolean().default(false),
        filter_by_maturity: z.boolean().default(false),

        groupings: z.enum(['no_grouping', 'terms']).default('no_grouping'),

        sort_by: z
            .enum(['by_td_no', 'by_amount', 'by_name', 'by_entry_date'])
            .default('by_td_no'),
    })
    .and(WithGeneratedReportSchema)

export type TTDThisMonthYTDReportSchema = z.infer<
    typeof TDThisMonthYTDReportSchema
>

export interface TimeDepositBalanceYTDReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TTDThisMonthYTDReportSchema>,
            IGeneratedReport,
            Error,
            TTDThisMonthYTDReportSchema
        > {}

const TimeDepositBalanceYTDCreateReportForm = ({
    className,
    ...formProps
}: TimeDepositBalanceYTDReportFormProps) => {
    const form = useForm<TTDThisMonthYTDReportSchema>({
        resolver: standardSchemaResolver(TDThisMonthYTDReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: async () =>
            buildFormDefaults<TTDThisMonthYTDReportSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    title: 'TIME DEPOSIT BALANCE',
                    date: undefined,
                    exclude_zero_balance: false,
                    filter_by_maturity: false,
                    groupings: 'no_grouping',
                    sort_by: 'by_td_no',

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        module: 'Account',
                        name: `td_balance_${toReadableDate(
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
        useFormHelper<TTDThisMonthYTDReportSchema>({
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
                        label="Title"
                        name="title"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Date *"
                        name="date"
                        render={({ field }) => (
                            <InputDate
                                {...field}
                                disabled={isDisabled(field.name)}
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
                        label="Groupings"
                        name="groupings"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'no_grouping',
                                        label: 'No Grouping',
                                    },
                                    { value: 'terms', label: 'Terms' },
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
                                        value: 'by_td_no',
                                        label: 'By TD No',
                                    },
                                    {
                                        value: 'by_amount',
                                        label: 'By Amount',
                                    },
                                    { value: 'by_name', label: 'By Name' },
                                    {
                                        value: 'by_entry_date',
                                        label: 'By Entry Date',
                                    },
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

                    <FormLabel
                        className="text-muted-foreground text-xs"
                        tabIndex={-1}
                    >
                        Other Options
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-x-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="exclude_zero_balance"
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
                                            Exclude Zero Balance
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Exclude TD with zero balance.
                                        </span>
                                    </div>
                                </label>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="filter_by_maturity"
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
                                            Filter by Maturity
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Include only matured time deposits.
                                        </span>
                                    </div>
                                </label>
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

export default TimeDepositBalanceYTDCreateReportForm

export const TimeDepositBalanceYTDCreateReportFormModal = ({
    title = 'Time Deposit Balance',
    description = 'Generate TD balance for this month and YTD',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<
        TimeDepositBalanceYTDReportFormProps,
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
            className={cn('sm:max-w-xl', className)}
            description={description}
            title={title}
            {...props}
            onOpenChange={onOpenChange}
            open={open}
        >
            <TimeDepositBalanceYTDCreateReportForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
