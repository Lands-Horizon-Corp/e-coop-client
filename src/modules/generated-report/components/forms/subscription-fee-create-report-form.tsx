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
import MemberOccupationCombobox from '@/modules/member-occupation/components/member-occupation-combobox'
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

export const SubscriptionFeeSchema = z
    .object({
        as_of_date: stringDateWithTransformSchema,

        export_to_excel: z.boolean().default(false),

        sort_by: z
            .enum(['by_passbook_no', 'by_name'])
            .default('by_passbook_no'),

        member_type_id: entityIdSchema.optional(),
        barangay: z.string().optional(),
        member_occupation_id: entityIdSchema.optional(),
    })
    .and(WithGeneratedReportSchema)

export type TSubscriptionFeeSchema = z.infer<typeof SubscriptionFeeSchema>

export interface ISubscriptionFeeFormProps
    extends
        IClassProps,
        IForm<
            Partial<TSubscriptionFeeSchema>,
            IGeneratedReport,
            Error,
            TSubscriptionFeeSchema
        > {}

const SubscriptionFeeCreateReportForm = ({
    className,
    ...formProps
}: ISubscriptionFeeFormProps) => {
    const form = useForm<TSubscriptionFeeSchema>({
        resolver: standardSchemaResolver(SubscriptionFeeSchema),
        defaultValues: async () =>
            buildFormDefaults<TSubscriptionFeeSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    as_of_date: undefined,

                    export_to_excel: false,
                    sort_by: 'by_passbook_no',

                    member_type_id: undefined,
                    barangay: '',
                    member_occupation_id: undefined,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'SubscriptionFeeReport',
                        name: `subscription_fee_${toReadableDate(
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

    const { formRef, handleFocusError } = useFormHelper<TSubscriptionFeeSchema>(
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
                        label="As of Date"
                        name="as_of_date"
                        render={({ field }) => <InputDate {...field} />}
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

                    <FormFieldWrapper
                        control={form.control}
                        name="export_to_excel"
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
                                            Export to Excel
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Generate an Excel version of the
                                            report.
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

export default SubscriptionFeeCreateReportForm

export const SubscriptionFeeCreateReportFormModal = ({
    title = 'Subscription Fee',
    description = 'Generate subscription fee report',
    className,
    formProps,
    closeOnSuccess = true,
    ...props
}: IModalProps & {
    closeOnSuccess?: boolean
    formProps?: Omit<ISubscriptionFeeFormProps, 'className' | 'onClose'>
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
            onOpenChange={onOpenChange}
            open={open}
            title={title}
            {...props}
        >
            <SubscriptionFeeCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    if (closeOnSuccess) onOpenChange(false)
                }}
            />
        </Modal>
    )
}
