import React, { useEffect } from 'react'

import { cn } from '@/helpers'

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
            className={cn(
                '!h-fit max-w-[90vw] !gap-y-0 border p-0 shadow-none backdrop-blur-none sm:max-w-2xl',
                className
            )}
            closeButtonClassName="hidden"
            descriptionClassName="!hidden"
            onOpenChange={setModalState}
            open={modalState}
            titleClassName="!hidden"
        >
            <Command
                className={cn('bg-none', commandClassName)}
                shouldFilter={false}
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
                        <GenericPickerInputSearch
                            onChange={onSearchChange}
                            placeHolder={searchPlaceHolder}
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
                                    className="cursor-pointer rounded-lg"
                                    key={item.id}
                                    onSelect={() => {
                                        onSelect?.(item)
                                        setModalState(false)
                                    }}
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

const GenericPickerInputSearch = ({
    placeHolder = 'Search...',
    defaultValue = '',
    onChange,
}: {
    defaultValue?: string
    placeHolder?: string
    onChange?: (value: string) => void
}) => {
    const [searchValue, setSearchValue] = React.useState(defaultValue)

    useEffect(() => {
        const interval = setTimeout(() => {
            onChange?.(searchValue)
        }, 500)

        return () => {
            clearTimeout(interval)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue])

    return (
        <Input
            className="flex h-11 w-full  focus-visible:ring-0 px-0 border-0 !bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={placeHolder ?? 'Search anything...'}
        />
    )
}

export default GenericPicker
