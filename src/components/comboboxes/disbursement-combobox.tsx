import * as React from 'react'

import { CheckIcon, ChevronDownIcon, RenderIcon } from '@/components/icons'
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

import { cn } from '@/lib/utils'

import { useDisbursements } from '@/hooks/api-hooks/use-disbursement'

import { IDisbursement, TEntityId, TIcon } from '@/types'

import {
    DisbursementCreateUpdateFormModal,
    type IDisbursementFormProps,
} from '../forms/disbursement-create-update-form'

export interface IDisbursementComboboxCreateProps
    extends Pick<IDisbursementFormProps, 'defaultValues' | 'disabledFields'> {}

interface Props {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    disbursementComboboxCreateProps?: IDisbursementComboboxCreateProps
    onChange?: (selected: IDisbursement) => void
}

const DisbursementCombobox = ({
    value,
    className,
    disabled = false,
    disbursementComboboxCreateProps,
    placeholder = 'Select Disbursement...',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)
    const [createModal, setCreateModal] = React.useState(false)

    const { data, isLoading } = useDisbursements({
        enabled: !disabled,
        showMessage: false,
    })

    const selectedDisbursement = React.useMemo(
        () => data.find((disbursement) => disbursement.id === value),
        [data, value]
    )

    return (
        <>
            <DisbursementCreateUpdateFormModal
                open={createModal}
                onOpenChange={setCreateModal}
                formProps={{
                    ...disbursementComboboxCreateProps,
                    onSuccess: (newDisbursement) => {
                        onChange?.(newDisbursement)
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
                        {selectedDisbursement ? (
                            <div className="flex items-center gap-2 min-w-0">
                                {selectedDisbursement && (
                                    <RenderIcon
                                        icon={
                                            selectedDisbursement.icon as TIcon
                                        }
                                        className="shrink-0"
                                    />
                                )}
                                <span className="truncate">
                                    {selectedDisbursement.name}
                                </span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                        <ChevronDownIcon className="opacity-50 flex-shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search Disbursement..."
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
                                    No Disbursement found.
                                </CommandEmpty>
                                {/* TODO: Once role is set */}
                                {/* {disbursementComboboxCreateProps && (
                                    <>
                                        <CommandGroup>
                                            <CommandItem
                                                onSelect={() => {
                                                    setCreateModal(true)
                                                }}
                                                onClick={() => {}}
                                            >
                                                <PlusIcon /> Create new disbursement
                                            </CommandItem>
                                        </CommandGroup>
                                        <CommandSeparator />
                                    </>
                                )} */}
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
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full border bg-muted flex-shrink-0">
                                                    {option.icon ? (
                                                        <span className="text-sm">
                                                            {option.icon}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            {option.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                'D'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate font-medium">
                                                        {option.name}
                                                    </span>
                                                    {option.description && (
                                                        <span className="truncate text-xs text-muted-foreground">
                                                            {option.description}
                                                        </span>
                                                    )}
                                                </div>
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

export default DisbursementCombobox
