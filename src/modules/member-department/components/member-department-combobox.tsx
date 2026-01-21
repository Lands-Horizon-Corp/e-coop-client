import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { Check } from 'lucide-react'

import {
    ChevronDownIcon,
    PlusIcon,
    RenderIcon,
    TIcon,
} from '@/components/icons'
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

import { useGetAll } from '../member-department.service'
import { IMemberDepartment } from '../member-department.types'
import {
    MemberDepartmentCreateUpdateFormModal,
    TMemberDepartmentFormValues,
} from './member-department-create-update-form'

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

        const { data, isLoading } = useGetAll()

        const selectedDepartment = data?.find((option) => option.id === value)

        return (
            <>
                <MemberDepartmentCreateUpdateFormModal
                    formProps={{
                        defaultValues: memberDepartmentComboboxCreateProps,
                        onSuccess: (newDepartment) => {
                            onChange?.(newDepartment)
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
                            {selectedDepartment ? (
                                <div className="flex items-center text-muted-foreground gap-2">
                                    <RenderIcon
                                        className="size-4"
                                        icon={selectedDepartment.icon as TIcon}
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
                                className="h-9"
                                placeholder="Search Member Department..."
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
                                                    onClick={() => {}}
                                                    onSelect={() => {
                                                        setCreateModal(true)
                                                    }}
                                                >
                                                    <PlusIcon /> Create new
                                                    department
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
                                                <div className="flex items-center gap-2">
                                                    <RenderIcon
                                                        className="size-4"
                                                        icon={
                                                            option.icon as TIcon
                                                        }
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
