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

import { TPrintSettingsSchema } from '../../generated-report.validation'
import {
    GenerateReportTemplatePickerModal,
    GenerateReportTemplatePickerProps,
} from '../generated-report-template/generated-report-template'

type Props = {
    form: UseFormReturn<TPrintSettingsSchema>
    withTemplatePicker?: boolean
} & Pick<GenerateReportTemplatePickerProps, 'registryKey' | 'templates'>

export function PrintSettingsSection({ form, ...otherConfig }: Props) {
    const modalState = useModalState()

    const { control, setValue } = form

    return (
        <div className="grid grid-cols-2 gap-4">
            <FormFieldWrapper
                control={control}
                description="Set document file name"
                label="Generated File Name"
                name="name"
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
                name={'password'}
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
                name={'width'}
                render={({ field }) => (
                    <Input {...field} placeholder="e.g., 210" />
                )}
            />

            <FormFieldWrapper
                control={control}
                label="Height"
                name={'height'}
                render={({ field }) => (
                    <Input {...field} placeholder="e.g., 297" />
                )}
            />

            <div className="col-span-2">
                <GenerateReportTemplatePickerModal
                    {...modalState}
                    templatePickerProps={{
                        ...otherConfig,
                        onSelect: async (template, dimension) => {
                            let templateValue: string

                            if (typeof template.template === 'function') {
                                const imported = await template.template()
                                templateValue = imported.default
                            } else {
                                templateValue = template.template
                            }

                            setValue('template', templateValue, {
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                            setValue('width', dimension.width, {
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                            setValue('height', dimension.height, {
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                        },
                    }}
                    trigger={<Button type="button">Choose Template</Button>}
                />

                <p className="text-sm text-muted-foreground mt-2">
                    For more standard measurement, we suggest using defined
                    template
                </p>
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
