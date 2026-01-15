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

import { TEntityId } from '@/types'

import { useGetMemberProfileArchiveCategory } from '../member-profile-archive.service'

interface Props
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
    value?: string
    disabled?: boolean
    className?: string
    placeholder?: string
    undefinable?: boolean
    memberProfileId: TEntityId
    chevronOnly?: boolean
    onChange?: (selected: string | undefined) => void
}

const MemberProfileArchiveCategoryCombobox = React.forwardRef<
    HTMLButtonElement,
    Props
>(
    (
        {
            value,
            className,
            chevronOnly = false,
            disabled = false,
            undefinable = true,
            memberProfileId,
            placeholder = 'Select Category...',
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)

        const { data: suggestedCategories, isPending: isPendingCategories } =
            useGetMemberProfileArchiveCategory({ memberProfileId })

        return (
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        {...other}
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isPendingCategories}
                        ref={ref}
                        role="combobox"
                        variant="outline"
                    >
                        {!chevronOnly && (
                            <>
                                {value ? (
                                    suggestedCategories?.find(
                                        (option) => option.name === value
                                    )?.name
                                ) : (
                                    <span className="text-muted-foreground">
                                        {placeholder}
                                    </span>
                                )}
                            </>
                        )}
                        <ChevronDownIcon className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            className="h-9"
                            placeholder="Search category..."
                        />
                        {isPendingCategories ? (
                            <CommandEmpty>
                                <LoadingSpinner className="mr-2 inline-block" />{' '}
                                Loading...
                            </CommandEmpty>
                        ) : (
                            <CommandList className="ecoop-scroll">
                                <CommandEmpty>No category found.</CommandEmpty>
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
                                    {suggestedCategories?.map((option) => (
                                        <CommandItem
                                            key={option.name}
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(option.name)
                                            }}
                                            value={option.name}
                                        >
                                            {option.name}
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                ({option.count})
                                            </span>
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

MemberProfileArchiveCategoryCombobox.displayName =
    'MemberProfileArchiveCategoryCombobox'

export default MemberProfileArchiveCategoryCombobox
