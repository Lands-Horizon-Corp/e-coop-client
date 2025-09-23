import { cn } from '@/helpers'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'

import { CheckIcon } from '../icons'

export interface IMultiSelectOption<TValue> {
    label: string
    value: TValue
}

const MultiSelectFilter = <TValue,>({
    value,
    hideLabel,
    multiSelectOptions,
    setValues,
    clearValues,
}: {
    value: TValue[]
    hideLabel?: boolean
    clearValues: () => void
    multiSelectOptions: IMultiSelectOption<TValue>[]
    setValues: (selectedValues: TValue[]) => void
}) => {
    const serialize = (val: TValue) =>
        typeof val === 'object' && val !== null ? JSON.stringify(val) : val

    const deserialize = (val: string) => {
        try {
            return JSON.parse(val) as TValue
        } catch {
            return val
        }
    }

    const selectedValues = new Set(value.map((v) => serialize(v)))

    return (
        <div onKeyDown={(e) => e.stopPropagation()} className="space-y-2 p-1">
            {!hideLabel && <p className="text-sm">Filter</p>}
            <Command className="w-fit bg-transparent">
                <CommandInput placeholder="Search filters..." />
                <CommandList>
                    <CommandEmpty className="px-8 py-6 text-center text-xs">
                        No results found.
                    </CommandEmpty>
                    <CommandGroup>
                        {multiSelectOptions.map((option, i) => {
                            const serializedValue = serialize(option.value)
                            const isSelected =
                                selectedValues.has(serializedValue)

                            return (
                                <CommandItem
                                    key={`${option.label}-${i}-${option.value}`}
                                    onSelect={() => {
                                        const updatedValues = new Set(
                                            selectedValues
                                        )

                                        if (isSelected) {
                                            updatedValues.delete(
                                                serializedValue
                                            )
                                        } else {
                                            updatedValues.add(serializedValue)
                                        }

                                        const filterValues = Array.from(
                                            updatedValues
                                        ).map((v) =>
                                            typeof v === 'string'
                                                ? deserialize(v)
                                                : v
                                        ) as TValue[]

                                        setValues(
                                            filterValues.length
                                                ? filterValues
                                                : []
                                        )
                                    }}
                                >
                                    <div
                                        className={cn(
                                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'opacity-50 [&_svg]:invisible'
                                        )}
                                    >
                                        <CheckIcon className="h-4 w-4" />
                                    </div>
                                    <span>{option.label}</span>
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                </CommandList>
            </Command>
            <Button
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() => clearValues()}
            >
                Clear Filter
            </Button>
        </div>
    )
}

export default MultiSelectFilter
