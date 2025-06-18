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
    CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, PlusIcon } from '@/components/icons'
import {
    IMemberGenderFormProps,
    MemberGenderCreateUpdateFormModal,
} from '../forms/member-forms/member-gender-create-update-form'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { useGenders } from '@/hooks/api-hooks/member/use-member-gender'

import { TEntityId, IMemberGender } from '@/types'

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

        const { data, isLoading } = useGenders({
            enabled: !disabled,
            showMessage: false,
        })

        return (
            <>
                <MemberGenderCreateUpdateFormModal
                    open={createModal}
                    onOpenChange={setCreateModal}
                    formProps={{
                        ...memberGenderComboboxCreateProps,
                        onSuccess: (newGender) => {
                            onChange?.(newGender)
                            setCreateModal(false)
                        },
                    }}
                />
                <Popover modal open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            {...other}
                            ref={ref}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                                'w-full justify-between px-3',
                                className
                            )}
                            disabled={disabled || isLoading}
                        >
                            {value ? (
                                data.find((option) => option.id === value)?.name
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
                                placeholder="Search Member Gender..."
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
                                        No Member Gender found.
                                    </CommandEmpty>
                                    {memberGenderComboboxCreateProps && (
                                        <>
                                            <CommandGroup>
                                                <CommandItem
                                                    onSelect={() => {
                                                        setCreateModal(true)
                                                    }}
                                                    onClick={() => {}}
                                                >
                                                    <PlusIcon /> Create new
                                                    gender
                                                </CommandItem>
                                            </CommandGroup>
                                            <CommandSeparator />
                                        </>
                                    )}
                                    <CommandGroup>
                                        {data.map((option) => (
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
)

MemberGenderCombobox.displayName = 'MemberGenderCombobox'

export default MemberGenderCombobox
