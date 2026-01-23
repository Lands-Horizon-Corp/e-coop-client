import { type ReactNode } from 'react'

import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import FormFieldWrapper from './ui/form-field-wrapper'
import { Label } from './ui/label'
import { Switch } from './ui/switch'

type Props<T extends FieldValues> = {
    form: UseFormReturn<T>
    isDisabled: (field: Path<T>) => boolean
    icon?: ReactNode
    name: Path<T>
    label?: string
    description?: string
}

function SwitchFormField<T extends FieldValues>({
    form,
    isDisabled,
    icon,
    name,
    label,
    description,
}: Props<T>) {
    return (
        <FormFieldWrapper
            control={form.control}
            name={name}
            render={({ field }) => (
                <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-checked:border-primary/30 has-checked:bg-linear-to-br has-checked:from-primary/50 has-checked:to-primary/10">
                    <Switch
                        aria-describedby={
                            description ? `${field.name}-desc` : undefined
                        }
                        checked={field.value}
                        className="order-1 after:absolute after:inset-0"
                        disabled={isDisabled(field.name)}
                        id={field.name}
                        onCheckedChange={field.onChange}
                    />
                    <div className="flex grow items-center gap-3">
                        {icon && (
                            <div className="size-fit rounded-full bg-secondary p-2">
                                {icon}
                            </div>
                        )}
                        {(label || description) && (
                            <div className="grid gap-2">
                                {label && (
                                    <Label htmlFor={field.name}>{label}</Label>
                                )}
                                {description && (
                                    <p
                                        className="text-xs text-muted-foreground"
                                        id={`${field.name}-desc`}
                                    >
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        />
    )
}

export default SwitchFormField
