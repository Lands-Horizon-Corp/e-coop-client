import {
    IFilterComponentProps,
    TColumnDataTypes,
    TSearchFilter,
    filterModeMap,
    useFilter,
} from '@/contexts/filter-context'

import MultiSelectFilter, {
    IMultiSelectOption,
} from '@/components/filters/multi-select-filter'

type AllowedMode<T extends keyof typeof filterModeMap> =
    (typeof filterModeMap)[T][number]['value']

interface IDatatableMultiFilter<T, TValue> extends IFilterComponentProps<T> {
    dataType: TColumnDataTypes
    mode: AllowedMode<
        Extract<TColumnDataTypes, 'text' | 'number' | 'date' | 'time'>
    >
    multiSelectOptions: IMultiSelectOption<TValue>[]
}

const DataTableMultiSelectFilter = <TData, TValue>({
    mode,
    field,
    dataType,
    displayText,
    multiSelectOptions,
}: IDatatableMultiFilter<TData, TValue>) => {
    const { filters, setFilter } = useFilter<string, typeof field, TValue[]>()

    const filterVal: TSearchFilter<string, TValue[]> = filters[field] ?? {
        displayText,
        mode,
        to: undefined,
        from: undefined,
        dataType,
        value: undefined,
    }

    return (
        <div
            onKeyDown={(e) => e.stopPropagation()}
            className="flex min-w-72 flex-col p-1"
        >
            <p className="text-sm">Filter</p>
            <MultiSelectFilter
                hideLabel
                value={
                    filterVal.value
                        ? typeof filterVal.value === 'string'
                            ? [filterVal.value]
                            : filterVal.value
                        : []
                }
                multiSelectOptions={multiSelectOptions}
                setValues={(selected) =>
                    setFilter(field, {
                        ...filterVal,
                        value: selected,
                    })
                }
                clearValues={() => setFilter(field)}
            />
        </div>
    )
}

export default DataTableMultiSelectFilter
