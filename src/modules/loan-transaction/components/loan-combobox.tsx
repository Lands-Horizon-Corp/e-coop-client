import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { currencyFormat } from '@/modules/currency'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { Check } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

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

import { TAPIQueryOptions, TEntityId } from '@/types'

import {
    TLoanTransactionHookModeGetAll,
    useGetAllLoanTransaction,
} from '../loan-transaction.service'
import { ILoanTransaction } from '../loan-transaction.types'

interface Props
    extends
        Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'>,
        Omit<
            IPickerBaseProps<ILoanTransaction | undefined>,
            'value' | 'onSelect'
        > {
    value?: TEntityId
    className?: string
    undefinable?: boolean
    mode?: TLoanTransactionHookModeGetAll
    loanTransactionId?: TEntityId
    memberProfileId?: TEntityId
    loanAccountId?: TEntityId
    query?: TAPIQueryOptions

    onChange?: (selected: ILoanTransaction | undefined) => void
}

const LoanTransactionCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            undefinable = true,
            mode = 'branch',
            memberProfileId,
            loanAccountId,
            query,
            placeholder = 'Select Loan Transaction...',
            onChange,
            modalState,
            shortcutHotKey = 'alt + t',
            allowShortcutHotKey,
            ...other
        },
        ref
    ) => {
        const [state, setState] = useInternalState(
            false,
            modalState?.open,
            modalState?.onOpenChange
        )
        const { data, isLoading } = useGetAllLoanTransaction({
            mode,
            memberProfileId,
            loanAccountId,
            query,
            options: {
                enabled:
                    (loanAccountId !== undefined &&
                        memberProfileId !== undefined) ||
                    !disabled,
            },
        })

        useHotkeys(
            shortcutHotKey,
            (event) => {
                event?.preventDefault()
                setState(!state)
            },
            {
                enableOnFormTags: true,
                enabled: allowShortcutHotKey && !disabled && !isLoading,
            },
            [value, disabled, isLoading, allowShortcutHotKey, state]
        )

        return (
            <Popover onOpenChange={setState} open={state}>
                <PopoverTrigger asChild>
                    <Button
                        {...other}
                        aria-expanded={state}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                        ref={ref}
                        role="combobox"
                        variant="outline"
                    >
                        {value ? (
                            data?.find((option) => option.id === value)
                                ?.official_receipt_number ||
                            data?.find((option) => option.id === value)
                                ?.voucher ||
                            `Loan #${value}`
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
                            placeholder="Search Loan Transaction..."
                        />
                        {isLoading ? (
                            <CommandEmpty>
                                <LoadingSpinner className="mr-2 inline-block" />{' '}
                                Loading...
                            </CommandEmpty>
                        ) : (
                            <CommandList className="ecoop-scroll">
                                <CommandEmpty>
                                    No Loan Transaction found.
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
                                    {data?.map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            onSelect={() => {
                                                setState(false)
                                                onChange?.(option)
                                            }}
                                            value={
                                                option.official_receipt_number ||
                                                option.voucher ||
                                                option.id
                                            }
                                        >
                                            <div className="flex flex-col">
                                                <span>
                                                    {option.official_receipt_number ||
                                                        option.voucher ||
                                                        `Loan #${option.id}`}
                                                </span>
                                                {option.member_profile && (
                                                    <>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                option
                                                                    .member_profile
                                                                    .first_name
                                                            }{' '}
                                                            {
                                                                option
                                                                    .member_profile
                                                                    .last_name
                                                            }
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            <span className="mr-1">
                                                                Balance:
                                                            </span>
                                                            {currencyFormat(
                                                                option.balance,
                                                                {
                                                                    currency:
                                                                        option
                                                                            .account
                                                                            ?.currency,
                                                                    showSymbol:
                                                                        !!option
                                                                            .account
                                                                            ?.currency,
                                                                }
                                                            )}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
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
        )
    }
)

LoanTransactionCombobox.displayName = 'LoanTransactionCombobox'

export default LoanTransactionCombobox
