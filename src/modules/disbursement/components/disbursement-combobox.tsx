import * as React from 'react'

import { cn } from '@/helpers'
import { CurrencyBadge } from '@/modules/currency/components/currency-badge'

import {
    CheckIcon,
    ChevronDownIcon,
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
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { TEntityId } from '@/types'

import { useGetAllDisbursements } from '../disbursement.service'
import { IDisbursement } from '../disbursement.types'
import {
    DisbursementCreateUpdateFormModal,
    IDisbursementFormProps,
} from './forms/disbursement-create-update-form'

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

    const { data = [], isLoading } = useGetAllDisbursements({
        options: {
            enabled: !disabled,
        },
    })

    const selectedDisbursement = React.useMemo(
        () => data.find((disbursement) => disbursement.id === value),
        [data, value]
    )

    return (
        <>
            <DisbursementCreateUpdateFormModal
                formProps={{
                    ...disbursementComboboxCreateProps,
                    onSuccess: (newDisbursement) => {
                        onChange?.(newDisbursement)
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
                        {selectedDisbursement ? (
                            <div className="flex items-center gap-2 min-w-0">
                                {selectedDisbursement && (
                                    <RenderIcon
                                        className="shrink-0"
                                        icon={
                                            selectedDisbursement.icon as TIcon
                                        }
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
                            className="h-9"
                            placeholder="Search Disbursement..."
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
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(option)
                                            }}
                                            value={option.name}
                                        >
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <RenderIcon
                                                    className="shrink-0"
                                                    icon={option.icon as TIcon}
                                                />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate font-medium">
                                                        {option.currency && (
                                                            <CurrencyBadge
                                                                className="mr-1"
                                                                currency={
                                                                    option.currency
                                                                }
                                                                displayFormat="code"
                                                                size="sm"
                                                            />
                                                        )}
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
