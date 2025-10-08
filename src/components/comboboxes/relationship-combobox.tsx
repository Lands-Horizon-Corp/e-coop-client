import * as React from 'react'

import { cn } from '@/helpers'
import {
    FAMILY_RELATIONSHIP,
    TRelationship,
} from '@/modules/member-relative-account'

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

// Assuming this is where your type and const are

interface Props {
    id?: string
    name?: string
    value?: TRelationship
    disabled?: boolean
    className?: string
    placeholder?: string
    relationships?: TRelationship[]
    onChange?: (selected: TRelationship) => void
}

const RelationshipCombobox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select Relationship...',
    relationships = [...FAMILY_RELATIONSHIP],
    onChange,
    ...other
}: Props) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover modal onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    {...other}
                    aria-expanded={open}
                    className={cn('w-full justify-between px-3', className)}
                    disabled={disabled}
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
                        placeholder="Search Relationship..."
                    />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No relationship found.</CommandEmpty>
                        <CommandGroup>
                            {relationships.map((relationship) => (
                                <CommandItem
                                    key={relationship}
                                    onSelect={() => {
                                        setOpen(false)
                                        onChange?.(relationship)
                                    }}
                                    value={relationship}
                                >
                                    <span className="capitalize">
                                        {relationship}
                                    </span>
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto',
                                            value === relationship
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

export default RelationshipCombobox
