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

import { useGetAllLoanPurpose } from '../loan-purpose.service'
import { ILoanPurpose } from '../loan-purpose.types'
import {
    ILoanPurposeFormProps,
    LoanPurposeCreateUpdateFormModal,
} from './forms/loan-purpose-create-update-form'

export interface ILoanPurposeComboboxCreateProps
    extends Pick<
        ILoanPurposeFormProps,
        'defaultValues' | 'disabledFields' | 'hiddenFields'
    > {}

interface Props
    extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    loanPurposeComboboxCreateProps?: ILoanPurposeComboboxCreateProps
    onChange?: (selected: ILoanPurpose) => void
}

const LoanPurposeCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            loanPurposeComboboxCreateProps,
            placeholder = 'Select Loan Purpose...',
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [createModal, setCreateModal] = React.useState(false)

        const { data, isLoading } = useGetAllLoanPurpose({
            options: {
                enabled: !disabled,
            },
        })

        // Extract selected option to const
        const selectedOption = value
            ? data?.find((option) => option.id === value)
            : undefined

        return (
            <>
                <LoanPurposeCreateUpdateFormModal
                    open={createModal}
                    onOpenChange={setCreateModal}
                    formProps={{
                        ...loanPurposeComboboxCreateProps,
                        onSuccess: (newLoanPurpose) => {
                            onChange?.(newLoanPurpose)
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
                            {selectedOption ? (
                                selectedOption.description
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
                                placeholder="Search Loan Purpose..."
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
                                        No Loan Purpose found.
                                    </CommandEmpty>
                                    {loanPurposeComboboxCreateProps && (
                                        <>
                                            <CommandGroup>
                                                <CommandItem
                                                    onSelect={() => {
                                                        setCreateModal(true)
                                                    }}
                                                    onClick={() => {}}
                                                >
                                                    <PlusIcon /> Create new loan
                                                    purpose
                                                </CommandItem>
                                            </CommandGroup>
                                            <CommandSeparator />
                                        </>
                                    )}
                                    <CommandGroup>
                                        {data?.map((option) => (
                                            <CommandItem
                                                key={option.id}
                                                value={option.id}
                                                onSelect={() => {
                                                    setOpen(false)
                                                    onChange?.(option)
                                                }}
                                            >
                                                <span>
                                                    <RenderIcon
                                                        icon={
                                                            option.icon as TIcon
                                                        }
                                                    />
                                                    <span>
                                                        {option.description}
                                                    </span>
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

LoanPurposeCombobox.displayName = 'LoanPurposeCombobox'

export default LoanPurposeCombobox
