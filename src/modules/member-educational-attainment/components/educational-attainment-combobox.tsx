import * as React from 'react'

import { cn } from '@/helpers'
import { Check } from 'lucide-react'

import { ChevronDownIcon } from '@/components/icons'
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

import { EDUCATIONAL_ATTAINMENT } from '../constants'
import { TEducationalAttainment } from '../member-educational-attainment.types'

interface Props {
    id?: string
    name?: string
    value?: TEducationalAttainment
    disabled?: boolean
    className?: string
    placeholder?: string
    attainments?: TEducationalAttainment[]
    onChange?: (selected: TEducationalAttainment) => void
}

const EducationalAttainmentCombobox = React.forwardRef<
    HTMLButtonElement,
    Props
>(
    (
        {
            value,
            className,
            disabled = false,
            placeholder = 'Select Educational Attainment...',
            attainments = Object.values(
                EDUCATIONAL_ATTAINMENT
            ) as TEducationalAttainment[],
            onChange,
            ...other
        }: Props,
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
                    <Command className="bg-background">
                        <CommandInput
                            className="h-9"
                            placeholder="Search Educational Attainment..."
                        />
                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>
                                No educational attainment found.
                            </CommandEmpty>
                            <CommandGroup>
                                {attainments.map((attainment) => (
                                    <CommandItem
                                        key={attainment}
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(attainment)
                                        }}
                                        value={attainment}
                                    >
                                        <span className="capitalize">
                                            {attainment}
                                        </span>
                                        <Check
                                            className={cn(
                                                'ml-auto',
                                                value === attainment
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

EducationalAttainmentCombobox.displayName = 'EducationalAttainmentCombobox'

export default EducationalAttainmentCombobox
