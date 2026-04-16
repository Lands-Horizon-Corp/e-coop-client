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
import MemberGroupCombobox from '@/modules/member-group/components/member-group-combobox'
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

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

export const ProofOfPurchaseSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        account_id: entityIdSchema.optional(),
        account: z.any().optional(),

        group_by: z
            .enum([
                'member_type',
                'occupation',
                'group',
                'barangay',
                'area',
                'no_group',
            ])
            .default('no_group'),

        sort_by: z
            .enum(['by_passbook_no', 'by_name'])
            .default('by_passbook_no'),

        rate: z.coerce.number().optional(),

        member_type_id: entityIdSchema.optional(),
        barangay: z.string().optional(),
        member_occupation_id: entityIdSchema.optional(),
        member_address_area_id: entityIdSchema.optional(),
        member_group_id: entityIdSchema.optional(),

        consolidate: z.boolean().default(false),
        get_from_history: z.boolean().default(false),
    })
    .and(WithGeneratedReportSchema)

export type TProofOfPurchaseSchema = z.infer<typeof ProofOfPurchaseSchema>

export interface IProofOfPurchaseFormProps
    extends
        IClassProps,
        IForm<
            Partial<TProofOfPurchaseSchema>,
            IGeneratedReport,
            Error,
            TProofOfPurchaseSchema
        > {}

const ProofOfPurchaseCreateReportForm = ({
    className,
    ...formProps
}: IProofOfPurchaseFormProps) => {
    const form = useForm<TProofOfPurchaseSchema>({
        resolver: standardSchemaResolver(ProofOfPurchaseSchema),
        defaultValues: {
            start_date: undefined,
            end_date: undefined,

            account_id: undefined,
            account: undefined,

            group_by: 'no_group',
            sort_by: 'by_passbook_no',

            rate: undefined,

            member_type_id: undefined,
            barangay: '',
            member_occupation_id: undefined,
            member_address_area_id: undefined,
            member_group_id: undefined,

            consolidate: false,
            get_from_history: false,

            ...formProps.defaultValues,

            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneratedReport',
                name: `proof_of_purchase_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TProofOfPurchaseSchema>(
        {
            form,
            ...formProps,
        }
    )

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

                    <FormFieldWrapper
                        control={form.control}
                        label="Account"
                        name="account_id"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                allowClear
                                mode="all"
                                onSelect={(v) => {
                                    field.onChange(v?.id)
                                    form.setValue('account', v)
                                }}
                                value={form.getValues('account')}
                            />
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

                        <FormFieldWrapper
                            control={form.control}
                            label="Rate"
                            name="rate"
                            render={({ field }) => (
                                <Input type="text" {...field} />
                            )}
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
                                    {
                                        value: 'member_type',
                                        label: 'Member Type',
                                    },
                                    {
                                        value: 'occupation',
                                        label: 'Occupation',
                                    },
                                    { value: 'group', label: 'Group' },
                                    { value: 'barangay', label: 'Barangay' },
                                    { value: 'area', label: 'Area' },
                                    { value: 'no_group', label: 'No Group' },
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
                                className="grid grid-cols-2 p-4 rounded-xl bg-muted/60 border gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'by_passbook_no',
                                        label: 'Passbook No',
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

                    <FormLabel
                        className="text-muted-foreground text-xs"
                        tabIndex={-1}
                    >
                        Other Options
                    </FormLabel>

                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="consolidate"
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
                                                Consolidate
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Merge records into a single
                                                grouped output.
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
                            name="get_from_history"
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
                                                Get From History
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Include historical proof of
                                                purchase records.
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

export default ProofOfPurchaseCreateReportForm

export const ProofOfPurchaseCreateReportFormModal = ({
    title = 'Proof of Purchase',
    description = 'Generate proof of purchase report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IProofOfPurchaseFormProps, 'className' | 'onClose'>
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
            <ProofOfPurchaseCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
