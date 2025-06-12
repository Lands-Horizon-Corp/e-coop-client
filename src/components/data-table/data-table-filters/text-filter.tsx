import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DebouncedInput } from '@/components/ui/debounced-input'

import {
    useFilter,
    TFilterModes,
    TSearchFilter,
    filterModeMap,
    IFilterComponentProps,
} from '@/contexts/filter-context'

const TextFilter = <T,>({
    field,
    displayText,
    defaultMode,
}: IFilterComponentProps<T, 'text'>) => {
    const { filters, setFilter } = useFilter<string, typeof field>()

    const filterModeOptions = filterModeMap['text']

    const filterVal: TSearchFilter<string> = filters[field] ?? {
        value: '',
        displayText,
        to: undefined,
        from: undefined,
        dataType: 'text',
        mode: defaultMode ?? filterModeOptions[0].value,
    }

    return (
        <div onKeyDown={(e) => e.stopPropagation()} className="space-y-2 p-1">
            <p className="text-sm">Filter</p>
            <Select
                value={filterVal?.mode}
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
            <DebouncedInput
                type="text"
                className="w-full"
                placeholder="value"
                debounceTime={500}
                value={filterVal.value || ''}
                onChange={(inpt: string) =>
                    setFilter(field, {
                        ...filterVal,
                        value: inpt,
                    })
                }
            />
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

export default TextFilter
