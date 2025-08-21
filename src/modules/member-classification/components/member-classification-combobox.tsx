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
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { TEntityId } from '@/types'

import { useGetAll } from '../member-classification.service'
import { IMemberClassification } from '../member-classification.types'
import {
    IMemberClassificationCreateUpdateFormProps,
    MemberClassificationCreateUpdateFormModal,
} from './member-classification-create-update-form'

export interface IMemberClassificationComboboxCreateProps
    extends Pick<
        IMemberClassificationCreateUpdateFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface Props
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    memberClassificationCreateProps?: IMemberClassificationComboboxCreateProps
    onChange?: (selected: IMemberClassification) => void
}

const MemberClassificationCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            placeholder = 'Select Member Classification...',
            disabled = false,
            className,
            memberClassificationCreateProps,
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
                <MemberClassificationCreateUpdateFormModal
                    open={createModal}
                    onOpenChange={setCreateModal}
                    formProps={{
                        ...memberClassificationCreateProps,
                        onSuccess: (data) => {
                            onChange?.(data)
                            setOpen(false)
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
                                placeholder="Search Member Classification..."
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
                                        No Member Classification found.
                                    </CommandEmpty>
                                    {memberClassificationCreateProps && (
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
                                                Classification
                                            </CommandItem>
                                        </CommandGroup>
                                    )}
                                    <CommandGroup>
                                        {data?.map((option) => (
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

MemberClassificationCombobox.displayName = 'MemberClassificationCombobox'

export default MemberClassificationCombobox
