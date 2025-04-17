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
import { ChevronDownIcon, PlusIcon } from '../icons'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { MemberEducationalAttainmentCreateUpdateFormModal } from '../forms/member-forms/member-educational-attainment-create-update-form'

import { TEntityId, IMemberEducationalAttainmentResource } from '@/server/types'
import { useFilteredPaginatedMemberEducationalAttainments } from '@/hooks/api-hooks/member/use-member-educational-attainment'
import { IMemberEducationalAttainmentCreateUpdateFormProps } from '../forms/member-forms/member-educational-attainment-create-update-form'

export interface IMemberEducationalAttainmentComboboxCreateProps
    extends Pick<
        IMemberEducationalAttainmentCreateUpdateFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface Props {
    value?: TEntityId
    placeholder?: string
    disabled?: boolean
    educationalAttainmentComboboxCreateProps?: IMemberEducationalAttainmentComboboxCreateProps
    onChange?: (selected: IMemberEducationalAttainmentResource) => void
    className?: string
}

const MemberEducationalAttainmentCombobox = ({
    value,
    className,
    disabled = false,
    educationalAttainmentComboboxCreateProps,
    placeholder = 'Select Educational Attainment...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)
    const [createModal, setCreateModal] = React.useState(false)

    const {
        data: { data },
        isLoading,
    } = useFilteredPaginatedMemberEducationalAttainments({
        filterPayload: {},
        pagination: { pageIndex: 0, pageSize: 100 },
        enabled: !disabled,
        showMessage: false,
    })

    return (
        <>
            <MemberEducationalAttainmentCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    ...educationalAttainmentComboboxCreateProps,
                    onSuccess: (newEducationalAttainment) => {
                        onChange?.(newEducationalAttainment)
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
                        {value
                            ? data.find((option) => option.id === value)?.name
                            : placeholder}
                        <ChevronDownIcon className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search Educational Attainment..."
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
                                    No Educational Attainment found.
                                </CommandEmpty>
                                {educationalAttainmentComboboxCreateProps && (
                                    <>
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => {
                                                    setCreateModal(true)
                                                }}
                                                onClick={() => {}}
                                            >
                                                <PlusIcon /> Create
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

export default MemberEducationalAttainmentCombobox
