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

import { TEntityId, IMemberGroup } from '@/types'
import { useMemberGroups } from '@/hooks/api-hooks/member/use-member-group'
import {
    IMemberGroupFormProps,
    MemberGroupCreateUpdateFormModal,
} from '../forms/member-forms/member-group-create-update-form'

export interface IMemberGroupComboboxCreateProps
    extends Pick<
        IMemberGroupFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface Props {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    memberGroupComboboxCreateProps?: IMemberGroupComboboxCreateProps
    onChange?: (selected: IMemberGroup) => void
}

const MemberGroupCombobox = ({
    value,
    className,
    disabled = false,
    memberGroupComboboxCreateProps,
    placeholder = 'Select Member Group...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)
    const [createModal, setCreateModal] = React.useState(false)

    const { data, isLoading } = useMemberGroups({
        enabled: !disabled,
        showMessage: false,
    })

    return (
        <>
            <MemberGroupCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    ...memberGroupComboboxCreateProps,
                    onSuccess: (newGroup) => {
                        onChange?.(newGroup)
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
                            placeholder="Search Member Group..."
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
                                    No Member Group found.
                                </CommandEmpty>
                                {memberGroupComboboxCreateProps && (
                                    <>
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => {
                                                    setCreateModal(true)
                                                }}
                                                onClick={() => {}}
                                            >
                                                <PlusIcon /> Create new group
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

export default MemberGroupCombobox
