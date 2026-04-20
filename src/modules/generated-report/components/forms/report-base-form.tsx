import { Form, UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
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

type ReportFormBaseProps<TSchema extends z.ZodObject<any, any>> = IClassProps &
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

export function ReportFormBase<TSchema extends z.ZodObject<any, any>>({
    schema,
    defaultValues,
    readOnly,
    className,
    onSuccess,
    onError,
    render,
}: ReportFormBaseProps<TSchema>) {
    const finalSchema = schema.merge(WithGeneratedReportSchema)

    type TForm = z.infer<typeof finalSchema>

    const form = useForm<TForm, any, TForm>({
        resolver: standardSchemaResolver(finalSchema),
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
            report_config: {
                // @ts-expect-error TS type mismatch due to RHF + Zod merge
                ...defaultValues?.report_config,
                name: `report_${toReadableDate(new Date(), 'MMddyy_mmss')}`,
            },
        } as Partial<TForm>,
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
            // @ts-expect-error TS type mismatch due to RHF + Zod merge
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
                    className="space-y-4"
                    disabled={generateMutation.isPending || readOnly}
                >
                    {render({
                        // @ts-expect-error TS type mismatch due to RHF + Zod merge
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
