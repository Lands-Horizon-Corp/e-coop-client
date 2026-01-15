import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { IAccountCategory, useGetAll } from '@/modules/account-category'

import { CheckIcon, ChevronDownIcon } from '@/components/icons'
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

import { TEntityId } from '@/types'

interface Props {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    undefinable?: boolean
    onChange?: (selected: IAccountCategory | undefined) => void
}

const AccountCategoryComboBox = ({
    value,
    className,
    disabled = false,
    undefinable = true,
    placeholder = 'Select Account Category...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)

    const { data: accountCategory, isLoading } = useGetAll()

    return (
        <>
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                        role="combobox"
                        variant="outline"
                    >
                        {value ? (
                            accountCategory?.find(
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
                            className="h-9"
                            placeholder="Search Account Category..."
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
                                    {accountCategory?.map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(option)
                                            }}
                                            value={option.name}
                                        >
                                            {option.name}
                                            <CheckIcon
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
