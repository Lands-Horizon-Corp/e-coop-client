import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { Check, ChevronsUpDown } from 'lucide-react'

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

import { PAPER_SIZES } from '../../generated-reports.constants'

export type TPaperSizeName = keyof typeof PAPER_SIZES

export type TPaperSizeUnit = 'mm' | 'in' | 'pt'

export interface PaperSize {
    name: string
    width: number
    height: number
    unit: TPaperSizeUnit
}

const PaperSizeSelector = ({
    currentValue,
    onSelect,
    disabled,
    placeholder = 'Select paper size…',
}: {
    currentValue?: string
    onSelect: (sizeName: TPaperSizeName | undefined) => void
    disabled?: boolean
    placeholder?: string
}) => {
    const [open, setOpen] = React.useState(false)

    const selectedSize = currentValue
        ? PAPER_SIZES[currentValue as TPaperSizeName]
        : undefined

    return (
        <Popover modal onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                    role="combobox"
                    type="button"
                    variant="outline"
                >
                    {selectedSize ? (
                        <span className="flex items-center gap-2 truncate">
                            <span className="font-medium">
                                {selectedSize.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {selectedSize.width}×{selectedSize.height}{' '}
                                {selectedSize.unit}
                            </span>
                        </span>
                    ) : (
                        <span className="text-muted-foreground truncate">
                            {placeholder}
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-[--radix-popover-trigger-width] p-0"
            >
                <Command>
                    <CommandInput
                        className="h-9"
                        placeholder="Search paper size..."
                    />
                    <CommandList className="max-h-72 ecoop-scroll">
                        <CommandEmpty>No paper size found.</CommandEmpty>
                        <CommandGroup heading="Custom">
                            <CommandItem
                                onSelect={() => {
                                    onSelect(undefined)
                                    setOpen(false)
                                }}
                                value="custom"
                            >
                                🛠️ Custom size…
                                <Check
                                    className={cn(
                                        'ml-auto size-4',
                                        !currentValue
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                            </CommandItem>
                        </CommandGroup>
                        <CommandGroup heading="Preset Sizes">
                            {Object.entries(PAPER_SIZES).map(([key, data]) => (
                                <CommandItem
                                    key={key}
                                    onSelect={() => {
                                        onSelect(key as TPaperSizeName)
                                        setOpen(false)
                                    }}
                                    value={`${data.name} ${data.width}x${data.height} ${data.unit}`}
                                >
                                    <span className="flex flex-col">
                                        <span className="font-medium leading-none">
                                            {data.name}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">
                                            {data.width}×{data.height}{' '}
                                            {data.unit}
                                        </span>
                                    </span>
                                    <Check
                                        className={cn(
                                            'ml-auto size-4',
                                            currentValue === key
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

export default PaperSizeSelector
