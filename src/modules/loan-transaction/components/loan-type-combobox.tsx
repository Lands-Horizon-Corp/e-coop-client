import * as React from 'react'

import { cn } from '@/helpers'
import { Check } from 'lucide-react'

import { ChevronDownIcon } from '@/components/icons'
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

import { TLoanType } from '../loan-transaction.types'
import { LOAN_TYPE } from '../loan.constants'

interface Props {
    id?: string
    name?: string
    value?: TLoanType
    disabled?: boolean
    className?: string
    placeholder?: string
    loanTypes?: TLoanType[]
    onChange?: (selected: TLoanType) => void
}

const loanTypeDisplayNames: Record<TLoanType, string> = {
    standard: 'Standard',
    restructured: 'Restructured',
    'standard previous': 'Standard (Previous)',
    renewal: 'Renewal (with Deductions)',
    'renewal without deduction': 'Renewal (without Deductions)',
}

const LoanTypeCombobox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select Loan Type...',
    onChange,
    ...other
}: Props) => {
    const [open, setOpen] = React.useState(false)

    const displayValue = value ? loanTypeDisplayNames[value] : null

    return (
        <Popover modal onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    {...other}
                    aria-expanded={open}
                    className={cn('w-full justify-between px-3', className)}
                    disabled={disabled}
                    role="combobox"
                    type="button"
                    variant="outline"
                >
                    <span>
                        {displayValue || (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                    </span>
                    <ChevronDownIcon className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput
                        className="h-9"
                        placeholder="Search Loan Type..."
                    />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No loan types found.</CommandEmpty>
                        <CommandGroup>
                            {LOAN_TYPE.map((loanType) => (
                                <CommandItem
                                    key={loanType}
                                    onSelect={() => {
                                        setOpen(false)
                                        onChange?.(loanType)
                                    }}
                                    value={loanType}
                                >
                                    <span>
                                        {loanTypeDisplayNames[loanType]}
                                    </span>
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === loanType
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
    )
}

export default LoanTypeCombobox
