import * as React from 'react'

import { cn } from '@/helpers/tw-utils'

import { CheckIcon, ChevronDownIcon } from '@/components/icons'
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

import { useGetAllComputationSheet } from '..'
import { IComputationSheet } from '../computation-sheet.types'
import {
    ComputationSheetCreateUpdateFormModal,
    IComputationSheetFormProps,
} from './forms/computation-sheet-create-update-form'

export interface IComputationSheetCreateProps
    extends Pick<
        IComputationSheetFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface Props {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    computationSheetComboboxCreateProps?: IComputationSheetCreateProps
    onChange?: (selected: IComputationSheet) => void
}

const ComputationSheetCombobox = ({
    value,
    className,
    disabled = false,
    computationSheetComboboxCreateProps,
    placeholder = 'Select Computation Sheet/Scheme...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)
    const [createModal, setCreateModal] = React.useState(false)

    const { data, isLoading } = useGetAllComputationSheet({
        options: {
            enabled: !disabled,
        },
    })

    const selectedComputationSheet = React.useMemo(
        () => data?.find((computationSheet) => computationSheet.id === value),
        [data, value]
    )

    return (
        <>
            <ComputationSheetCreateUpdateFormModal
                formProps={{
                    ...computationSheetComboboxCreateProps,
                    onSuccess: (newComputationSheet) => {
                        onChange?.(newComputationSheet)
                        setCreateModal(false)
                    },
                }}
                onOpenChange={setCreateModal}
                open={createModal}
            />
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                        role="combobox"
                        variant="outline"
                    >
                        {selectedComputationSheet ? (
                            <div className="flex items-center gap-2 w-[50%] min-w-0">
                                <span className="truncate">
                                    {selectedComputationSheet.name}
                                </span>
                            </div>
                        ) : (
                            <span className="truncate text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                        <ChevronDownIcon className="opacity-50 flex-shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            className="h-9"
                            placeholder="Search Bank..."
                        />
                        {isLoading ? (
                            <CommandEmpty>
                                <LoadingSpinner className="mr-2 inline-block" />{' '}
                                Loading...
                            </CommandEmpty>
                        ) : (
                            <CommandList className="ecoop-scroll">
                                <CommandEmpty>No Bank found.</CommandEmpty>
                                {/* TODO: Once role is set */}
                                {/* {bankComboboxCreateProps && (
                                    <>
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => {
                                                    setCreateModal(true)
                                                }}
                                                onClick={() => {}}
                                            >
                                                <PlusIcon /> Create new bank
                                            </CommandItem>
                                        </CommandGroup>
                                        <CommandSeparator />
                                    </>
                                )} */}
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
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <span className="truncate">
                                                    {option.name}
                                                </span>
                                            </div>
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto flex-shrink-0',
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

export default ComputationSheetCombobox
