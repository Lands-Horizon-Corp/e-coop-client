import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import {
    ICurrency,
    TCurrencyHookMode,
    useGetAllCurrency,
} from '@/modules/currency'
import { CircleFlag } from 'react-circle-flags'

import { findCountry } from '@/components/comboboxes/country-combobox'
import { CheckIcon, ChevronDownIcon } from '@/components/icons'
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

type TFormatDisplay =
    | 'emoji-name-code' // 🇵🇭 Philippine Peso (PHP)
    | 'symbol-name-code' // ₱ Philippine Peso (PHP)
    | 'currency' // Philippine Peso (PHP)
    | 'country-currency' // Philippines - Philippine Peso (PHP)
    | 'country' // Philippines
    | 'country-code' // Philippines (PHP)
    | 'country-symbol' // Philippines (₱)

interface Props {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    mode?: TCurrencyHookMode
    formatDisplay?: TFormatDisplay
    onChange?: (selected: ICurrency) => void
}

const CurrencyCombobox = ({
    value,
    className,
    mode = 'all',
    disabled = false,
    placeholder = 'Select Currency...',
    formatDisplay = 'emoji-name-code',
    onChange,
}: Props) => {
    const [open, setOpen] = React.useState(false)

    const { data, isLoading } = useGetAllCurrency({
        mode,
        options: {
            enabled: !disabled,
        },
    })

    const selectedCurrency = React.useMemo(
        () => data?.find((currency) => currency.id === value),
        [data, value]
    )

    const alpha2 =
        selectedCurrency?.iso_3166_alpha2 ||
        findCountry(selectedCurrency?.country || '')?.alpha2

    const formatCurrencyDisplay = (
        formatMode: TFormatDisplay,
        currency: ICurrency
    ) => {
        switch (formatMode) {
            case 'emoji-name-code':
                return (
                    <div className="flex items-center gap-2 min-w-0">
                        <CircleFlag
                            className={cn(
                                'inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full'
                            )}
                            countryCode={(
                                alpha2?.toLowerCase() || 'US'
                            ).toLowerCase()}
                            height={20}
                        />
                        <span className="truncate">
                            {currency.name} ({currency.currency_code})
                        </span>
                    </div>
                )
            case 'symbol-name-code':
                return (
                    <div className="flex items-center gap-2 min-w-0">
                        {currency.symbol && (
                            <span className="text-lg flex-shrink-0">
                                {currency.symbol}
                            </span>
                        )}
                        <span className="truncate">
                            {currency.name} ({currency.currency_code})
                        </span>
                    </div>
                )
            case 'currency':
                return (
                    <span className="truncate">
                        {currency.name} ({currency.currency_code})
                    </span>
                )
            case 'country-currency':
                return (
                    <span className="truncate">
                        {currency.country} - {currency.name} (
                        {currency.currency_code})
                    </span>
                )
            case 'country':
                return (
                    <div className="flex items-center gap-2 min-w-0">
                        <CircleFlag
                            className={cn(
                                'inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full'
                            )}
                            countryCode={(
                                selectedCurrency?.iso_3166_alpha2 ||
                                findCountry(selectedCurrency?.country || '')
                                    ?.alpha2 ||
                                'US'
                            ).toLowerCase()}
                            height={20}
                        />

                        <p className="truncate">
                            {currency.country}{' '}
                            <span className=" text-xs text-muted-foreground">
                                ({currency.timezone})
                            </span>
                        </p>
                    </div>
                )
            case 'country-code':
                return (
                    <span className="truncate">
                        {currency.country} ({currency.currency_code})
                    </span>
                )
            case 'country-symbol':
                return (
                    <span className="truncate">
                        {currency.country} (
                        {currency.symbol || currency.currency_code})
                    </span>
                )
            default:
                return (
                    <span className="truncate">
                        {currency.name} ({currency.currency_code})
                    </span>
                )
        }
    }

    return (
        <>
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                        role="combobox"
                        variant="outline"
                    >
                        {selectedCurrency ? (
                            formatCurrencyDisplay(
                                formatDisplay,
                                selectedCurrency
                            )
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
                            placeholder="Search Currency..."
                        />
                        {isLoading ? (
                            <CommandEmpty>
                                <LoadingSpinner className="mr-2 inline-block" />{' '}
                                Loading...
                            </CommandEmpty>
                        ) : (
                            <CommandList className="ecoop-scroll">
                                <CommandEmpty>No Currency found.</CommandEmpty>
                                <CommandGroup>
                                    {data?.map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(option)
                                            }}
                                            value={`${option.name} ${option.currency_code} ${option.country}`}
                                        >
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                {(option.iso_3166_alpha2 ||
                                                    option.country) && (
                                                    <CircleFlag
                                                        className={cn(
                                                            'inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full'
                                                        )}
                                                        countryCode={(
                                                            option?.iso_3166_alpha2 ||
                                                            findCountry(
                                                                option?.country ||
                                                                    ''
                                                            )?.alpha2 ||
                                                            'US'
                                                        ).toLowerCase()}
                                                        height={20}
                                                    />
                                                )}
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate font-medium">
                                                        {option.name} (
                                                        {option.currency_code})
                                                    </span>
                                                    <span className="truncate text-xs text-muted-foreground">
                                                        {option.country}
                                                        {option.symbol &&
                                                            ` • ${option.symbol}`}
                                                    </span>
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

export default CurrencyCombobox
