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

import { ACCOUNT_MODEL_NAMES, TModelName } from '../generated-report.types'

interface Props {
    value?: TModelName
    disabled?: boolean
    className?: string
    placeholder?: string
    onChange?: (selected: TModelName) => void
}

const ModelCombobox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select Model...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)

    const data = ACCOUNT_MODEL_NAMES

    const selectedModel = React.useMemo(
        () => data.find((model) => model === value),
        [data, value]
    )

    return (
        <Popover modal onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    aria-expanded={open}
                    className={cn('w-full justify-between px-3', className)}
                    disabled={disabled}
                    role="combobox"
                    variant="outline"
                >
                    {selectedModel ? (
                        <span className="truncate">{selectedModel}</span>
                    ) : (
                        <span className="text-muted-foreground">
                            {placeholder}
                        </span>
                    )}
                    <ChevronDownIcon className="opacity-50 flex-shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput
                        className="h-9"
                        placeholder="Search Model..."
                    />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No Model found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((option) => (
                                <CommandItem
                                    key={option}
                                    onSelect={() => {
                                        setOpen(false)
                                        onChange?.(option)
                                    }}
                                    value={option}
                                >
                                    <span className="truncate flex-1">
                                        {option}
                                    </span>
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto flex-shrink-0',
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

export default ModelCombobox
