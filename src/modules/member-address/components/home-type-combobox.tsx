import * as React from 'react'

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

import { HOME_TYPES } from '../member-address.constants'
import { THomeType } from '../member-address.types'

interface Props extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'onChange'
> {
    value?: THomeType
    disabled?: boolean
    className?: string
    placeholder?: string
    homeTypes?: readonly THomeType[]
    onChange?: (selected: THomeType) => void
}

const HomeTypeCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            placeholder = 'Select Home Type...',
            homeTypes = HOME_TYPES,
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
                        <span>
                            {value ?? (
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
                            placeholder="Search home type..."
                        />
                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>No home type found.</CommandEmpty>
                            <CommandGroup>
                                {homeTypes.map((type) => (
                                    <CommandItem
                                        key={type}
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(type)
                                        }}
                                        value={type}
                                    >
                                        <span>{type}</span>
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto',
                                                value === type
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

HomeTypeCombobox.displayName = 'HomeTypeCombobox'

export default HomeTypeCombobox
