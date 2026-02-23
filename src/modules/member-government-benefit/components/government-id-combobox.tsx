import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { Check } from 'lucide-react'

import { ChevronDownIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
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

import { useGetAllGovernmentIds } from '../member-government-benefit.service'
import { IGovernmentId } from '../member-government-benefit.types'

interface Props extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'onChange'
> {
    value?: string
    disabled?: boolean
    className?: string
    placeholder?: string
    undefinable?: boolean
    isoAlpha3: string
    onChange?: (selected: IGovernmentId | undefined) => void
}

const GovernmentIdCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            undefinable = true,
            isoAlpha3,
            placeholder = 'Select Government ID...',
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)

        const { data, isLoading } = useGetAllGovernmentIds({
            isoAlpha3,
            options: {
                enabled: !!isoAlpha3,
            },
        })

        return (
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        {...other}
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                        ref={ref}
                        role="combobox"
                        variant="outline"
                    >
                        {value ? (
                            data?.find((option) => option.name === value)?.name
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <ChevronDownIcon className="opacity-50" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            className="h-9"
                            placeholder="Search Government ID..."
                        />
                        {isLoading ? (
                            <CommandEmpty>
                                <LoadingSpinner className="mr-2 inline-block" />{' '}
                                Loading...
                            </CommandEmpty>
                        ) : (
                            <CommandList className="ecoop-scroll">
                                <CommandEmpty>
                                    No Government ID found.
                                </CommandEmpty>
                                <CommandGroup>
                                    {undefinable && (
                                        <CommandItem
                                            className="justify-center text-muted-foreground"
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(undefined)
                                            }}
                                            value={undefined}
                                        >
                                            Select None
                                        </CommandItem>
                                    )}
                                    {data?.map((option) => (
                                        <CommandItem
                                            key={option.name}
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(option)
                                            }}
                                            value={option.name}
                                        >
                                            {option.name}
                                            <Check
                                                className={cn(
                                                    'ml-auto',
                                                    value === option.name
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }
)

GovernmentIdCombobox.displayName = 'GovernmentIdCombobox'

export default GovernmentIdCombobox
