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
                    formProps={{
                        ...loanPurposeComboboxCreateProps,
                        onSuccess: (newLoanPurpose) => {
                            onChange?.(newLoanPurpose)
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
                            {selectedOption ? (
                                <>
                                    {selectedOption.icon && (
                                        <RenderIcon
                                            className="inline mr-1"
                                            icon={selectedOption.icon as TIcon}
                                        />
                                    )}
                                    {selectedOption.description}
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
                                placeholder="Search Loan Purpose..."
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
                                                    onClick={() => {}}
                                                    onSelect={() => {
                                                        setCreateModal(true)
                                                    }}
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
