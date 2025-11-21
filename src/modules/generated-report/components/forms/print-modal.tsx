import { useState } from 'react'

import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import { FileTextIcon } from 'lucide-react'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import Modal, { IModalProps } from '@/components/modals/modal'
import HbsRenderer from '@/components/reports/handlebars-renderer'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
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

import { useCreateGeneratedReport } from '../../generated-report.service'
import {
    ACCOUNT_MODEL_NAMES,
    GENERATE_REPORT_TYPE,
    IGeneratedReport,
} from '../../generated-report.types'
import {
    PAPER_SIZE_UNIT,
    TPaperSizeUnit,
    getPaperSize,
} from '../../generated-reports.constants'
import PaperSizeSelector, { PaperSizeName } from './paper-size-selector'

const TEMPLATE_OPTIONS = [
    {
        value: '/reports/loan-release-voucher/template-1.hbs',
        label: 'Classic Base',
        description: 'Traditional loan release voucher format',
    },
    {
        value: '/reports/loan-release-voucher/template-2.hbs',
        label: 'Modern Voucher',
        description: 'Clean and contemporary design',
    },
    {
        value: '/reports/loan-release-voucher/template-3.hbs',
        label: 'Receipt',
        description: 'Space-efficient layout',
    },
] as const

export const GeneratedReportSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    model: z.enum(ACCOUNT_MODEL_NAMES),
    generated_report_type: z.enum(GENERATE_REPORT_TYPE),

    paper_size: z.string().optional(),
    template: z.string().optional(),
    template_path: z.string().optional(),
    url: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    unit: z.enum(PAPER_SIZE_UNIT).optional(),
    landscape: z.boolean().optional(),
})

export type TGeneratedReportFormValues = z.infer<typeof GeneratedReportSchema>

export interface IGeneratedReportRequest extends TGeneratedReportFormValues {}

export interface IGeneratedReportFormProps
    extends IClassProps,
        IForm<
            Partial<IGeneratedReportRequest>,
            IGeneratedReport,
            Error,
            TGeneratedReportFormValues
        > {
    reportId?: TEntityId
}

const PrintReportForm = ({
    className,
    ...formProps
}: IGeneratedReportFormProps) => {
    const [selectedTemplatePath, setSelectedTemplatePath] = useState<string>(
        TEMPLATE_OPTIONS[0].value
    )

    const form = useForm<TGeneratedReportFormValues>({
        resolver: standardSchemaResolver(GeneratedReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            paper_size: 'A4',
            landscape: false,
            template_path: TEMPLATE_OPTIONS[0].value,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateGeneratedReport({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TGeneratedReportFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        const payload = {
            ...formData,
            unit: getPaperSize((formData.paper_size ?? 'A4') as PaperSizeName)
                .unit,
            width: getPaperSize((formData.paper_size ?? 'A4') as PaperSizeName)
                .width,
            height: getPaperSize((formData.paper_size ?? 'A4') as PaperSizeName)
                .height,
        }
        createMutation.mutate(payload)
    }, handleFocusError)

    const { error: errorResponse, isPending, reset } = createMutation

    const error = errorResponse ? 'Failed to process request' : undefined

    const selectedPaperSize = form.watch('paper_size')

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
                        form.watch('template_path') || selectedTemplatePath
                    }
                />
                <fieldset
                    className="flex flex-col gap-4"
                    disabled={isPending || formProps.readOnly}
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
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                        Template Selection
                    </h3>
                    <FormFieldWrapper
                        control={form.control}
                        label="Choose Template"
                        name="template_path"
                        render={({ field }) => (
                            <RadioGroup
                                className="flex flex-col gap-2"
                                disabled={isPending || formProps.readOnly}
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    setSelectedTemplatePath(value)
                                }}
                                value={field.value || selectedTemplatePath}
                            >
                                {TEMPLATE_OPTIONS.map((template) => (
                                    <GradientBackground
                                        gradientOnly
                                        key={template.value}
                                    >
                                        <div className="shadow-xs relative flex w-full items-center gap-3 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                            <RadioGroupItem
                                                className="order-1 after:absolute after:inset-0"
                                                id={`template-${template.value}`}
                                                value={template.value}
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
                                                        {template.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </GradientBackground>
                                ))}
                            </RadioGroup>
                        )}
                    />
                </div>

                {/* --- Print & Template Settings --- */}
                <h3 className="text-lg font-semibold border-b pb-2 mt-4">
                    Print & Template Settings
                </h3>
                <fieldset
                    className="grid gap-x-6 gap-y-4 md:grid-cols-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="md:col-span-3">
                        <Label>Paper Size Preset</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    className="w-full justify-start text-left font-normal mt-2"
                                    type="button"
                                    variant="outline"
                                >
                                    {selectedPaperSize || 'Select paper size'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="start"
                                className="w-full overflow-y-auto ecoop-scroll p-4 max-h-52"
                            >
                                <PaperSizeSelector
                                    currentValue={selectedPaperSize}
                                    onSelect={(sizeName) => {
                                        form.setValue('paper_size', sizeName, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        })
                                        form.setValue('width', undefined)
                                        form.setValue('height', undefined)
                                        form.setValue('unit', undefined)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </fieldset>

                {!selectedPaperSize && (
                    <fieldset
                        className="grid gap-x-6 gap-y-4 md:grid-cols-4"
                        disabled={isPending || formProps.readOnly}
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
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={
                        formProps.reportId ? 'Update Report' : 'Create Report'
                    }
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
    formProps?: Omit<IGeneratedReportFormProps, 'className'>
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
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default PrintReportFormModal
