import { ReactNode } from 'react'

import { cn } from '@/helpers/tw-utils'
import { ControllerProps, FieldValues, Path } from 'react-hook-form'

import {
    FormDescription,
    FormField,
    FormHidableItem,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

export interface FormFieldWrapperProps<
    T extends FieldValues = FieldValues,
    TName extends Path<T> = Path<T>,
> extends ControllerProps<T, TName> {
    hiddenFields?: Array<Path<T>>

    isDisabled?: boolean
    hideFieldMessage?: boolean

    label?: string | ReactNode
    description?: string

    className?: string
    labelClassName?: string
    messageClassName?: string
    descriptionClassName?: string
}

const FormFieldWrapper = <
    T extends FieldValues,
    TName extends Path<T> = Path<T>,
>({
    name,
    label,
    className,
    description,
    hiddenFields,
    labelClassName,
    messageClassName,
    descriptionClassName,
    hideFieldMessage = false,
    render,
    ...controllerProps
}: FormFieldWrapperProps<T, TName>) => {
    return (
        <FormField<T, TName>
            name={name}
            render={({ field, ...other }) => (
                <FormHidableItem<T>
                    field={field.name}
                    hiddenFields={hiddenFields}
                >
                    <FormItem
                        className={cn('col-span-1 w-full space-y-1', className)}
                    >
                        {label && (
                            <FormLabel
                                htmlFor={field.name}
                                className={cn(
                                    'text-foreground/80',
                                    labelClassName
                                )}
                            >
                                {label}
                            </FormLabel>
                        )}
                        {description && (
                            <FormDescription
                                className={cn(descriptionClassName)}
                            >
                                {description}
                            </FormDescription>
                        )}
                        {render({ field, ...other })}
                        {!hideFieldMessage && (
                            <FormMessage
                                className={cn('text-xs', messageClassName)}
                            />
                        )}
                    </FormItem>
                </FormHidableItem>
            )}
            {...controllerProps}
        />
    )
}

export default FormFieldWrapper
