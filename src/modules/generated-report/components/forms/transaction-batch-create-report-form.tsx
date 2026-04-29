import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { buildFormDefaults } from '@/helpers/form/form-persist.helper'
import { cn } from '@/helpers/tw-utils'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { stringDateWithTransformSchema } from '@/validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { PersistFormHeadless } from '@/components/form-components/form-persist-headless'
import { XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import { WithGeneratedReportSchema } from '../../generated-report.validation'

export const TransactionBatchSchema = z
    .object({
        entry_date: stringDateWithTransformSchema,

        teller_id: z.string().optional(),
        teller: z.any().optional(),
        batch_no: z.coerce.number().optional(),
    })
    .and(WithGeneratedReportSchema)

export type TTransactionBatchSchema = z.infer<typeof TransactionBatchSchema>

export interface ITransactionBatchFormProps
    extends
        IClassProps,
        IForm<
            Partial<TTransactionBatchSchema>,
            IGeneratedReport,
            Error,
            TTransactionBatchSchema
        > {}

const TransactionBatchCreateReportForm = ({
    className,
    ...formProps
}: ITransactionBatchFormProps) => {
    const form = useForm<TTransactionBatchSchema>({
        resolver: standardSchemaResolver(TransactionBatchSchema),
        defaultValues: async () =>
            buildFormDefaults<TTransactionBatchSchema>({
                persistKey: formProps.persistKey,
                baseDefaults: {
                    entry_date: undefined,

                    teller_id: undefined,
                    batch_no: undefined,

                    report_config: {
                        ...getTemplateAt(undefined, 0),
                        report_name: 'TransactionBatchReport',
                        name: `transaction_batch_${toReadableDate(
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
        useFormHelper<TTransactionBatchSchema>({
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
                    <FormFieldWrapper
                        control={form.control}
                        label="Entry Date"
                        name="entry_date"
                        render={({ field }) => <InputDate {...field} />}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Teller"
                            name="teller_id"
                            render={({ field }) => {
                                const selected = form.getValues('teller')
                                return (
                                    <div className="flex items-center gap-2">
                                        <EmployeePicker
                                            {...field}
                                            onSelect={(v) => {
                                                field.onChange(v?.user_id)
                                                form.setValue('teller', v?.user)
                                            }}
                                            placeholder="ALL"
                                            value={selected}
                                        />
                                        {selected && (
                                            <Button
                                                onClick={() => {
                                                    field.onChange(undefined)
                                                    form.setValue(
                                                        'teller',
                                                        undefined
                                                    )
                                                }}
                                                size="icon"
                                                type="button"
                                                variant="ghost"
                                            >
                                                <XIcon className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                )
                            }}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Batch No"
                            name="batch_no"
                            render={({ field }) => (
                                <Input type="number" {...field} />
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

export default TransactionBatchCreateReportForm

export const TransactionBatchCreateReportFormModal = ({
    title = 'Transaction Batch',
    description = 'Generate transaction batch report',
    className,
    formProps,
    closeOnSuccess = true,
    ...props
}: IModalProps & {
    closeOnSuccess?: boolean
    formProps?: Omit<ITransactionBatchFormProps, 'className' | 'onClose'>
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
            <TransactionBatchCreateReportForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    if (closeOnSuccess) onOpenChange(false)
                }}
            />
        </Modal>
    )
}
