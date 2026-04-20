import { UseFormReturn, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import {
    SLTRXGLComparisonReportSchema,
    TSLTRXGLComparisonReportSchema,
} from '../../general-ledger-definition.validation'

export interface ISLTRXGLComparisonReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TSLTRXGLComparisonReportSchema>,
            IGeneratedReport,
            Error,
            TSLTRXGLComparisonReportSchema
        > {}

export const SLTRXGLComparisonReportCreateForm = ({
    className,
    defaultValues,
    readOnly,
    onSuccess,
    onError,
}: ISLTRXGLComparisonReportFormProps) => {
    const form = useForm<TSLTRXGLComparisonReportSchema>({
        resolver: standardSchemaResolver(SLTRXGLComparisonReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            as_of_date: new Date().toISOString().split('T')[0],
            ...defaultValues,
            report_config: {
                module: 'SLTRXGLComparisonDefinition',
                name: `sl_trx_gl_comparison_report_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}`,
                ...defaultValues?.report_config,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: { onSuccess, onError },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TSLTRXGLComparisonReportSchema>({
            form,
            readOnly,
        })

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
                            <InputDate
                                {...field}
                                disabled={isDisabled('as_of_date')}
                            />
                        )}
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
                        form.reset(defaultValues)
                        generateMutation.reset()
                    }}
                    readOnly={readOnly}
                    submitText="Generate"
                />
            </form>
        </Form>
    )
}

export const SLTRXGLComparisonReportCreateFormModal = ({
    title = 'Create SL-TRX-GL Comparison Report',
    description = 'Define filters and configuration for SL-TRX-GL comparison',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: ISLTRXGLComparisonReportFormProps
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
            <SLTRXGLComparisonReportCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
