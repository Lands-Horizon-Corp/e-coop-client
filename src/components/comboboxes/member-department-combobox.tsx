import * as React from 'react'

import { Check } from 'lucide-react'

import { ChevronDownIcon, PlusIcon, RenderIcon } from '@/components/icons'
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

import { cn } from '@/lib/utils'

import { useMemberDepartments } from '@/hooks/api-hooks/member/use-member-department'

import { IMemberDepartment, TEntityId, TIcon } from '@/types'

import {
    MemberDepartmentCreateUpdateFormModal,
    TMemberDepartmentFormValues,
} from '../forms/member-forms/member-department-create-update-form'

export interface IMemberDepartmentComboboxCreateProps
    extends Pick<
        TMemberDepartmentFormValues,
        'name' | 'description' | 'icon'
    > {}

interface Props
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    memberDepartmentComboboxCreateProps?: IMemberDepartmentComboboxCreateProps
    onChange?: (selected: IMemberDepartment) => void
}

const MemberDepartmentCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            memberDepartmentComboboxCreateProps,
            placeholder = 'Select Member Department...',
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [createModal, setCreateModal] = React.useState(false)

        const { data, isLoading } = useMemberDepartments()

        const selectedDepartment = data.find((option) => option.id === value)

        return (
            <>
                <MemberDepartmentCreateUpdateFormModal
                    open={createModal}
                    onOpenChange={setCreateModal}
                    formProps={{
                        defaultValues: memberDepartmentComboboxCreateProps,
                        onSuccess: (newDepartment) => {
                            onChange?.(newDepartment)
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
                            {selectedDepartment ? (
                                <div className="flex items-center text-muted-foreground gap-2">
                                    <RenderIcon
                                        icon={selectedDepartment.icon as TIcon}
                                        className="size-4"
                                    />
                                    {selectedDepartment.name}
                                </div>
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
                                placeholder="Search Member Department..."
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
                                        No Member Department found.
                                    </CommandEmpty>
                                    {memberDepartmentComboboxCreateProps && (
                                        <>
                                            <CommandGroup>
                                                <CommandItem
                                                    onSelect={() => {
                                                        setCreateModal(true)
                                                    }}
                                                    onClick={() => {}}
                                                >
                                                    <PlusIcon /> Create new
                                                    department
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
                                                <div className="flex items-center gap-2">
                                                    <RenderIcon
                                                        icon={
                                                            option.icon as TIcon
                                                        }
                                                        className="size-4"
                                                    />
                                                    {option.name}
                                                </div>
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

MemberDepartmentCombobox.displayName = 'MemberDepartmentCombobox'

export default MemberDepartmentCombobox
