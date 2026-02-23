import * as React from 'react'

import { SEX, TSex } from '@/constants'
import { cn } from '@/helpers'

import { CheckIcon, ChevronDownIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

interface Props extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'onChange'
> {
    value?: TSex
    disabled?: boolean
    className?: string
    placeholder?: string
    sexes?: readonly TSex[]
    onChange?: (selected: TSex) => void
}

const SexCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            placeholder = 'Select Sex...',
            sexes = SEX,
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)

        return (
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        {...other}
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled}
                        ref={ref}
                        role="combobox"
                        type="button"
                        variant="outline"
                    >
                        <span className="capitalize">
                            {value || (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            )}
                        </span>
                        <ChevronDownIcon className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            className="h-9"
                            placeholder="Search Sex..."
                        />
                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>No sex found.</CommandEmpty>
                            <CommandGroup>
                                {sexes.map((sex) => (
                                    <CommandItem
                                        key={sex}
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(sex)
                                        }}
                                        value={sex}
                                    >
                                        <span className="capitalize">
                                            {sex}
                                        </span>
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto',
                                                value === sex
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }
)

SexCombobox.displayName = 'SexCombobox'

export default SexCombobox
