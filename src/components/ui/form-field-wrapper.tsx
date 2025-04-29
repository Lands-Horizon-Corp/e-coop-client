import { Path, FieldValues, ControllerProps } from 'react-hook-form'

import {
    FormItem,
    FormLabel,
    FormField,
    FormMessage,
    FormDescription,
    FormHidableItem,
} from '@/components/ui/form'

import { cn } from '@/lib/utils'

export interface FormFieldWrapperProps<
    T extends FieldValues = FieldValues,
    TName extends Path<T> = Path<T>,
> extends ControllerProps<T, TName> {
    hiddenFields?: Array<Path<T>>

    isDisabled?: boolean
    hideFieldMessage?: boolean

    label?: string
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
                                className={cn(labelClassName)}
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
