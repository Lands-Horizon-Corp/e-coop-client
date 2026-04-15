import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { entityIdSchema, stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const DirectAdjustmentReportSchema = z
    .object({
        start_date: stringDateWithTransformSchema,
        end_date: stringDateWithTransformSchema,
        account: z.any(),
        account_id: entityIdSchema.optional(),
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

export type TDirectAdjustmentReportSchema = z.infer<
    typeof DirectAdjustmentReportSchema
>

export interface IDirectAdjustmentReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TDirectAdjustmentReportSchema>,
            IGeneratedReport,
            Error,
            TDirectAdjustmentReportSchema
        > {}

const DirectAdjustmentCreateReportForm = ({
    className,
    ...formProps
}: IDirectAdjustmentReportFormProps) => {
    const form = useForm<TDirectAdjustmentReportSchema>({
        resolver: standardSchemaResolver(DirectAdjustmentReportSchema),
        mode: 'onSubmit',
        defaultValues: {
            start_date: undefined,
            end_date: undefined,
            account_id: undefined,
            ...formProps.defaultValues,
            report_config: {
                module: 'Account',
                name: `direct_adjustment_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}.pdf`,
                ...formProps.defaultValues?.report_config,
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
        useFormHelper<TDirectAdjustmentReportSchema>({
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
                    className="space-y-3"
                    disabled={generateMutation.isPending || formProps.readOnly}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date *"
                            name="start_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled('start_date')}
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
                                    disabled={isDisabled('end_date')}
                                />
                            )}
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
                                hideDescription
                                mode="all"
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                }}
                                placeholder="All Account"
                                value={form.watch('account')}
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

export default DirectAdjustmentCreateReportForm

export const DirectAdjustmentCreateReportFormModal = ({
    title = 'Create Direct Adjustment Report',
    description = 'Define date range and account for adjustments',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IDirectAdjustmentReportFormProps, 'className' | 'onClose'>
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
            <DirectAdjustmentCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
