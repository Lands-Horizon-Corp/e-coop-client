import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import { CurrencyCountryFlag } from '@/modules/currency/components/currency-badge'
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
    // CommandSeparator,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { TEntityId } from '@/types'

import { useGetAllChargesRateScheme } from '../charges-rate-scheme.service'
import {
    IChargesRateScheme,
    TChargesRateSchemeHookMode,
} from '../charges-rate-scheme.types'

// import {
//     ChargesRateSchemeCreateUpdateFormModal,
//     TChargesRateSchemeForm,
// } from './forms/charges-rate-scheme-create-update-form'

// export interface IChargesRateSchemeComboboxCreateProps
//     extends Pick<TChargesRateSchemeForm, 'name' | 'description'>
//     {}

interface Props {
    value?: TEntityId
    disabled?: boolean
    className?: string
    placeholder?: string
    mode?: TChargesRateSchemeHookMode
    currencyId?: TEntityId
    // chargesRateSchemeComboboxCreateProps?: IChargesRateSchemeComboboxCreateProps
    onChange?: (selected: IChargesRateScheme) => void
}

type ChargesRateSchemeProps = Props &
    (
        | { mode: 'all' }
        | {
              mode: Exclude<TChargesRateSchemeHookMode, 'all'>
              currencyId: TEntityId
          }
    )

const ChargesRateSchemeCombobox = ({
    value,
    mode = 'all',
    currencyId,
    className,
    disabled = false,
    // chargesRateSchemeComboboxCreateProps,
    placeholder = 'Select Charges Rate Scheme...',
    onChange,
    ...other
}: ChargesRateSchemeProps & { currencyId?: TEntityId }) => {
    const [open, setOpen] = React.useState(false)
    // const [createModal, setCreateModal] = React.useState(false)

    const { data, isLoading } = useGetAllChargesRateScheme({
        mode,
        currencyId,
    })

    const selected = data?.find((option) => option.id === value)

    return (
        <>
            {/* <ChargesRateSchemeCreateUpdateFormModal
                    formProps={{
                        ...chargesRateSchemeComboboxCreateProps,
                        onSuccess: (newScheme) => {
                            onChange?.(newScheme)
                            setCreateModal(false)
                        },
                    }}
                    onOpenChange={setCreateModal}
                    open={createModal}
                /> */}
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        {...other}
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled || isLoading}
                        role="combobox"
                        variant="outline"
                    >
                        {selected ? (
                            <>
                                {selected.currency && (
                                    <CurrencyCountryFlag
                                        currency={selected.currency}
                                    />
                                )}
                                {selected.name}
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
                            placeholder="Search Charges Rate Scheme..."
                        />
                        {isLoading ? (
                            <CommandEmpty>
                                <LoadingSpinner className="mr-2 inline-block" />{' '}
                                Loading...
                            </CommandEmpty>
                        ) : (
                            <CommandList className="ecoop-scroll">
                                <CommandEmpty>
                                    No Charges Rate Scheme found.
                                </CommandEmpty>
                                {/* {chargesRateSchemeComboboxCreateProps && (
                                        <>
                                            <CommandGroup>
                                                <CommandItem
                                                    onClick={() => {}}
                                                    onSelect={() => {
                                                        setCreateModal(true)
                                                    }}
                                                >
                                                    <PlusIcon /> Create new
                                                    scheme
                                                </CommandItem>
                                            </CommandGroup>
                                            <CommandSeparator />
                                        </>
                                    )} */}
                                <CommandGroup>
                                    {data?.map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            onSelect={() => {
                                                setOpen(false)
                                                onChange?.(option)
                                            }}
                                            value={option.name}
                                        >
                                            {option.currency && (
                                                <CurrencyCountryFlag
                                                    currency={option.currency}
                                                />
                                            )}
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

ChargesRateSchemeCombobox.displayName = 'ChargesRateSchemeCombobox'

export default ChargesRateSchemeCombobox
