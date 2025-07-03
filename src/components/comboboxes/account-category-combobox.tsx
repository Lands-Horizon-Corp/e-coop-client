import * as React from 'react'
import { Check } from 'lucide-react'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandInput,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { TEntityId } from '@/types'
import { IAccountCategory } from '@/types/coop-types/account-category'
import { useFilteredPaginatedAccountCategory } from '@/hooks/api-hooks/use-account-category'

interface Props {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    onChange?: (selected: IAccountCategory) => void
}

const AccountCategoryComboBox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select Account Category...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)

    const { data: accountCategory, isLoading } =
        useFilteredPaginatedAccountCategory()

    return (
        <>
            <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                    >
                        {value ? (
                            accountCategory.data.find(
                                (option) => option.id === value
                            )?.name
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                        <ChevronDownIcon className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search Account Category..."
                            className="h-9"
                        />
                        {isLoading ? (
                            <CommandEmpty>
                                <LoadingSpinner className="mr-2 inline-block" />{' '}
                                Loading...
                            </CommandEmpty>
                        ) : (
                            <CommandList className="ecoop-scroll">
                                <CommandEmpty>
                                    No Account Category found
                                </CommandEmpty>
                                <CommandGroup>
                                    {accountCategory.data.map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            value={option.name}
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(option)
                                            }}
                                        >
                                            {option.name}
                                            <Check
                                                className={cn(
                                                    'ml-auto',
                                                    value === option.id
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
        </>
    )
}

export default AccountCategoryComboBox
