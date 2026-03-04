import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { useHotkeys } from 'react-hotkeys-hook'

// Icons & UI Components
import { CheckIcon, ChevronDownIcon, PlusIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button, ButtonProps } from '@/components/ui/button'
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

// Hooks & Types
import { useInternalState } from '@/hooks/use-internal-state'
import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { useGetAllFinancialStatementTitle } from '../financial-statement-title.service'
import { IFinancialStatementTitle } from '../financial-statement-title.types'
import { FinancialStatementTitleCreateUpdateFormModal } from './financial-statement-title-create-update'

// Form Modal (Following your pattern)

interface Props extends Omit<IPickerBaseProps, 'onSelect' | 'value'> {
    value?: TEntityId
    className?: string
    onChange?: (selected: IFinancialStatementTitle) => void
    mainTriggerProps?: ButtonProps
    allowCreate?: boolean
}

const FinancialStatemenTitleCombobox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select FS Definition...',
    onChange,
    modalState,
    shortcutHotKey = 'alt + F',
    allowShortcutHotKey = false,
    mainTriggerProps,
    allowCreate = true,
}: Props) => {
    const [open, setOpen] = useInternalState(
        false,
        modalState?.open,
        modalState?.onOpenChange
    )
    const createModal = useModalState()

    // Data fetching - Replace with your actual module hook
    const { data, isLoading } = useGetAllFinancialStatementTitle({
        options: { enabled: !disabled },
    })

    const selectedDefinition = React.useMemo(
        () => data?.find((item) => item.id === value),
        [data, value]
    )

    useHotkeys(
        shortcutHotKey,
        (event) => {
            event?.preventDefault()
            setOpen(!open)
        },
        {
            enableOnFormTags: true,
            enabled: allowShortcutHotKey && !disabled && !isLoading,
        },
        [open, disabled, isLoading]
    )

    return (
        <>
            <FinancialStatementTitleCreateUpdateFormModal
                {...createModal}
                formProps={
                    {
                        //  onSuccess={(newDoc) => {
                        // onChange?.(newDoc as IFinancialStatementDefinition)
                        // setCreateModal(false)
                    }
                }
            />

            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        {...mainTriggerProps}
                        aria-expanded={open}
                        className={cn(
                            'w-full justify-between px-3 text-left font-normal',
                            className
                        )}
                        disabled={disabled || isLoading}
                        role="combobox"
                        variant="outline"
                    >
                        <span className="truncate">
                            {selectedDefinition
                                ? selectedDefinition.title
                                : placeholder}
                        </span>
                        {isLoading ? (
                            <LoadingSpinner className="size-4 opacity-50" />
                        ) : (
                            <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="w-[--radix-popover-trigger-width] p-0"
                >
                    <Command>
                        <CommandInput placeholder="Search definition..." />
                        <CommandList className="ecoop-scroll max-h-72">
                            <CommandEmpty>No definition found.</CommandEmpty>

                            {allowCreate && (
                                <>
                                    <CommandGroup>
                                        <CommandItem
                                            className="cursor-pointer text-primary"
                                            onSelect={() => {
                                                setOpen(false)
                                                createModal.onOpenChange(true)
                                            }}
                                        >
                                            <PlusIcon className="mr-2 size-4" />
                                            Create new definition
                                        </CommandItem>
                                    </CommandGroup>
                                    <CommandSeparator />
                                </>
                            )}

                            <CommandGroup heading="FS Definitions">
                                {data?.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        onSelect={() => {
                                            onChange?.(item)
                                            setOpen(false)
                                        }}
                                        value={item.title}
                                    >
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="truncate font-medium">
                                                {item.title}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground uppercase">
                                                {item.total_title}
                                            </span>
                                        </div>
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto size-4 shrink-0',
                                                value === item.id
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}

export default FinancialStatemenTitleCombobox
