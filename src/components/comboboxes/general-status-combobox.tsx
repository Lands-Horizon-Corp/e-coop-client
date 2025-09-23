import * as React from 'react'

import { GENERAL_STATUS } from '@/constants'
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

import { TGeneralStatus } from '@/types'

interface Props
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
    id?: string
    name?: string
    value?: TGeneralStatus
    disabled?: boolean
    className?: string
    placeholder?: string
    generalStatuses?: TGeneralStatus[]
    onChange?: (selected: TGeneralStatus) => void
}

const GeneralStatusCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            placeholder = 'Select General Status...',
            generalStatuses = GENERAL_STATUS,
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)

        return (
            <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        {...other}
                        ref={ref}
                        type="button"
                        role="combobox"
                        variant="outline"
                        disabled={disabled}
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
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
                            placeholder="Search General Status..."
                            className="h-9"
                        />
                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>
                                No general status found.
                            </CommandEmpty>
                            <CommandGroup>
                                {generalStatuses.map((status) => (
                                    <CommandItem
                                        key={status}
                                        value={status}
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(status)
                                        }}
                                    >
                                        <span className="capitalize">
                                            {status}
                                        </span>
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto',
                                                value === status
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

GeneralStatusCombobox.displayName = 'GeneralStatusCombobox'

export default GeneralStatusCombobox
