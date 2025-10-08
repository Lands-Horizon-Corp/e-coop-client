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
        <div className="space-y-2 p-1" onKeyDown={(e) => e.stopPropagation()}>
            <p className="text-sm">Filter</p>
            <Select
                onValueChange={(val) => {
                    const newFilterMode = val as TFilterModes
                    setFilter(field, {
                        ...filterVal,
                        mode: newFilterMode,
                    })
                }}
                value={filterVal?.mode}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select Filter" />
                </SelectTrigger>
                <SelectContent
                    className="ecoop-scroll max-h-[60vh] min-w-40 overflow-y-scroll shadow-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    {filterModeOptions.map((mode, i) => (
                        <SelectItem key={i} value={mode.value}>
                            {mode.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <DebouncedInput
                className="w-full"
                debounceTime={500}
                onChange={(inpt: string) =>
                    setFilter(field, {
                        ...filterVal,
                        value: inpt,
                    })
                }
                placeholder="value"
                type="text"
                value={filterVal.value || ''}
            />
            <Button
                className="w-full"
                onClick={() => setFilter(field)}
                size="sm"
                variant="secondary"
            >
                Clear Filter
            </Button>
        </div>
    )
}

export default TextFilter
