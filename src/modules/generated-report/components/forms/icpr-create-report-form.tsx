import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import AreaCombobox from '@/modules/area/components/area-combobox'
import { CurrencyInput } from '@/modules/currency'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import MemberClassificationCombobox from '@/modules/member-classification/components/member-classification-combobox'
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'
import { entityIdSchema } from '@/validation'

import YearCombobox from '@/components/comboboxes/year-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormLabel } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const ICPRSchema = z
    .object({
        year: z.coerce.number(),

        deduct_amount_on_pr: z.coerce.number().optional(),

        detail_type: z
            .enum([
                'icpr_summary',
                'pr_detail',
                'icpr_cash',
                'ic_distribution',
                'pr_distribution',
            ])
            .default('icpr_summary'),

        groupings: z
            .enum([
                'no_grouping',
                'occupation',
                'group',
                'barangay',
                'classification',
                'area',
            ])
            .default('no_grouping'),

        sort_by: z.enum(['by_passbook', 'by_name']).default('by_passbook'),

        barangay: z.string().optional(),

        member_occupation_id: entityIdSchema.optional(),
        member_classification_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),
        member_address_area_id: entityIdSchema.optional(),

        include_closed_acct: z.boolean().default(false),
        print_zero_share_cap: z.boolean().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TICPRSchema = z.infer<typeof ICPRSchema>

export interface IICPRFormProps
    extends
        IClassProps,
        IForm<Partial<TICPRSchema>, IGeneratedReport, Error, TICPRSchema> {}

const ICPRCreateReportForm = ({ className, ...formProps }: IICPRFormProps) => {
    const form = useForm<TICPRSchema>({
        resolver: standardSchemaResolver(ICPRSchema),
        defaultValues: {
            year: new Date().getFullYear(),

            deduct_amount_on_pr: undefined,

            detail_type: 'icpr_summary',
            groupings: 'no_grouping',
            sort_by: 'by_passbook',

            barangay: '',

            member_occupation_id: undefined,
            member_classification_id: undefined,
            member_group_id: undefined,
            member_address_area_id: undefined,

            include_closed_acct: false,
            print_zero_share_cap: false,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `icpr_${toReadableDate(new Date(), 'MMddyy_mmss')}.pdf`,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } = useFormHelper<TICPRSchema>({
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
                    <div className="grid gap-x-2 grid-cols-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Year"
                            name="year"
                            render={({ field }) => (
                                <YearCombobox
                                    {...field}
                                    endYear={new Date().getFullYear() + 1}
                                    onChange={(v) => field.onChange(v)}
                                    startYear={1960}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Deduct Amount on PR"
                            name="deduct_amount_on_pr"
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    onValueChange={(newValue = '') => {
                                        onChange(newValue)
                                    }}
                                    placeholder="Amount"
                                />
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Detail Type"
                        name="detail_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'icpr_summary',
                                        label: 'ICPR Summary',
                                    },
                                    {
                                        value: 'pr_detail',
                                        label: 'PR Detail',
                                    },
                                    {
                                        value: 'icpr_cash',
                                        label: 'ICPR Cash',
                                    },
                                    {
                                        value: 'ic_distribution',
                                        label: 'IC Distribution',
                                    },
                                    {
                                        value: 'pr_distribution',
                                        label: 'PR Distribution',
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
                        label="Groupings"
                        name="groupings"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'no_grouping',
                                        label: 'No Grouping',
                                    },
                                    {
                                        value: 'occupation',
                                        label: 'Occupation',
                                    },
                                    { value: 'group', label: 'Group' },
                                    { value: 'barangay', label: 'Barangay' },
                                    {
                                        value: 'classification',
                                        label: 'Classification',
                                    },
                                    { value: 'area', label: 'Area' },
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
                                className="grid grid-cols-2 p-4 w-fit gap-x-6 rounded-xl bg-muted/60 border"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'by_passbook',
                                        label: 'Passbook',
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

                    <div className="grid grid-cols-2 gap-3">
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
                                <MemberClassificationCombobox
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
                    </div>

                    <FormLabel className="text-xs text-muted-foreground">
                        Other Options
                    </FormLabel>

                    <div className="grid grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="include_closed_acct"
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
                                                Include Closed Account
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Include records of closed
                                                accounts in the report.
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
                            name="print_zero_share_cap"
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
                                                Print Zero Share Capital
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Include members with zero share
                                                capital balances.
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

export default ICPRCreateReportForm

export const ICPRCreateReportFormModal = ({
    title = 'ICPR',
    description = 'Generate ICPR report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IICPRFormProps, 'className' | 'onClose'>
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
            <ICPRCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
