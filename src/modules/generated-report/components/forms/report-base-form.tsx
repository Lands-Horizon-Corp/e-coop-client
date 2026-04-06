import { FieldValues, Form, UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useCreateGeneratedReport } from '../../generated-report.service'
import { IGeneratedReport } from '../../generated-report.types'
import {
    TWithReportConfigSchema,
    WithGeneratedReportSchema,
} from '../../generated-report.validation'
import { PrintSettingsSection } from './print-config-section'
import { cn } from '@/helpers'

type ReportFormBaseProps<TSchema extends z.ZodType<FieldValues>> = IClassProps &
    IForm<
        Partial<z.infer<TSchema>>,
        IGeneratedReport,
        Error,
        z.infer<TSchema>
    > & {
        schema: TSchema

        render: (params: {
            form: UseFormReturn<z.infer<TSchema>>
            isDisabled: (name: keyof z.infer<TSchema>) => boolean
            generateMutation: ReturnType<typeof useCreateGeneratedReport>
        }) => React.ReactNode
    }

export function ReportFormBase<TSchema extends z.ZodType<FieldValues>>({
    schema,
    defaultValues,
    readOnly,
    className,
    onSuccess,
    onError,
    render,
}: ReportFormBaseProps<TSchema>) {
    const finalSchema = schema.and(WithGeneratedReportSchema)

    type TForm = z.infer<typeof finalSchema>

    const form = useForm<TForm>({
        resolver: standardSchemaResolver(finalSchema),
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
            report_config: {
                module: 'FinancialStatementDefinition',
                name: `report_${toReadableDate(new Date(), 'MMddyy_mmss')}.pdf`,
                ...defaultValues?.report_config,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: { onSuccess, onError },
    })

    const { formRef, handleFocusError } = useFormHelper<TForm>({
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

    const error = serverRequestErrExtractor({
        error: generateMutation.error,
    })

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
                    {render({
                        form,
                        generateMutation,
                    })}
                </fieldset>

                <PrintSettingsSection
                    displayMode="dropdown"
                    form={
                        form as unknown as UseFormReturn<TWithReportConfigSchema>
                    }
                />

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
