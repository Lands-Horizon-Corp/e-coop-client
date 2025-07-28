import {
    IFilterComponentProps,
    TFilterModes,
    TSearchFilter,
    filterModeMap,
    useFilter,
} from '@/contexts/filter-context'

import { Button } from '@/components/ui/button'
import { DebouncedInput } from '@/components/ui/debounced-input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import NumberRange from './number-range'

const NumberFilter = <T,>({
    field,
    displayText,
    defaultMode,
}: IFilterComponentProps<T, 'number'>) => {
    const filterModeOptions = filterModeMap['number']
    const { filters, setFilter } = useFilter<number, typeof field>()

    const filterVal: TSearchFilter<number> = filters[field] ?? {
        displayText,
        to: undefined,
        from: undefined,
        value: undefined,
        dataType: 'number',
        mode: defaultMode ?? filterModeOptions[0].value,
    }

    return (
        <div onKeyDown={(e) => e.stopPropagation()} className="space-y-2 p-1">
            <p className="text-sm">Filter</p>
            <Select
                value={filterVal.mode}
                onValueChange={(val) => {
                    const newFilterMode = val as TFilterModes
                    setFilter(field, {
                        ...filterVal,
                        mode: newFilterMode,
                    })
                }}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select Filter" />
                </SelectTrigger>
                <SelectContent
                    onClick={(e) => e.stopPropagation()}
                    className="ecoop-scroll max-h-[60vh] min-w-40 overflow-y-scroll shadow-md"
                >
                    {filterModeOptions.map((mode, i) => (
                        <SelectItem key={i} value={mode.value}>
                            {mode.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {filterVal.mode !== 'range' ? (
                <DebouncedInput
                    type="number"
                    value={filterVal.value ?? ''}
                    className="w-full"
                    onChange={(inpt) =>
                        setFilter(field, {
                            ...filterVal,
                            value: inpt as number,
                            from: undefined,
                            to: undefined,
                        })
                    }
                    placeholder={`value`}
                />
            ) : (
                <NumberRange
                    value={{ from: filterVal.from, to: filterVal.to }}
                    onChange={(val) =>
                        setFilter(field, {
                            ...filterVal,
                            ...val,
                            value: undefined,
                        })
                    }
                />
            )}
            <Button
                size="sm"
                className="w-full"
                variant="secondary"
                onClick={() => setFilter(field)}
            >
                Clear Filter
            </Button>
        </div>
    )
}

export default NumberFilter
