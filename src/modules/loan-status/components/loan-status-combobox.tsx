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

import { useGetAllLoanStatus } from '../loan-status.service'
import { ILoanStatus } from '../loan-status.types'
import {
    ILoanStatusFormProps,
    LoanStatusCreateUpdateFormModal,
} from './forms/loan-status-create-update-form'

export interface ILoanStatusComboboxCreateProps
    extends Pick<
        ILoanStatusFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface Props
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    loanStatusComboboxCreateProps?: ILoanStatusComboboxCreateProps
    onChange?: (selected: ILoanStatus) => void
}

const LoanStatusCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            loanStatusComboboxCreateProps,
            placeholder = 'Select Loan Status...',
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [createModal, setCreateModal] = React.useState(false)

        const { data, isLoading } = useGetAllLoanStatus({
            options: {
                enabled: !disabled,
            },
        })

        const selectedOption = value
            ? data?.find((option) => option.id === value)
            : undefined

        return (
            <>
                <LoanStatusCreateUpdateFormModal
                    formProps={{
                        ...loanStatusComboboxCreateProps,
                        onSuccess: (newLoanStatus) => {
                            onChange?.(newLoanStatus)
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
                            tabIndex={0}
                            variant="outline"
                        >
                            {selectedOption ? (
                                <>
                                    {selectedOption.icon && (
                                        <RenderIcon
                                            className="inline mr-1"
                                            icon={selectedOption.icon as TIcon}
                                            style={{
                                                color: selectedOption.color,
                                            }}
                                        />
                                    )}
                                    {selectedOption.name}
                                </>
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
                                placeholder="Search Loan Status..."
                            />
                            {isLoading ? (
                                <CommandEmpty>
                                    <LoadingSpinner className="mr-2 inline-block" />{' '}
                                    Loading...
                                </CommandEmpty>
                            ) : (
                                <CommandList className="ecoop-scroll">
                                    <CommandEmpty>
                                        No Loan Status found.
                                    </CommandEmpty>
                                    {loanStatusComboboxCreateProps && (
                                        <>
                                            <CommandGroup>
                                                <CommandItem
                                                    onClick={() => {}}
                                                    onSelect={() => {
                                                        setCreateModal(true)
                                                    }}
                                                >
                                                    <PlusIcon /> Create new loan
                                                    status
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
                                                value={option.id}
                                            >
                                                <span className="flex items-center">
                                                    <RenderIcon
                                                        className="inline mr-1.5"
                                                        icon={
                                                            option.icon as TIcon
                                                        }
                                                        style={{
                                                            color: option.color,
                                                        }}
                                                    />
                                                    <span>{option.name}</span>
                                                </span>
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

LoanStatusCombobox.displayName = 'LoanStatusCombobox'

export default LoanStatusCombobox
