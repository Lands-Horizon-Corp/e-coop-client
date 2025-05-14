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
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { TEntityId, IMemberType } from '@/types'
import { useMemberTypes } from '@/hooks/api-hooks/member/use-member-type'
import {
    TMemberTypeForm,
    MemberTypeCreateUpdateFormModal,
} from '../forms/member-forms/member-type-create-update-form'

export interface IMemberTypeComboboxCreateProps
    extends Pick<TMemberTypeForm, 'name' | 'prefix' | 'description'> {}

interface Props {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    memberTypeComboboxCreateProps?: IMemberTypeComboboxCreateProps
    onChange?: (selected: IMemberType) => void
}

const MemberTypeCombobox = ({
    value,
    className,
    disabled = false,
    memberTypeComboboxCreateProps,
    placeholder = 'Select Member Type...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)
    const [createModal, setCreateModal] = React.useState(false)

    const { data, isLoading } = useMemberTypes({
        enabled: !disabled,
        showMessage: false,
    })

    return (
        <>
            <MemberTypeCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    ...memberTypeComboboxCreateProps,
                    onSuccess: (newType) => {
                        onChange?.(newType)
                        setCreateModal(false)
                    },
                }}
            />
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
                            placeholder="Search Member Type..."
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
                                    No Member Type found.
                                </CommandEmpty>
                                {memberTypeComboboxCreateProps && (
                                    <>
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => {
                                                    setCreateModal(true)
                                                }}
                                                onClick={() => {}}
                                            >
                                                <PlusIcon /> Create new type
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

export default MemberTypeCombobox
