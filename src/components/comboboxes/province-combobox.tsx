import * as React from 'react'

import { getProvinces } from '@/helpers/address'
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

import { cn } from '@/lib/utils'

interface Props {
    id?: string
    name?: string
    value?: string
    disabled?: boolean
    className?: string
    placeholder?: string
    onChange?: (selected: string) => void
}

const ProvinceCombobox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select Province...',
    onChange,
    ...other
}: Props) => {
    const [open, setOpen] = React.useState(false)

    const provinces = React.useMemo(() => getProvinces(), [])

    return (
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    {...other}
                    type="button"
                    role="combobox"
                    variant="outline"
                    disabled={disabled}
                    aria-expanded={open}
                    className={cn('w-full justify-between px-3', className)}
                >
                    <span className="capitalize">
                        {value?.toLocaleLowerCase() || (
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
                        placeholder="Search Province..."
                    />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No Province found.</CommandEmpty>
                        <CommandGroup>
                            {provinces.map((province) => (
                                <CommandItem
                                    key={province}
                                    value={province}
                                    onSelect={() => {
                                        setOpen(false)
                                        onChange?.(province)
                                    }}
                                >
                                    {province}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === province
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

export default ProvinceCombobox
