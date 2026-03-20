import { UseFormReturn } from 'react-hook-form'

import { PrinterFillIcon } from '@/components/icons'
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
import PasswordInput from '@/components/ui/password-input'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select'
// import { Label } from '@/components/ui/label'
// import { Switch } from '@/components/ui/switch'
// import { TPaperSizeUnit } from '../../generated-report.types'
// import { PAPER_SIZE_UNIT } from '../../generated-reports.constants'
import { TWithReportConfigSchema } from '../../generated-report.validation'
import {
    GenerateReportTemplatePickerModal,
    GenerateReportTemplatePickerProps,
} from '../generated-report-template/generated-report-template'

type Props = {
    form: UseFormReturn<TWithReportConfigSchema>
    withTemplatePicker?: boolean
} & Pick<GenerateReportTemplatePickerProps, 'registryKey' | 'templates'>

export function PrintSettingsSection({ form, ...otherConfig }: Props) {
    const modalState = useModalState()

    const { control, setValue } = form

    return (
        <div>
            <p className="text-sm">Generate Option</p>
            <p className="text-xs text-muted-foreground">
                Adjust options to define size of the template
            </p>
            <div className="grid grid-cols-2 gap-4">
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

                {/* <FormFieldWrapper
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
                /> */}

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
                                setValue(
                                    'report_config.width',
                                    dimension.width,
                                    {
                                        shouldDirty: true,
                                        shouldTouch: true,
                                    }
                                )
                                setValue(
                                    'report_config.height',
                                    dimension.height,
                                    {
                                        shouldDirty: true,
                                        shouldTouch: true,
                                    }
                                )
                                setValue('report_config.unit', dimension.unit, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                })
                            },
                        }}
                        trigger={
                            <Button className="col-span-2 w-full" type="button">
                                Choose Template
                            </Button>
                        }
                    />

                    <p className="text-sm text-muted-foreground mt-2">
                        For more standard measurement, we suggest using defined
                        template
                    </p>
                </div>
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
