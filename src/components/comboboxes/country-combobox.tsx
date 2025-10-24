import React, {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers/tw-utils'
import { countries } from 'country-data-list'
import { CircleFlag } from 'react-circle-flags'

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

import { ArrowChevronDown, CheckIcon, GlobeIcon } from '../icons'

export interface Country {
    alpha2: string
    alpha3: string
    countryCallingCodes: string[]
    currencies: string[]
    emoji?: string
    ioc: string
    languages: string[]
    name: string
    status: string
}

// Filtered country list (excluding deleted and PRK)
export const availableCountries = countries.all.filter(
    (country: Country) =>
        country.emoji && country.status !== 'deleted' && country.ioc !== 'PRK'
)

// Initialize Fuse.js instance for country search
const countryFuse = new Fuse(availableCountries, {
    keys: [
        { name: 'name', weight: 3 },
        { name: 'alpha2', weight: 2 },
        { name: 'alpha3', weight: 2 },
    ],
    threshold: 0.3,
    includeScore: true,
    shouldSort: true,
})

/**
 * Search for countries using fuzzy search
 * @param query - Search query (country name, alpha2, or alpha3 code)
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Array of matching countries
 */
export const searchCountries = (
    query: string,
    limit: number = 10
): Country[] => {
    if (!query.trim()) {
        return availableCountries.slice(0, limit)
    }

    const results = countryFuse.search(query, { limit })
    return results.map((result) => result.item)
}

/**
 * Find a single country by exact or fuzzy match
 * @param query - Search query (country name, alpha2, or alpha3 code)
 * @returns Matching country or undefined
 */
export const findCountry = (query: string): Country | undefined => {
    if (!query.trim()) {
        return undefined
    }

    // Try exact match first
    const exactMatch = availableCountries.find(
        (country) =>
            country.name.toLowerCase() === query.toLowerCase() ||
            country.alpha2.toLowerCase() === query.toLowerCase() ||
            country.alpha3.toLowerCase() === query.toLowerCase()
    )

    if (exactMatch) {
        return exactMatch
    }

    // Fall back to fuzzy search
    const results = countryFuse.search(query, { limit: 1 })
    return results[0]?.item
}

interface CountryDropdownProps {
    options?: Country[]
    onChange?: (country: Country) => void
    defaultValue?: string
    disabled?: boolean
    placeholder?: string
    slim?: boolean
}

const CountryComboboxComponent = (
    {
        options = availableCountries,
        onChange,
        defaultValue,
        disabled = false,
        placeholder = 'Select a country',
        slim = false,
        ...props
    }: CountryDropdownProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) => {
    const [open, setOpen] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
        undefined
    )
    const [searchQuery, setSearchQuery] = useState('')

    // Memoize filtered countries based on search
    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) {
            return options
        }
        return searchCountries(searchQuery, 50).filter((country) =>
            options.some((opt) => opt.alpha2 === country.alpha2)
        )
    }, [searchQuery, options])

    useEffect(() => {
        if (defaultValue) {
            const initialCountry = findCountry(defaultValue)
            setSelectedCountry(initialCountry)
        } else {
            setSelectedCountry(undefined)
        }
    }, [defaultValue])

    const handleSelect = useCallback(
        (country: Country) => {
            setSelectedCountry(country)
            onChange?.(country)
            setOpen(false)
            setSearchQuery('')
        },
        [onChange]
    )

    const triggerClasses = cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        slim === true && 'w-20'
    )

    return (
        <Popover modal onOpenChange={setOpen} open={open}>
            <PopoverTrigger
                className={triggerClasses}
                disabled={disabled}
                ref={ref}
                {...props}
            >
                {selectedCountry ? (
                    <div className="flex w-0 flex-grow items-center gap-2 overflow-hidden">
                        <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                            <CircleFlag
                                countryCode={selectedCountry.alpha2.toLowerCase()}
                                height={20}
                            />
                        </div>
                        {slim === false && (
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {selectedCountry.name}
                            </span>
                        )}
                    </div>
                ) : (
                    <span>
                        {slim === false ? (
                            placeholder ? (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            ) : (
                                setSelectedCountry.name
                            )
                        ) : (
                            <GlobeIcon size={20} />
                        )}
                    </span>
                )}
                <ArrowChevronDown size={16} />
            </PopoverTrigger>
            <PopoverContent
                className="min-w-[--radix-popper-anchor-width] p-0"
                collisionPadding={10}
                side="bottom"
            >
                <Command
                    className="max-h-[200px] w-full sm:max-h-[270px]"
                    shouldFilter={false}
                >
                    <CommandList className="ecoop-scroll">
                        <div className="sticky top-0 z-10 bg-popover">
                            <CommandInput
                                onValueChange={setSearchQuery}
                                placeholder="Search country..."
                                value={searchQuery}
                            />
                        </div>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                            {filteredCountries
                                .filter((x) => x.name)
                                .map((option, key: number) => (
                                    <CommandItem
                                        className="flex w-full items-center gap-2"
                                        key={key}
                                        onSelect={() => handleSelect(option)}
                                    >
                                        <div className="flex w-0 flex-grow items-center space-x-2 overflow-hidden">
                                            <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                                                <CircleFlag
                                                    countryCode={option.alpha2.toLowerCase()}
                                                    height={20}
                                                />
                                            </div>
                                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                {option.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground/60">
                                                {option.alpha2}
                                            </span>
                                        </div>
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto h-4 w-4 shrink-0',
                                                option.name ===
                                                    selectedCountry?.name
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

CountryComboboxComponent.displayName = 'CountryDropdownComponent'

export const CountryCombobox = forwardRef(CountryComboboxComponent)
