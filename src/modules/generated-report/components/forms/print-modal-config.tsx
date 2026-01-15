import { useState } from 'react'

import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import { useGeneratedReportConfigStore } from '@/store/generated-report-config-store'
import { FileTextIcon } from 'lucide-react'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import HbsRenderer from '@/components/reports/handlebars-renderer'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    IGeneratedReport,
    IGeneratedReportRequest,
    TemplateOptions,
} from '../../generated-report.types'
import { GeneratedReportSchema } from '../../generated-report.validation'
import {
    PAPER_SIZE_UNIT,
    TPaperSizeUnit,
    getPaperSize,
} from '../../generated-reports.constants'
import PaperSizeSelector, { TPaperSizeName } from './paper-size-selector'

export type TGeneratedReportFormValues = z.infer<typeof GeneratedReportSchema>

export interface IGeneratedReportFormProps
    extends IClassProps,
        IForm<
            Partial<IGeneratedReportRequest>,
            IGeneratedReport,
            Error,
            TGeneratedReportFormValues
        > {
    reportId?: TEntityId
    onClose: () => void
    templateOptions?: TemplateOptions[]
}

const PrintReportForm = ({
    className,
    onClose,
    templateOptions,
    ...formProps
}: IGeneratedReportFormProps) => {
    const [selectedTemplatePath, setSelectedTemplatePath] = useState<
        TemplateOptions | undefined
    >(templateOptions?.[0])
    const form = useForm<TGeneratedReportFormValues>({
        resolver: standardSchemaResolver(GeneratedReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            landscape: false,
            paper_size: selectedTemplatePath?.defaultSize,
            model: 'LoanTransaction',
            generated_report_type: 'pdf',
            template_config: selectedTemplatePath,
            ...formProps.defaultValues,
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TGeneratedReportFormValues>({
            form,
            ...formProps,
        })

    const { setConfig } = useGeneratedReportConfigStore()

    const onSubmit = form.handleSubmit((formData) => {
        const selectedSize = formData.paper_size as TPaperSizeName | undefined
        const paperSize = selectedSize
            ? getPaperSize(selectedSize)
            : getPaperSize('A4')

        const payload: IGeneratedReportRequest = {
            ...formData,
            unit: paperSize.unit,
            width: paperSize.width,
            height: paperSize.height,
        }

        setConfig(payload)
        formProps.onSubmit?.(
            payload as Required<Partial<IGeneratedReportRequest>>
        )
        onClose()
    }, handleFocusError)

    const selectedPaperSize = form.watch('paper_size')
    const isDisableCustom = form.watch('template_config')?.label !== 'Custom'

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-6', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <HbsRenderer
                    onHtmlReady={(template) => {
                        form.setValue('template', template, {
                            shouldDirty: false,
                        })
                    }}
                    templatePath={
                        selectedTemplatePath?.value ||
                        templateOptions?.[0].value
                    }
                />
                <fieldset
                    className="flex flex-col gap-4"
                    disabled={formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Name"
                        name="name"
                        render={({ field }) => (
                            <Input {...field} placeholder="Enter report name" />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Description"
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                placeholder="Brief description of this report"
                                rows={3}
                            />
                        )}
                    />
                </fieldset>

                {/* --- Template Selection --- */}
                <div>
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                            Template Selection
                        </h3>
                        <FormFieldWrapper
                            control={form.control}
                            label="Choose Template"
                            name="template_config"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 gap-2"
                                    disabled={formProps.readOnly}
                                    onValueChange={(value) => {
                                        const parsedTemplate = JSON.parse(
                                            value
                                        ) as TemplateOptions
                                        field.onChange(parsedTemplate)
                                        setSelectedTemplatePath(parsedTemplate)
                                        form.setValue(
                                            'paper_size',
                                            parsedTemplate.defaultSize,
                                            {
                                                shouldDirty: true,
                                            }
                                        )
                                    }}
                                    value={
                                        field.value
                                            ? JSON.stringify(field.value)
                                            : JSON.stringify(
                                                  selectedTemplatePath
                                              )
                                    }
                                >
                                    {templateOptions?.map((template, idx) => {
                                        return (
                                            <div key={idx}>
                                                <div className="shadow-xs h-full relative flex w-full items-center gap-3 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                    <RadioGroupItem
                                                        className="order-1 after:absolute after:inset-0"
                                                        id={`template-${template.value}`}
                                                        value={JSON.stringify(
                                                            template
                                                        )}
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                            <FileTextIcon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <Label
                                                                className="font-semibold cursor-pointer"
                                                                htmlFor={`template-${template.value}`}
                                                            >
                                                                {template.label}
                                                            </Label>
                                                            <span className="text-xs text-muted-foreground">
                                                                {
                                                                    template.description
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </RadioGroup>
                            )}
                        />
                    </div>
                </div>
                <PaperSizeSelector
                    currentValue={selectedPaperSize}
                    disabled={isDisableCustom}
                    onSelect={(sizeName) => {
                        form.setValue('paper_size', sizeName, {
                            shouldDirty: true,
                            shouldValidate: true,
                        })
                    }}
                />
                {!selectedPaperSize && (
                    <fieldset
                        className="grid gap-x-6 gap-y-4 md:grid-cols-4"
                        disabled={formProps.readOnly}
                    >
                        <FormFieldWrapper
                            control={form.control}
                            label="Custom Width"
                            name="width"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="e.g., 210"
                                    step="0.1"
                                    type="number"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Custom Height"
                            name="height"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="e.g., 297"
                                    step="0.1"
                                    type="number"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Unit"
                            name="unit"
                            render={({ field }) => (
                                <Select
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(
                                            Object.values(
                                                PAPER_SIZE_UNIT
                                            ) as TPaperSizeUnit[]
                                        ).map((unit) => (
                                            <SelectItem key={unit} value={unit}>
                                                {unit}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Landscape"
                            name="landscape"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2 mt-2">
                                    <Switch
                                        checked={field.value}
                                        id="landscape-mode"
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label htmlFor="landscape-mode">
                                        Enable Landscape
                                    </Label>
                                </div>
                            )}
                        />
                    </fieldset>
                )}
                <FormFooterResetSubmit
                    onReset={() => {
                        form.reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Generate Report"
                />
            </form>
        </Form>
    )
}

export const PrintReportFormModal = ({
    title = 'Create Generated Report',
    description = 'Define the source and printing specifications for a new report.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IGeneratedReportFormProps, 'className' | 'onClose'>
}) => {
    return (
        <Modal
            className={cn('sm:max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <PrintReportForm
                {...formProps}
                onClose={() => props.onOpenChange?.(false)}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default PrintReportFormModal
