import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import AreaCombobox from '@/modules/area/components/area-combobox'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { LOAN_MODE_OF_PAYMENT } from '@/modules/loan-transaction/loan.constants'
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
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

export const LoanReleaseDetailSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        member_type_id: z.string().optional(),
        barangay: z.string().optional(),

        member_classification_id: z.string().optional(),
        member_category_id: z.string().optional(),

        account: z.any().optional(),
        account_id: z.string().optional(),

        member_address_area_id: z.string().optional(),
        member_occupation_id: z.string().optional(),

        collector: z.any().optional(),
        collector_id: z.string().optional(),

        include_cancelled_cv: z.boolean().default(false),
        include_summary_of_loan_releases: z.boolean().default(false),
        include_excluded_to_gl: z.boolean().default(false),
        group_by_loan_category: z.boolean().default(false),
        first_loan_only: z.boolean().default(false),
        export_to_excel: z.boolean().default(false),

        loan_amount_type: z
            .enum(['all', 'granted', 'applied'])
            .default('granted'),

        payment_type: z.enum(['all', 'office', 'field']).default('all'),

        loan_type: z.enum(['disbursement', 'journal', 'all']).default('all'),

        sort_by: z.enum(['pb_no', 'date_rel', 'name']).default('pb_no'),

        groupings: z
            .enum([
                'by_mtype_acct',
                'by_mtype_mclass',
                'by_mtype_ltype',
                'by_mtype_brgy',
                'by_mtype_area',
                'by_mtype_area_grp',
                'by_mclass_area_mtype_grp',
                'by_coll_brgy',
                'by_coll_area',
                'by_mtype_acct_ltr',
                'by_mtype_occup',
                'no_grouping',
            ])
            .default('no_grouping'),

        mode_of_payment: z
            .enum([...LOAN_MODE_OF_PAYMENT, 'all'])
            .default('all'),
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

export type TLoanReleaseDetailSchema = z.infer<typeof LoanReleaseDetailSchema>

export interface ILoanReleaseDetailFormProps
    extends
        IClassProps,
        IForm<
            Partial<TLoanReleaseDetailSchema>,
            IGeneratedReport,
            Error,
            TLoanReleaseDetailSchema
        > {}

const LoanReleaseDetailCreateReportForm = ({
    className,
    ...formProps
}: ILoanReleaseDetailFormProps) => {
    const form = useForm<TLoanReleaseDetailSchema>({
        resolver: standardSchemaResolver(LoanReleaseDetailSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            start_date: undefined,
            end_date: undefined,
            barangay: 'ALL',
            loan_amount_type: 'all',
            loan_type: 'all',
            sort_by: 'pb_no',

            ...formProps.defaultValues,
            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `loan_release_${toReadableDate(new Date(), 'MMddyy_mmss')}.pdf`,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanReleaseDetailSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(({ report_config, ...filters }) => {
        generateMutation.mutate({
            ...report_config,
            generated_report_type: form.getValues('export_to_excel')
                ? 'excel'
                : 'pdf',
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date *"
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
                            label="End Date *"
                            name="end_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Member Type"
                            name="member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All member type"
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
                                    disabled={isDisabled(field.name)}
                                    hideDescription
                                    mode="all"
                                    onSelect={(acc) => {
                                        field.onChange(acc?.id)
                                        form.setValue('account', acc)
                                    }}
                                    placeholder="All Account"
                                    triggerClassName="!w-full !min-w-0 flex-1"
                                    value={form.watch('account')}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Barangay"
                            name="barangay"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
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
                                    disabled={isDisabled(field.name)}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All occupation"
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
                                    disabled={isDisabled(field.name)}
                                    onChange={(v) => field.onChange(v?.id)}
                                    placeholder="All area"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Collector"
                            name="collector_id"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Loan Amount Type"
                        name="loan_amount_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <label className="flex items-center gap-2">
                                    <RadioGroupItem value="granted" />
                                    Granted
                                </label>
                                <label className="flex items-center gap-2">
                                    <RadioGroupItem value="applied" />
                                    Applied
                                </label>
                            </RadioGroup>
                        )}
                    />

                    <div className="grid grid-cols-3 gap-x-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Payment Type"
                            name="payment_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {['all', 'office', 'field'].map((v) => (
                                        <label
                                            className="flex items-center text-sm gap-2"
                                            key={v}
                                        >
                                            <RadioGroupItem value={v} />
                                            {v}
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Loan Type"
                            name="loan_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {['disbursement', 'journal', 'all'].map(
                                        (v) => (
                                            <label
                                                className="flex items-center text-sm gap-2"
                                                key={v}
                                            >
                                                <RadioGroupItem value={v} />
                                                {v}
                                            </label>
                                        )
                                    )}
                                </RadioGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Sort By"
                            name="sort_by"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {['pb_no', 'date_rel', 'name'].map((v) => (
                                        <label
                                            className="flex items-center text-sm gap-2"
                                            key={v}
                                        >
                                            <RadioGroupItem value={v} />
                                            {v}
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Groupings"
                        name="groupings"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-3 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    'by_mtype_acct',
                                    'by_mtype_mclass',
                                    'by_mtype_ltype',
                                    'by_mtype_brgy',
                                    'by_mtype_area',
                                    'by_mtype_area_grp',
                                    'by_mclass_area_mtype_grp',
                                    'by_coll_brgy',
                                    'by_coll_area',
                                    'by_mtype_acct_ltr',
                                    'by_mtype_occup',
                                    'no_grouping',
                                ].map((v) => (
                                    <label
                                        className="flex items-center gap-2 text-xs"
                                        key={v}
                                    >
                                        <RadioGroupItem value={v} />
                                        {v}
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
                                className="grid grid-cols-4 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {LOAN_MODE_OF_PAYMENT.map((v) => (
                                    <label
                                        className="flex items-center gap-2 text-xs"
                                        key={v}
                                    >
                                        <RadioGroupItem value={v} />
                                        {v}
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

                    <div className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border border-border/60 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="include_cancelled_cv"
                            render={({ field }) => (
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(val) =>
                                            field.onChange(!!val)
                                        }
                                    />
                                    Include Cancelled C.V.
                                </label>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="include_summary_of_loan_releases"
                            render={({ field }) => (
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(val) =>
                                            field.onChange(!!val)
                                        }
                                    />
                                    Include Summary of Loan Releases
                                </label>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="include_excluded_to_gl"
                            render={({ field }) => (
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(val) =>
                                            field.onChange(!!val)
                                        }
                                    />
                                    Include Excluded to GL
                                </label>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="group_by_loan_category"
                            render={({ field }) => (
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(val) =>
                                            field.onChange(!!val)
                                        }
                                    />
                                    Group By Loan Category
                                </label>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="first_loan_only"
                            render={({ field }) => (
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(val) =>
                                            field.onChange(!!val)
                                        }
                                    />
                                    First Loan Only
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

export default LoanReleaseDetailCreateReportForm

export const LoanReleaseDetailCreateReportFormModal = ({
    title = 'Loan Release Detail',
    description = 'Define filters and generate loan release detail report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanReleaseDetailFormProps, 'className' | 'onClose'>
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
            <LoanReleaseDetailCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
