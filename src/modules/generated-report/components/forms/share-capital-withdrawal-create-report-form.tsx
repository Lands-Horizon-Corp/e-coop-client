import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import AreaCombobox from '@/modules/area/components/area-combobox'
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
import Modal, { IModalProps } from '@/components/modals/modal'
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

export const ShareCapitalWithdrawalSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        group_by: z
            .enum([
                'member_type',
                'barangay',
                'occupation',
                'area',
                'group',
                'no_group',
            ])
            .default('no_group'),

        sort_by: z
            .enum(['by_passbook_no', 'by_name'])
            .default('by_passbook_no'),

        filter_by: z.enum(['full', 'partial', 'all']).default('all'),

        member_type_id: entityIdSchema.optional(),
        barangay: z.string().optional(),
        member_occupation_id: entityIdSchema.optional(),
        area_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),
    })
    .and(WithGeneratedReportSchema)

export type TShareCapitalWithdrawalSchema = z.infer<
    typeof ShareCapitalWithdrawalSchema
>

export interface IShareCapitalWithdrawalFormProps
    extends
        IClassProps,
        IForm<
            Partial<TShareCapitalWithdrawalSchema>,
            IGeneratedReport,
            Error,
            TShareCapitalWithdrawalSchema
        > {}

const ShareCapitalWithdrawalCreateReportForm = ({
    className,
    ...formProps
}: IShareCapitalWithdrawalFormProps) => {
    const form = useForm<TShareCapitalWithdrawalSchema>({
        resolver: standardSchemaResolver(ShareCapitalWithdrawalSchema),
        defaultValues: {
            start_date: undefined,
            end_date: undefined,

            group_by: 'no_group',
            sort_by: 'by_passbook_no',
            filter_by: 'all',

            member_type_id: undefined,
            barangay: '',
            member_occupation_id: undefined,
            area_id: undefined,
            member_group_id: undefined,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `share_capital_withdrawal_${toReadableDate(
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
        useFormHelper<TShareCapitalWithdrawalSchema>({
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

                    <div className="grid grid-cols-4 gap-2">
                        <FormFieldWrapper
                            className="col-span-3"
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
                                        {
                                            value: 'barangay',
                                            label: 'Barangay',
                                        },
                                        {
                                            value: 'occupation',
                                            label: 'Occupation',
                                        },
                                        {
                                            value: 'area',
                                            label: 'Area',
                                        },
                                        {
                                            value: 'group',
                                            label: 'Group',
                                        },
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

                        <FormFieldWrapper
                            control={form.control}
                            label="Sort By"
                            name="sort_by"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-1 p-4 rounded-xl bg-muted/60 border gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {[
                                        {
                                            value: 'by_passbook_no',
                                            label: 'Passbook No',
                                        },
                                        {
                                            value: 'by_name',
                                            label: 'Name',
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
                        label="Filter By"
                        name="filter_by"
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
                                        desc: 'Includes all withdrawal types.',
                                    },
                                    {
                                        value: 'full',
                                        label: 'Full Withdrawal',
                                        desc: 'Includes full withdrawals only.',
                                    },
                                    {
                                        value: 'partial',
                                        label: 'Partial Withdrawal',
                                        desc: 'Includes partial withdrawals only.',
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
                                    undefinable
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Barangay"
                            name="barangay"
                            render={({ field }) => (
                                <Input
                                    className="input"
                                    {...field}
                                    placeholder="All"
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

export const ShareCapitalWithdrawalCreateReportFormModal = ({
    title = 'Share Capital Withdrawal',
    description = 'Generate share capital withdrawal report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IShareCapitalWithdrawalFormProps, 'className' | 'onClose'>
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
            <ShareCapitalWithdrawalCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
