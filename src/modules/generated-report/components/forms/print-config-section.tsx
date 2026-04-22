import { useEffect, useState } from 'react'

import { UseFormReturn } from 'react-hook-form'

import { cn } from '@/helpers'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    ChevronDownIcon,
    PrinterFillIcon,
    TextAaIcon,
} from '@/components/icons'
import { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import PasswordInput from '@/components/ui/password-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { TWithReportConfigSchema } from '../../generated-report.validation'
import { DISPLAY_DENSITY } from '../../generated-reports.constants'
import {
    GenerateReportTemplatePickerModal,
    GenerateReportTemplatePickerProps,
} from '../generated-report-template/generated-report-template'

type Props = {
    form: UseFormReturn<TWithReportConfigSchema>
    withTemplatePicker?: boolean
    displayMode?: 'solo' | 'dropdown'
} & Pick<GenerateReportTemplatePickerProps, 'registryKey' | 'templates'>

export function PrintSettingsSection({
    form,
    displayMode = 'solo',
    ...otherConfig
}: Props) {
    const modalState = useModalState()
    const [open, setOpen] = useState(displayMode === 'solo')

    const { control, setValue, formState } = form

    const hasError = !!formState.errors?.report_config

    useEffect(() => {
        if (displayMode === 'dropdown' && hasError) {
            setOpen(true)
        }
    }, [displayMode, hasError])

    useHotkeys(
        'alt+enter',
        (e) => {
            e.preventDefault()
            e.stopPropagation()

            if (displayMode === 'dropdown') {
                setOpen(true)
            }

            modalState.onOpenChange(true)
        },
        { enableOnFormTags: true }
    )

    const content = (
        <div className="grid grid-cols-2 gap-4 mt-4">
            <FormFieldWrapper
                control={control}
                description="Set document file name"
                label="Generated File Name"
                name="report_config.name"
                render={({ field }) => (
                    <Input
                        {...field}
                        autoComplete="off-name"
                        placeholder="Enter file name"
                    />
                )}
            />

            <FormFieldWrapper
                control={control}
                description="Set document password"
                label="Password"
                name="report_config.password"
                render={({ field }) => (
                    <PasswordInput
                        {...field}
                        autoComplete="new-password"
                        placeholder="Enter password (optional)"
                    />
                )}
            />

            <FormFieldWrapper
                control={control}
                label="Width"
                name="report_config.width"
                render={({ field }) => (
                    <Input {...field} placeholder="e.g., 210in" />
                )}
            />

            <FormFieldWrapper
                control={control}
                label="Height"
                name="report_config.height"
                render={({ field }) => (
                    <Input {...field} placeholder="e.g., 297in" />
                )}
            />

            <FormFieldWrapper
                control={form.control}
                label="Orientation"
                name="report_config.orientation"
                render={({ field }) => (
                    <RadioGroup
                        className="flex gap-2"
                        onValueChange={field.onChange}
                        value={field.value}
                    >
                        {[
                            {
                                value: 'portrait',
                                label: 'Portrait',
                                size: { width: 14, height: 18 },
                            },
                            {
                                value: 'landscape',
                                label: 'Landscape',
                                size: { width: 18, height: 14 },
                            },
                        ].map((opt) => {
                            const isSelected = field.value === opt.value

                            return (
                                <label
                                    className={cn(
                                        'flex-1 flex items-center justify-center gap-1.5 rounded-md border-2 py-1.5 px-2 cursor-pointer transition-all',
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
                                    <div
                                        className={cn(
                                            'rounded-[2px] border transition-all',
                                            isSelected
                                                ? 'border-primary bg-primary/20'
                                                : 'border-border bg-muted'
                                        )}
                                        style={opt.size}
                                    />
                                    <span
                                        className={cn(
                                            'text-xs font-medium capitalize',
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

            <FormFieldWrapper
                control={form.control}
                label="Display Density"
                name="report_config.display_density"
                render={({ field }) => (
                    <RadioGroup
                        aria-label="Density"
                        className="mt-1 flex items-center gap-2"
                        onValueChange={(v) => field.onChange(v)}
                        value={field.value}
                    >
                        {DISPLAY_DENSITY.map((density, i) => {
                            const isActive = field.value === density
                            const id = `density-${density}`

                            return (
                                <Label
                                    className={cn(
                                        'flex cursor-pointer flex-col border border-muted-foreground/20 items-center gap-1 gap-y-2 rounded-xl px-2 py-1.5 text-xs font-medium transition-colors',
                                        'hover:text-foreground',
                                        isActive
                                            ? 'text-primary border-primary/40 bg-primary/5 border'
                                            : 'text-muted-foreground hover:bg-primary/5 hover:border hover:border-primary/20'
                                    )}
                                    htmlFor={id}
                                >
                                    <RadioGroupItem
                                        className="sr-only"
                                        id={id}
                                        value={density}
                                    />
                                    <span className="size-6 inline-flex items-center justify-center">
                                        <TextAaIcon
                                            style={{
                                                width: `${60 + i * 20}%`,
                                                height: `${60 + i * 20}%`,
                                            }}
                                        />
                                    </span>
                                    <span className="capitalize leading-none">
                                        {density}
                                    </span>
                                </Label>
                            )
                        })}
                    </RadioGroup>
                )}
            />

            <div className="col-span-2">
                <GenerateReportTemplatePickerModal
                    {...modalState}
                    templatePickerProps={{
                        ...otherConfig,
                        onSelect: async (template, dimension) => {
                            setValue(
                                'report_config.template',
                                template.template,
                                {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                }
                            )
                            setValue('report_config.width', dimension.width, {
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                            setValue('report_config.height', dimension.height, {
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                            setValue('report_config.unit', dimension.unit, {
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                        },
                    }}
                    trigger={
                        <Button
                            className="w-full"
                            size="sm"
                            type="button"
                            variant="secondary"
                        >
                            Template
                            <span>
                                <Kbd className="mr-1">Alt</Kbd>
                                <Kbd>Enter</Kbd>
                            </span>
                        </Button>
                    }
                />

                <p className="text-sm text-muted-foreground mt-2">
                    For more standard measurement, we suggest using defined
                    template
                </p>
            </div>
        </div>
    )

    if (displayMode === 'solo') {
        return (
            <div>
                <p className="text-sm">Generate Option</p>
                <p className="text-xs text-muted-foreground">
                    Adjust options to define size of the template
                </p>
                {content}
            </div>
        )
    }

    return (
        <div className="rounded-xl overflow-hidden bg-popover border p-4">
            <button
                className={cn(
                    'w-full text-left flex items-center justify-between',
                    'group'
                )}
                onClick={() => setOpen((prev) => !prev)}
                type="button"
            >
                <div>
                    <p className="text-sm font-medium">Generate Option</p>
                    <p className="text-xs text-muted-foreground">
                        Adjust options to define size of the template
                    </p>
                </div>

                <ChevronDownIcon
                    className={cn(
                        'size-4 text-muted-foreground transition-transform duration-200',
                        open && 'rotate-180'
                    )}
                />
            </button>

            <div
                className={cn(
                    'grid transition-all duration-200 ease-in-out',
                    open
                        ? 'grid-rows-[1fr] opacity-100 mt-4'
                        : 'grid-rows-[0fr] opacity-0'
                )}
            >
                <div className="overflow-hidden">{content}</div>
            </div>
        </div>
    )
}

export const PrintConfigSectionDialog = ({
    printConfigProps,
    ...modalProps
}: IModalProps & { printConfigProps: Props }) => {
    return (
        <Dialog {...modalProps}>
            <DialogTrigger asChild>
                <Button
                    className="h-8 gap-2 text-xs font-medium"
                    size="sm"
                    type="button"
                    variant="outline"
                >
                    <PrinterFillIcon className="h-3.5 w-3.5" />
                    Print Configuration
                </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-xl rounded-xl">
                <DialogHeader>
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-subtle">
                            <PrinterFillIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-base">
                                Print Configuration
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Manage output dimensions and templates.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <PrintSettingsSection {...printConfigProps} />
            </DialogContent>
        </Dialog>
    )
}
