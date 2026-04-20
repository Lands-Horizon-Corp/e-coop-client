import { UseFormReturn, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toInputDateString, toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    IGeneratedReport,
    TWithReportConfigSchema,
    useCreateGeneratedReport,
} from '@/modules/generated-report'
import { PrintSettingsSection } from '@/modules/generated-report/components/forms/print-config-section'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import InputDate from '@/components/ui/input-date'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { GL_BOOKS } from '../../general-ledger.constants'
import {
    GLBooksReport,
    TGLBooksReportSchema,
} from '../../general-ledger.validation'

export interface IGLBooksReportFormProps
    extends
        IClassProps,
        IForm<
            Partial<TGLBooksReportSchema>,
            IGeneratedReport,
            Error,
            TGLBooksReportSchema
        > {}

const GLBooksReportCreateForm = ({
    className,
    ...formProps
}: IGLBooksReportFormProps) => {
    const form = useForm<TGLBooksReportSchema>({
        resolver: standardSchemaResolver(GLBooksReport),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            start_date: undefined,
            end_date: toInputDateString(new Date()),
            book: undefined,
            report_type: 'detailed',
            ...formProps.defaultValues,
            report_config: {
                ...getTemplateAt(undefined, 0),
                ...formProps.defaultValues?.report_config,
                module: 'GeneralLedger',
                name: `gl_books_report_${toReadableDate(new Date(), 'MMddyy_mmss')}`,
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
        useFormHelper<TGLBooksReportSchema>({
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Start Date *"
                            name="start_date"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled(field.name)}
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
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        label="Book *"
                        name="book"
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select book" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(GL_BOOKS).map(
                                        ([value, label]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Report Type"
                        name="report_type"
                        render={({ field }) => (
                            <RadioGroup
                                className="grid grid-cols-2 gap-3"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                {[
                                    {
                                        value: 'detailed',
                                        label: 'Detailed',
                                        desc: 'Full breakdown of transactions',
                                    },
                                    {
                                        value: 'summary',
                                        label: 'Summary',
                                        desc: 'Condensed overview',
                                    },
                                ].map((opt) => {
                                    const isSelected = field.value === opt.value

                                    return (
                                        <label
                                            className={cn(
                                                'relative flex flex-col gap-1 rounded-lg border p-3 cursor-pointer',
                                                'hover:bg-accent/50',
                                                isSelected
                                                    ? 'bg-gradient-to-br from-popover to-primary/20 border-primary shadow-md ring-1 ring-primary/20'
                                                    : 'bg-background border-border'
                                            )}
                                            key={opt.value}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p
                                                    className={cn(
                                                        'text-sm font-medium',
                                                        isSelected
                                                            ? 'text-primary'
                                                            : 'text-foreground'
                                                    )}
                                                >
                                                    {opt.label}
                                                </p>
                                                <RadioGroupItem
                                                    value={opt.value}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {opt.desc}
                                            </p>
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

export default GLBooksReportCreateForm

export const GLBooksReportCreateFormModal = ({
    title = 'Create GL Books Report',
    description = 'Define filters and configuration for GL Books report',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IGLBooksReportFormProps, 'className' | 'onClose'>
}) => {
    return (
        <Modal
            className={cn('sm:max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <GLBooksReportCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}
