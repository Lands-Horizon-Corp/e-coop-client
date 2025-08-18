import { useMemo } from 'react'

import { useFilter } from '@/contexts/filter-context'
import { cn } from '@/helpers/tw-utils'

import ActionTooltip from '@/components/action-tooltip'
import { FunnelFilledIcon, FunnelIcon, XIcon } from '@/components/icons'
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
                        variant="secondary"
                        className="inline-flex cursor-pointer items-center duration-200 ease-in-out text-muted-foreground/70 hover:text-foreground"
                    >
                        <FunnelFilledIcon className="mr-2" />
                        Filter{mappedFilters.length > 1 ? 's' : ''} (
                        {mappedFilters.length})
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="flex flex-col">
                        <div className="flex">
                            Filters{' '}
                            <FunnelIcon
                                size={16}
                                className="opacity-60 inline ml-auto"
                                aria-hidden="true"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground/60 font-light">
                            Click to remove a filter
                        </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {mappedFilters.map((filter) => (
                            <DropdownMenuItem
                                key={filter.field}
                                className="focus:bg-background"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    removeFilter(filter.field)
                                }}
                            >
                                {filter.displayText ?? filter.field}
                                <XIcon className="" />
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <ActionTooltip tooltipContent="Remove All Filters">
                        <DropdownMenuItem
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
