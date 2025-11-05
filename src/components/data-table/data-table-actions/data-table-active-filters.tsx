import { useMemo } from 'react'

import { useFilter } from '@/contexts/filter-context'
import { cn } from '@/helpers/tw-utils'

import { FunnelFilledIcon, FunnelIcon, XIcon } from '@/components/icons'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { IClassProps } from '@/types'

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
        <div
            className={cn(
                'flex max-w-full min-w-0 items-center gap-x-2',
                className
            )}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="inline-flex cursor-pointer items-center duration-200 ease-in-out text-muted-foreground/70 hover:text-foreground"
                        variant="secondary"
                    >
                        <FunnelFilledIcon />
                        Filter{mappedFilters.length > 1 ? 's' : ''} (
                        {mappedFilters.length})
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="flex flex-col">
                        <div className="flex">
                            <FunnelIcon
                                aria-hidden="true"
                                className="opacity-60 mr-1 inline"
                            />
                            Filters
                        </div>
                        <p className="text-xs text-muted-foreground/60 font-light">
                            Click to remove a filter
                        </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="space-y-1">
                        {mappedFilters.map((filter) => (
                            <DropdownMenuItem
                                className="focus:bg-accent/50 focus:border-accent focus:border border-accent border focus:text-accent-foreground"
                                key={filter.field}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    removeFilter(filter.field)
                                }}
                            >
                                {filter.displayText ?? filter.field}
                                <XIcon className="ml-auto" />
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <ActionTooltip tooltipContent="Remove All Filters">
                        <DropdownMenuItem
                            className="text-xs"
                            onClick={(e) => {
                                resetFilter()
                                e.stopPropagation()
                            }}
                        >
                            Clear Filters
                        </DropdownMenuItem>
                    </ActionTooltip>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
export default DataTableActiveFilters
