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

import { TLoanModeOfPayment } from '../loan-transaction.types'
import { LOAN_MODE_OF_PAYMENT } from '../loan.constants'

interface Props {
    id?: string
    name?: string
    value?: TLoanModeOfPayment
    disabled?: boolean
    className?: string
    placeholder?: string
    onChange?: (selected: TLoanModeOfPayment) => void
}

const modeOfPaymentDisplayNames: Record<TLoanModeOfPayment, string> = {
    day: 'Day',
    daily: 'Daily',
    weekly: 'Weekly',
    'semi-monthly': 'Semi-Monthly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    'semi-annual': 'Semi-Annual',
    lumpsum: 'Lumpsum',
}

const modeOfPayments = LOAN_MODE_OF_PAYMENT

const LoanModeOfPaymentCombobox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select Mode of Payment...',
    onChange,
    ...other
}: Props) => {
    const [open, setOpen] = React.useState(false)

    const displayValue = value ? modeOfPaymentDisplayNames[value] : null

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
                        placeholder="Search Mode of Payment..."
                    />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No mode of payment found.</CommandEmpty>
                        <CommandGroup>
                            {modeOfPayments.map((mode) => (
                                <CommandItem
                                    key={mode}
                                    onSelect={() => {
                                        setOpen(false)
                                        onChange?.(mode)
                                    }}
                                    value={mode}
                                >
                                    <span>
                                        {modeOfPaymentDisplayNames[mode]}
                                    </span>
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === mode
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

export default LoanModeOfPaymentCombobox
