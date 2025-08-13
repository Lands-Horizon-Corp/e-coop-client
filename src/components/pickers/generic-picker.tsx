import React from 'react'

import { cn } from '@/lib'

import { MagnifyingGlassIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'

import { useInternalState } from '@/hooks/use-internal-state'

import { TEntityId } from '@/types'

interface GenericPickerProps<T extends { id: TEntityId }> extends IModalProps {
    items: T[]
    isLoading?: boolean
    listHeading?: string
    commandClassName?: string
    searchPlaceHolder?: string

    customCommands?: React.ReactNode
    customSearchComponent?: React.ReactNode
    otherSearchInputChild?: React.ReactNode

    onSelect?: (item: T) => void
    onSearchChange: (val: string) => void
    renderItem: (item: T) => React.ReactNode
}

const GenericPicker = <T extends { id: TEntityId }>({
    open,
    items,
    children,
    isLoading,
    className,
    listHeading,
    customCommands,
    commandClassName,
    searchPlaceHolder,
    otherSearchInputChild,
    customSearchComponent,
    onSelect,
    renderItem,
    onOpenChange,
    onSearchChange,
    ...other
}: GenericPickerProps<T>) => {
    const [modalState, setModalState] = useInternalState(
        false,
        open,
        onOpenChange
    )

    return (
        <Modal
            {...other}
            open={modalState}
            onOpenChange={setModalState}
            titleClassName="!hidden"
            closeButtonClassName="hidden"
            descriptionClassName="!hidden"
            className={cn(
                '!h-fit max-w-[90vw] !gap-y-0 border p-0 shadow-none backdrop-blur-none sm:max-w-2xl',
                className
            )}
        >
            <Command
                shouldFilter={false}
                className={cn('bg-none', commandClassName)}
            >
                {customSearchComponent ? (
                    customSearchComponent
                ) : (
                    // <CommandInput
                    //     onValueChange={onSearchChange}
                    //     placeholder={searchPlaceHolder ?? 'Search anything...'}
                    // />
                    <div className="relative flex items-center border-b px-3">
                        <MagnifyingGlassIcon className="mr-2 size-4 shrink-0 opacity-50" />
                        <Input
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={
                                searchPlaceHolder ?? 'Search anything...'
                            }
                            className="flex h-11 w-full focus-visible:ring-0 px-0 border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {otherSearchInputChild}
                    </div>
                )}
                <CommandList className="ecoop-scroll max-h-[300px] min-h-[400px] px-1">
                    <CommandEmpty className="text-sm text-foreground/50">
                        {isLoading ? (
                            <LoadingSpinner className="inline" />
                        ) : (
                            'No Result'
                        )}
                    </CommandEmpty>
                    {customCommands}
                    {items.length > 0 && (
                        <CommandGroup heading={listHeading}>
                            {items?.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    onSelect={() => {
                                        onSelect?.(item)
                                        setModalState(false)
                                    }}
                                    className="cursor-pointer rounded-lg"
                                >
                                    {renderItem(item)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>
            {children}
        </Modal>
    )
}

export default GenericPicker
