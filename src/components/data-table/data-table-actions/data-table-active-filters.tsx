import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import FilterChip from '@/components/filter-chip'
import { TrashIcon } from '@/components/icons'
import ActionTooltip from '@/components/action-tooltip'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { useFilter } from '@/contexts/filter-context'

const DataTableActiveFilters = ({ className }: IClassProps) => {
    const { filters, resetFilter, removeFilter } = useFilter()

    const mappedFilters = useMemo(() => {
        return Object.entries(filters)
            .map(([key, value]) => ({
                field: key,
                displayText: value?.displayText,
                ...value,
            }))
            .filter((filter) => {
                if (filter.field === 'globalSearch' || filter.isStaticFilter)
                    return false
                if (Array.isArray(filter.value) && filter.value.length === 0)
                    return false

                if (filter.value === 0 || filter.value) {
                    return true
                }

                return filter.value || (filter.from && filter.to)
            })
    }, [filters])

    if (mappedFilters.length <= 0) return null

    return (
        <div className={cn('flex max-w-full items-center gap-x-2', className)}>
            <span className="inline-flex items-center">Filters</span>
            <div className="ecoop-scroll flex flex-wrap items-center gap-x-2 gap-y-1">
                <ActionTooltip tooltipContent="Remove All Filters">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="size-fit p-1 text-xs text-foreground/60"
                        onClick={() => resetFilter()}
                    >
                        <TrashIcon />
                    </Button>
                </ActionTooltip>
                {mappedFilters.map((filter) => (
                    <FilterChip
                        key={filter.field}
                        label={filter.displayText ?? filter.field}
                        tooltipDescription="Remove Filter"
                        onClick={() => removeFilter(filter.field)}
                    />
                ))}
            </div>
        </div>
    )
}
export default DataTableActiveFilters
