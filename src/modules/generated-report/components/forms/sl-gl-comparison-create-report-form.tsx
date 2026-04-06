import { UseFormReturn, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toInputDateString, toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    IGeneratedReport,
    SLGLComparisonReportSchema,
    TSLGLComparisonReportSchema,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { getTemplateAt } from '../../generated-report-template-registry'
import { PrintSettingsSection } from './print-config-section'

export interface ISLGLComparisonReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TSLGLComparisonReportSchema>,
            IGeneratedReport,
            Error,
            TSLGLComparisonReportSchema
        > {}

export const SLGLComparisonReportCreateForm = ({
    className,
    readOnly,
    onSuccess,
    onError,
    ...formProps
}: ISLGLComparisonReportFormProps) => {
    const form = useForm<TSLGLComparisonReportSchema>({
        resolver: standardSchemaResolver(SLGLComparisonReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            ...formProps.defaultValues,
            as_of_date: formProps.defaultValues?.as_of_date
                ? toInputDateString(formProps.defaultValues?.as_of_date)
                : undefined,
            exclude_write_off: false,
            report_config: {
                // TODO: Report Template - Jervx
                ...getTemplateAt(undefined, 0),
                module: 'SLGLComparisonDefinition',
                name: `sl_gl_comparison_report_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}.pdf`,
                ...formProps.defaultValues?.report_config,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: { onSuccess, onError },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TSLGLComparisonReportSchema>({ form, readOnly })

    const onSubmit = form.handleSubmit(({ report_config, ...filters }) => {
        generateMutation.mutate({
            ...report_config,
            generated_report_type: 'pdf',
            filters,
        })
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: generateMutation.error })

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-4"
                    disabled={generateMutation.isPending || readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="As of Date *"
                        name="as_of_date"
                        render={({ field }) => (
                            <InputDate {...field} value={field.value ?? ''} />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="exclude_write_off"
                        render={({ field }) => {
                            return (
                                <fieldset>
                                    <label
                                        className={cn(
                                            'group flex items-start gap-3 rounded-xl border p-4 transition-all duration-700 ease-out cursor-pointer',
                                            field.value
                                                ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md'
                                                : 'bg-popover border-border'
                                        )}
                                    >
                                        <Checkbox
                                            checked={field.value}
                                            className={cn(
                                                'mt-1 transition-all',
                                                field.value && 'border-primary'
                                            )}
                                            onCheckedChange={(val) =>
                                                field.onChange(!!val)
                                            }
                                        />
                                        <div className="flex flex-col">
                                            <span
                                                className={cn(
                                                    'text-sm font-medium transition-colors',
                                                    field.value
                                                        ? 'text-primary'
                                                        : 'text-foreground'
                                                )}
                                            >
                                                Exclude Write Off
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Filter out write-off accounts in
                                                the SL-GL comparison.
                                            </span>
                                        </div>
                                    </label>
                                </fieldset>
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
                    disableSubmit={
                        !form.formState.isDirty || generateMutation.isPending
                    }
                    error={error}
                    isLoading={generateMutation.isPending}
                    onReset={() => {
                        form.reset()
                        generateMutation.reset()
                    }}
                    readOnly={readOnly}
                    submitText="Generate"
                />
            </form>
        </Form>
    )
}

export const SLGLComparisonReportCreateFormModal = ({
    title = 'Create SL-GL Comparison Report',
    description = 'Define filters and configuration for SL-GL comparison',
    className,
    formProps,
    ...props
}: IModalProps & { formProps?: ISLGLComparisonReportFormProps }) => {
    return (
        <Modal
            className={cn('sm:max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <SLGLComparisonReportCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}
