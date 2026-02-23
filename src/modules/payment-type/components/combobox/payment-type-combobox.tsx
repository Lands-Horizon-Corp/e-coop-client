import { cn } from '@/helpers'
import { IPaymentType, useGetAllPaymentType } from '@/modules/payment-type'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { Check } from 'lucide-react'

import { ChevronDownIcon } from '@/components/icons'
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

import { useInternalState } from '@/hooks/use-internal-state'

import { TEntityId } from '@/types'

interface Props extends IPickerBaseProps {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    undefinable?: boolean
    onChange?: (selected: IPaymentType | undefined) => void
}

const PaymentTypeCombobox = ({
    value,
    className,
    disabled = false,
    undefinable = true,
    placeholder = 'Select Payment Type...',
    onChange,
    modalState,
}: Props) => {
    const [state, setState] = useInternalState(
        false,
        modalState?.open,
        modalState?.onOpenChange
    )

    // Using the provided hook
    const { data: paymentTypes, isLoading } = useGetAllPaymentType()

    const selected = paymentTypes?.find((option) => option.id === value)

    return (
        <>
            <Popover modal onOpenChange={setState} open={state}>
                <PopoverTrigger asChild>
                    <Button
                        // aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                        role="combobox"
                        tabIndex={0}
                        variant="outline"
                    >
                        {value ? (
                            selected?.name
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
                            placeholder="Search Payment Type..."
                        />
                        {isLoading ? (
                            <CommandEmpty>
                                <LoadingSpinner className="mr-2 inline-block" />{' '}
                                Loading...
                            </CommandEmpty>
                        ) : (
                            <CommandList className="ecoop-scroll">
                                <CommandEmpty>
                                    No Payment Type found
                                </CommandEmpty>
                                <CommandGroup>
                                    {undefinable && (
                                        <CommandItem
                                            className="justify-center text-muted-foreground"
                                            onSelect={() => {
                                                setState(false)
                                                onChange?.(undefined)
                                            }}
                                            value={undefined}
                                        >
                                            Select None
                                        </CommandItem>
                                    )}
                                    {paymentTypes?.map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            onSelect={() => {
                                                setState(false)
                                                onChange?.(option)
                                            }}
                                            value={option.name}
                                        >
                                            {option.name}
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

export default PaymentTypeCombobox
