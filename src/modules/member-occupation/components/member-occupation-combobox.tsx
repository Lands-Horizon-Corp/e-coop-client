import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { Check } from 'lucide-react'

import { ChevronDownIcon, PlusIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { TEntityId } from '@/types'

import { useGetAll } from '../member-occupation.service'
import { IMemberOccupation } from '../member-occupation.types'
import {
    IMemberOccupationCreateUpdateFormProps,
    MemberOccupationCreateUpdateFormModal,
} from './member-occupation-create-update-form'

export interface IMemberOccupationComboboxCreateProps extends Pick<
    IMemberOccupationCreateUpdateFormProps,
    'defaultValues' | 'disabledFields' | 'hiddenFields'
> {}

interface Props extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'onChange'
> {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    memberOccupationComboboxCreateProps?: IMemberOccupationComboboxCreateProps
    undefinable?: boolean
    onChange?: (selected: IMemberOccupation | undefined) => void
}

const MemberOccupationCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            memberOccupationComboboxCreateProps,
            placeholder = 'Select Member Occupation...',
            onChange,
            undefinable = false,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [createModal, setCreateModal] = React.useState(false)

        const { data, isLoading } = useGetAll({
            options: {
                enabled: !disabled,
            },
        })

        return (
            <>
                <MemberOccupationCreateUpdateFormModal
                    formProps={{
                        ...memberOccupationComboboxCreateProps,
                        onSuccess: (data) => {
                            onChange?.(data)
                            setOpen(false)
                        },
                    }}
                    onOpenChange={setCreateModal}
                    open={createModal}
                />

                <Popover modal onOpenChange={setOpen} open={open}>
                    <PopoverTrigger asChild>
                        <Button
                            {...other}
                            aria-expanded={open}
                            className={cn(
                                'w-full justify-between px-3',
                                className
                            )}
                            disabled={disabled || isLoading}
                            ref={ref}
                            role="combobox"
                            variant="outline"
                        >
                            {value ? (
                                data?.find((x) => x.id === value)?.name
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
                                placeholder="Search Member Occupation..."
                            />

                            {isLoading ? (
                                <CommandEmpty>
                                    <LoadingSpinner className="mr-2 inline-block" />
                                    Loading...
                                </CommandEmpty>
                            ) : (
                                <CommandList className="ecoop-scroll">
                                    <CommandEmpty>
                                        No Member Occupation found.
                                    </CommandEmpty>

                                    {memberOccupationComboboxCreateProps && (
                                        <>
                                            <CommandGroup>
                                                <CommandItem
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onSelect={() =>
                                                        setCreateModal(true)
                                                    }
                                                >
                                                    <PlusIcon /> Create Member
                                                    Occupation
                                                </CommandItem>
                                            </CommandGroup>
                                            <CommandSeparator />
                                        </>
                                    )}

                                    {undefinable && (
                                        <CommandItem
                                            className="justify-center text-muted-foreground"
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(undefined)
                                            }}
                                            value="none"
                                        >
                                            Select None
                                        </CommandItem>
                                    )}

                                    <CommandGroup>
                                        {data?.map((option) => (
                                            <CommandItem
                                                key={option.id}
                                                onSelect={() => {
                                                    setOpen(false)
                                                    onChange?.(option)
                                                }}
                                                value={option.name}
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
)

MemberOccupationCombobox.displayName = 'MemberOccupationCombobox'

export default MemberOccupationCombobox
