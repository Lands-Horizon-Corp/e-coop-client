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
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { CalendarDaysIcon } from 'lucide-react'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { CalendarIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, IForm } from '@/types'

import {
    TTrialBalanceReportSchema,
    TrialBalanceReport,
} from '../../../general-ledger/general-ledger.validation'

export interface ITrialBalanceReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TTrialBalanceReportSchema>,
            IGeneratedReport,
            Error,
            TTrialBalanceReportSchema
        > {}

const TrialBalanceReportCreateForm = ({
    className,
    ...formProps
}: ITrialBalanceReportFormProps) => {
    const form = useForm<TTrialBalanceReportSchema>({
        resolver: standardSchemaResolver(TrialBalanceReport),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            entry_date: undefined,
            report_type: 'as_of',
            ...formProps.defaultValues,
            report_config: {
                // TODO: Report Template - Jervx
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneralLedger',
                name: `trial_balance_report_${toReadableDate(
                    new Date(),
                    'MMddyy_mmss'
                )}`,
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
        useFormHelper<TTrialBalanceReportSchema>({
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
                        label="Entry Date *"
                        name="entry_date"
                        render={({ field }) => (
                            <InputDate
                                {...field}
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Print Type"
                        name="report_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="flex gap-2"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'as_of',
                                        label: 'As Of',
                                        icon: CalendarDaysIcon,
                                    },
                                    {
                                        value: 'monthly',
                                        label: 'Monthly',
                                        icon: CalendarIcon,
                                    },
                                ].map((opt) => {
                                    const isSelected = field.value === opt.value
                                    const Icon = opt.icon

                                    return (
                                        <label
                                            className={cn(
                                                'flex items-center justify-center gap-2 rounded-md border-2 py-2 px-3 cursor-pointer transition-all',
                                                isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border bg-card hover:border-muted-foreground/30'
                                            )}
                                            key={opt.value}
                                        >
                                            <RadioGroupItem
                                                className="sr-only"
                                                value={opt.value}
                                            />

                                            <Icon
                                                className={cn(
                                                    isSelected
                                                        ? 'text-primary'
                                                        : 'text-muted-foreground'
                                                )}
                                                size={16}
                                            />

                                            <span
                                                className={cn(
                                                    'text-xs font-medium',
                                                    isSelected
                                                        ? 'text-primary'
                                                        : 'text-muted-foreground'
                                                )}
                                            >
                                                {opt.label}
                                            </span>
                                        </label>
                                    )
                                })}
                            </RadioGroup>
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

export default TrialBalanceReportCreateForm

export const TrialBalanceReportCreateFormModal = ({
    title = 'Create Trial Balance Report',
    description = 'Define filters and configuration for trial balance',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITrialBalanceReportFormProps, 'className' | 'onClose'>
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
            <TrialBalanceReportCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    onOpenChange(false)
                }}
            />
        </Modal>
    )
}
