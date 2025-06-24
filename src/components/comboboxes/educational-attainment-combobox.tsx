import * as React from 'react'
import { Check } from 'lucide-react'

import {
    Command,
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandInput,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@/components/icons'

import { EDUCATIONAL_ATTAINMENT } from '@/constants'
import { cn } from '@/lib/utils'
import { TEducationalAttainment } from '@/types'

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
                    <Command className="bg-background">
                        <CommandInput
                            placeholder="Search Educational Attainment..."
                            className="h-9"
                        />
                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>
                                No educational attainment found.
                            </CommandEmpty>
                            <CommandGroup>
                                {attainments.map((attainment) => (
                                    <CommandItem
                                        key={attainment}
                                        value={attainment}
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(attainment)
                                        }}
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
