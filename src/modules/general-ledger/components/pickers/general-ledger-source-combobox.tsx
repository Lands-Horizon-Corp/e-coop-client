import * as React from 'react'

import { cn } from '@/helpers/tw-utils'

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

import { GENERAL_LEDGER_SOURCES } from '../../general-ledger.constants'
import { TGeneralLedgerSource } from '../../general-ledger.types'

interface Props {
    value?: TGeneralLedgerSource
    onChange?: (value: TGeneralLedgerSource) => void
    disabled?: boolean
    placeholder?: string
    className?: string
}

const GeneralLedgerSourceCombobox = ({
    value,
    onChange,
    disabled = false,
    placeholder = 'Select Source...',
    className,
}: Props) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover modal onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    aria-expanded={open}
                    className={cn('w-full justify-between', className)}
                    disabled={disabled}
                    role="combobox"
                    variant="outline"
                >
                    {value ? (
                        <span className="truncate capitalize">{value}</span>
                    ) : (
                        <span className="text-muted-foreground">
                            {placeholder}
                        </span>
                    )}

                    <ChevronDownIcon className="opacity-50 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search source..." />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No source found.</CommandEmpty>
                        <CommandGroup>
                            {GENERAL_LEDGER_SOURCES.map((option, index) => (
                                <CommandItem
                                    key={`${option}-${index}`}
                                    onSelect={() => {
                                        onChange?.(option)
                                        setOpen(false)
                                    }}
                                    value={option}
                                >
                                    <span className="truncate capitalize">
                                        {option}
                                    </span>

                                    <CheckIcon
                                        className={cn(
                                            'ml-auto shrink-0',
                                            value === option
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

export default GeneralLedgerSourceCombobox
