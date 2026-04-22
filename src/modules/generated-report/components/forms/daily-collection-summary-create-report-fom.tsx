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
import {
    WithSignatureSchema,
    stringDateWithTransformSchema,
} from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import {
    SignatureSectionModal,
    TWithSignatureSchema,
} from '@/components/form-components/form-signature-section'
import { SignatureLightIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const DailyCollectionSummarySchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,

        sundries_print_separate_page: z.boolean().default(false),
    })
    .and(WithGeneratedReportSchema)
    .and(WithSignatureSchema)

export type TDailyCollectionSummarySchema = z.infer<
    typeof DailyCollectionSummarySchema
>

export interface IDailyCollectionSummaryFormProps
    extends
        IClassProps,
        IForm<
            Partial<TDailyCollectionSummarySchema>,
            IGeneratedReport,
            Error,
            TDailyCollectionSummarySchema
        > {}

const DailyCollectionSummaryCreateReportForm = ({
    className,
    ...formProps
}: IDailyCollectionSummaryFormProps) => {
    const form = useForm<TDailyCollectionSummarySchema>({
        resolver: standardSchemaResolver(DailyCollectionSummarySchema),
        defaultValues: async () =>
            buildFormDefaults<TDailyCollectionSummarySchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    start_date: undefined,
                    end_date: undefined,

                    sundries_print_separate_page: false,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'DailyCollectionSummaryReport',
                        name: `daily_collection_summary_${toReadableDate(
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
        useFormHelper<TDailyCollectionSummarySchema>({
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
                    <div className="flex gap-2">
                        <FormFieldWrapper
                            className="flex-1"
                            control={form.control}
                            label="Start Date"
                            name="start_date"
                            render={({ field }) => <InputDate {...field} />}
                        />
                        <FormFieldWrapper
                            className="flex-1"
                            control={form.control}
                            label="End Date"
                            name="end_date"
                            render={({ field }) => <InputDate {...field} />}
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

                    <FormFieldWrapper
                        control={form.control}
                        name="sundries_print_separate_page"
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
                                            Sundries Print Separate Page
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Print sundries entries on a separate
                                            page in the report.
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

export default DailyCollectionSummaryCreateReportForm

export const DailyCollectionSummaryCreateReportFormModal = ({
    title = 'Daily Collection Summary',
    description = 'Generate daily collection summary report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IDailyCollectionSummaryFormProps, 'className' | 'onClose'>
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
            <DailyCollectionSummaryCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
