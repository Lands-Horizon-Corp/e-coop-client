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

import { useGetAll } from '../member-gender.service'
import { IMemberGender } from '../member-gender.types'
import {
    IMemberGenderFormProps,
    MemberGenderCreateUpdateFormModal,
} from './member-gender-create-update-form'

export interface IMemberGenderComboboxCreateProps
    extends Pick<
        IMemberGenderFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface Props
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    memberGenderComboboxCreateProps?: IMemberGenderComboboxCreateProps
    onChange?: (selected: IMemberGender) => void
}

const MemberGenderCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            memberGenderComboboxCreateProps,
            placeholder = 'Select Member Gender...',
            onChange,
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
                <MemberGenderCreateUpdateFormModal
                    formProps={{
                        ...memberGenderComboboxCreateProps,
                        onSuccess: (newGender) => {
                            onChange?.(newGender)
                            setCreateModal(false)
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
                                data?.find((option) => option.id === value)
                                    ?.name
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
                                placeholder="Search Member Gender..."
                            />
                            {isLoading ? (
                                <CommandEmpty>
                                    <LoadingSpinner className="mr-2 inline-block" />{' '}
                                    Loading...
                                </CommandEmpty>
                            ) : (
                                <CommandList className="ecoop-scroll">
                                    <CommandEmpty>
                                        No Member Gender found.
                                    </CommandEmpty>
                                    {memberGenderComboboxCreateProps && (
                                        <>
                                            <CommandGroup>
                                                <CommandItem
                                                    onClick={() => {}}
                                                    onSelect={() => {
                                                        setCreateModal(true)
                                                    }}
                                                >
                                                    <PlusIcon /> Create new
                                                    gender
                                                </CommandItem>
                                            </CommandGroup>
                                            <CommandSeparator />
                                        </>
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

MemberGenderCombobox.displayName = 'MemberGenderCombobox'

export default MemberGenderCombobox
