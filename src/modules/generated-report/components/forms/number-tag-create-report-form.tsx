import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

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
import { ArrowRightIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const PrintNumberTagSchema = z
    .object({
        start_number: z.coerce.number().min(1),
        end_number: z.coerce.number().min(1),
    })
    .and(WithGeneratedReportSchema)
    .superRefine((data, ctx) => {
        if (
            data.start_number &&
            data.end_number &&
            data.start_number > data.end_number
        ) {
            ctx.addIssue({
                code: 'custom',
                message: 'Start Number must not be greater than End Number',
                path: ['start_number'],
            })
            ctx.addIssue({
                code: 'custom',
                message: 'End Number must not be less than Start Number',
                path: ['end_number'],
            })
        }
    })

export type TPrintNumberTagSchema = z.infer<typeof PrintNumberTagSchema>

export interface IPrintNumberTagFormProps
    extends
        IClassProps,
        IForm<
            Partial<TPrintNumberTagSchema>,
            IGeneratedReport,
            Error,
            TPrintNumberTagSchema
        > {}

const PrintNumberTagForm = ({
    className,
    ...formProps
}: IPrintNumberTagFormProps) => {
    const form = useForm<TPrintNumberTagSchema>({
        resolver: standardSchemaResolver(PrintNumberTagSchema),
        mode: 'onSubmit',
        defaultValues: {
            start_number: 0,
            end_number: 1,
            ...formProps.defaultValues,
            report_config: {
                module: 'GeneratedReport',
                name: `print_tag_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}.pdf`,
                ...formProps.defaultValues?.report_config,
            },
        },
    })

    const generateMutation = useCreateGeneratedReport({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })

    const { formRef, handleFocusError } = useFormHelper<TPrintNumberTagSchema>({
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

    const error = serverRequestErrExtractor({ error: generateMutation.error })

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-3"
                    disabled={generateMutation.isPending || formProps.readOnly}
                >
                    <div className="flex items-center gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Number *"
                            name="start_number"
                            render={({ field }) => <Input {...field} />}
                        />
                        <ArrowRightIcon className="block mt-4 size-4 shrink-0" />
                        <FormFieldWrapper
                            control={form.control}
                            label="End Number *"
                            name="end_number"
                            render={({ field }) => <Input {...field} />}
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
                    disableSubmit={
                        !form.formState.isDirty || generateMutation.isPending
                    }
                    error={error}
                    isLoading={generateMutation.isPending}
                    onReset={() => {
                        form.reset(formProps.defaultValues)
                        generateMutation.reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Generate"
                />
            </form>
        </Form>
    )
}

export default PrintNumberTagForm

export const PrintNumberTagCreateReportFormModal = ({
    title = 'Create Print Number Tag Report',
    description = 'Define number range for printing tags',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IPrintNumberTagFormProps, 'className' | 'onClose'>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('sm:max-w-lg', className)}
            description={description}
            title={title}
            {...props}
            onOpenChange={onOpenChange}
            open={open}
        >
            <PrintNumberTagForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
