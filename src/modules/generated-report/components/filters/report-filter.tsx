import { useState } from 'react'

import {
    TFilterLogic,
    TFilterPayload,
    TFinalFilter,
} from '@/contexts/filter-context'
import { IColumnReportFilter } from '@/helpers/table-column-meta-utils'
import { Check, Copy, Plus, X } from 'lucide-react'

import { ArrowDownIcon, ArrowUpIcon, SortIcon } from '@/components/icons'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { useGeneratedReportFilter } from './context/use-generate-report-filter-context'
import { FilterRule } from './filter-rule'

interface FilterBuilderUIProps {
    columns: IColumnReportFilter[]
    onFilterChange?: (payload: TFilterPayload) => void
}

export function GeneratedReportFilter({
    columns,
    onFilterChange,
}: FilterBuilderUIProps) {
    const [sortPopoverOpen, setSortPopoverOpen] = useState(false)
    const [tempSortOrder, setTempSortOrder] = useState<'asc' | 'desc'>('asc')
    const [copied, setCopied] = useState(false)

    const DEFAULT_FILTER: TFinalFilter = {
        field: columns[0]?.field,
        mode: 'contains',
        dataType: columns[0]?.dataType || 'text',
        value: '',
    }

    const {
        payload,
        setFilter,
        filter,
        setFilterLogic: setLogic,
        filterLogic: logic,
        setSortingState,
        sortingState,
    } = useGeneratedReportFilter()

    const getFirstAvailableColumn = () => {
        const availableColumn = columns.find(
            (col) => !sortingState.some((s) => s.field === col.field)
        )
        return availableColumn?.field || columns[0]?.field || ''
    }

    const [tempSortField, setTempSortField] = useState<string>(
        getFirstAvailableColumn()
    )

    const handleSortApply = () => {
        setSortingState((prevState) => {
            const existingIndex = prevState.findIndex(
                (item) => item.field === tempSortField
            )
            if (existingIndex >= 0) {
                const newState = [...prevState]
                newState[existingIndex] = {
                    field: tempSortField,
                    order: tempSortOrder,
                }
                return newState
            }
            return [
                ...prevState,
                { field: tempSortField, order: tempSortOrder },
            ]
        })
        setSortPopoverOpen(false)
    }

    const handleSortCancel = () => {
        setSortPopoverOpen(false)
    }

    const handleRemoveSort = (field: string) => {
        setSortingState((prevState) =>
            prevState.filter((item) => item.field !== field)
        )
    }

    const handleClearAll = () => {
        setSortingState([])
        const newFilters = [{ ...DEFAULT_FILTER }]
        setFilter(newFilters)
        updatePayload(newFilters)
    }

    // Filter handlers
    const updatePayload = (
        newFilters: TFinalFilter[],
        newLogic?: TFilterLogic
    ) => {
        onFilterChange?.({
            logic: newLogic ?? logic,
            filters: newFilters,
        })
    }

    const handleAddRule = () => {
        const newFilters = [...filter, { ...DEFAULT_FILTER }]
        setFilter(newFilters)
        updatePayload(newFilters)
    }

    const handleRemoveRule = (index: number) => {
        if (filter.length > 1) {
            const newFilters = filter.filter((_, i) => i !== index)
            setFilter(newFilters)
            updatePayload(newFilters)
        }
    }

    const handleUpdateRule = (index: number, updatedFilter: TFinalFilter) => {
        const newFilters = [...filter]
        newFilters[index] = updatedFilter
        setFilter(newFilters)
        updatePayload(newFilters)
    }

    const handleLogicChange = (value: TFilterLogic) => {
        setLogic(value)
        updatePayload(filter, value)
    }

    const handleCopyPayload = () => {
        navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg">Filter</CardTitle>
                        <div className="flex items-center gap-2">
                            <InfoTooltip
                                content="Change filter logic between rules"
                                delayDuration={1000}
                            >
                                <div className="flex items-center border rounded-md h-8">
                                    <Button
                                        className="h-full rounded-r-none px-3 text-xs font-semibold"
                                        onClick={() => handleLogicChange('AND')}
                                        size="sm"
                                        type="button"
                                        variant={
                                            logic === 'AND'
                                                ? 'default'
                                                : 'ghost'
                                        }
                                    >
                                        AND
                                    </Button>
                                    <Button
                                        className="h-full rounded-l-none px-3 text-xs font-semibold"
                                        onClick={() => handleLogicChange('OR')}
                                        size="sm"
                                        type="button"
                                        variant={
                                            logic === 'OR' ? 'default' : 'ghost'
                                        }
                                    >
                                        OR
                                    </Button>
                                </div>
                            </InfoTooltip>

                            <Popover
                                onOpenChange={(open) => {
                                    setSortPopoverOpen(open)
                                    if (open) {
                                        setTempSortField(
                                            getFirstAvailableColumn()
                                        )
                                        setTempSortOrder('asc')
                                    }
                                }}
                                open={sortPopoverOpen}
                            >
                                <InfoTooltip
                                    content="Add sorting to your filter"
                                    delayDuration={1000}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            className="h-8"
                                            hoverVariant={'primary'}
                                            size="icon"
                                            variant="outline"
                                        >
                                            <SortIcon />
                                        </Button>
                                    </PopoverTrigger>
                                </InfoTooltip>
                                <PopoverContent
                                    align="end"
                                    className="w-[320px] bg-card p-4"
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-sm mb-1">
                                                Sort Order
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                Add sorting to your filter
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium">
                                                Field
                                            </label>
                                            <Select
                                                onValueChange={setTempSortField}
                                                value={tempSortField}
                                            >
                                                <SelectTrigger className="h-8 w-full text-sm">
                                                    <SelectValue placeholder="Select field" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {columns.map((col) => {
                                                        const isAlreadySorted =
                                                            sortingState.some(
                                                                (s) =>
                                                                    s.field ===
                                                                    col.field
                                                            )
                                                        return (
                                                            <SelectItem
                                                                disabled={
                                                                    isAlreadySorted
                                                                }
                                                                key={col.field}
                                                                value={
                                                                    col.field
                                                                }
                                                            >
                                                                {col.label}
                                                                {isAlreadySorted &&
                                                                    ' (selected)'}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium">
                                                Order
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    className="justify-start h-8"
                                                    onClick={() =>
                                                        setTempSortOrder('asc')
                                                    }
                                                    size="sm"
                                                    type="button"
                                                    variant={
                                                        tempSortOrder === 'asc'
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                >
                                                    <ArrowUpIcon className="mr-2 h-3 w-3" />
                                                    <span className="text-xs">
                                                        Asc
                                                    </span>
                                                </Button>
                                                <Button
                                                    className="justify-start h-8"
                                                    onClick={() =>
                                                        setTempSortOrder('desc')
                                                    }
                                                    size="sm"
                                                    type="button"
                                                    variant={
                                                        tempSortOrder === 'desc'
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                >
                                                    <ArrowDownIcon className="mr-2 h-3 w-3" />
                                                    <span className="text-xs">
                                                        Desc
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                className="flex-1"
                                                onClick={handleSortCancel}
                                                size="sm"
                                                type="button"
                                                variant="outline"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="flex-1"
                                                onClick={handleSortApply}
                                                size="sm"
                                                type="button"
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button
                                className="h-8"
                                hoverVariant={'primary'}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleAddRule()
                                }}
                                size="icon"
                                variant={'outline'}
                            >
                                <Plus className=" h-4 w-4" />
                            </Button>
                            <InfoTooltip
                                content="Clear all sorting and filters"
                                delayDuration={1000}
                            >
                                <Button
                                    className="h-8"
                                    disabled={
                                        sortingState.length === 0 &&
                                        filter.length === 1 &&
                                        !filter[0]?.value
                                    }
                                    onClick={handleClearAll}
                                    size="sm"
                                    variant="destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </InfoTooltip>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1">
                    {/* Sorting Display */}
                    {sortingState && sortingState.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pb-2">
                            {sortingState.map((sort) => {
                                const column = columns.find(
                                    (col) => col.field === sort.field
                                )
                                return (
                                    <Badge
                                        className="flex items-center gap-1 px-2 py-1"
                                        key={sort.field}
                                        variant="secondary"
                                    >
                                        {sort.order === 'asc' ? (
                                            <ArrowUpIcon className="h-3 w-3 text-accent-foreground" />
                                        ) : (
                                            <ArrowDownIcon className="h-3 w-3 text-muted-foreground" />
                                        )}
                                        <span className="text-xs">
                                            {column?.label || sort.field}
                                        </span>
                                        <button
                                            className="ml-1 hover:text-destructive"
                                            onClick={() =>
                                                handleRemoveSort(sort.field)
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )
                            })}
                            <Button
                                className="text-xs h-fit p-1 rounded-full text-muted-foreground w-fit"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setSortingState([])
                                }}
                                size="xs"
                                variant="ghost"
                            >
                                clear
                            </Button>
                        </div>
                    )}
                    <div className="space-y-1 pr-2 relative h-fit max-h-52 ecoop-scroll overflow-y-auto overflow-x-hidden">
                        {filter?.map((item, index) => (
                            <div className="space-y-1 grid" key={index}>
                                <FilterRule
                                    columns={columns}
                                    filter={item}
                                    isLast={index === filter.length - 1}
                                    onAddRule={
                                        index === filter.length - 1
                                            ? handleAddRule
                                            : undefined
                                    }
                                    onRemove={() => handleRemoveRule(index)}
                                    onUpdate={(updated) =>
                                        handleUpdateRule(index, updated)
                                    }
                                />
                            </div>
                        ))}
                        {filter.length > 8 && (
                            <div className="h-50 inset-0 bg-gradient-to-b from-transparent from-80% to-card sticky pointer-events-none bottom-0" />
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Filter Payload</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                            {JSON.stringify(payload, null, 2)}
                        </pre>
                        <Button
                            className="absolute top-2 right-2"
                            onClick={handleCopyPayload}
                            size="sm"
                            variant="outline"
                        >
                            {copied ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
