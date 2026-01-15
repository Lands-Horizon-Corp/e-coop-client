import * as React from 'react'

import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'

import { TSearchFilter } from '@/contexts/filter-context'
import { ArrowUpIcon, FilterIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { ArrowDownIcon, CalendarIcon, ResetIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { TSortingState } from '@/types'

import { TModelName } from '../../generated-report.types'
import { DEFAULT_MODEL } from './generated-reports-button'
import ModelCombobox from './model-combobox'

type ReportFilterProps = {
    onModelChange: (model: TModelName) => void
    selectedModel: TModelName
    setFilter: (
        field: string,
        filter?: TSearchFilter<unknown, unknown> | undefined
    ) => void
    setSortingState: React.Dispatch<
        React.SetStateAction<TSortingState<unknown>>
    >
}

export const ReportFilter = ({
    onModelChange,
    selectedModel,
    setFilter,
    setSortingState,
}: ReportFilterProps) => {
    const handleResetFilter = () => {
        setFilter('created_at', undefined)
        setSortingState([])
        onModelChange(DEFAULT_MODEL)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="gap-2 ml-2 px-3 py-2 text-sm font-medium"
                    variant="outline"
                >
                    <FilterIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="w-80 p-3 border-0"
                side="right"
            >
                <DropdownMenuLabel className="px-3 pt-3 text-sm font-medium">
                    Filter
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                    <ModelCombobox
                        onChange={(model) => onModelChange(model)}
                        value={selectedModel}
                    />
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="">Range</DropdownMenuLabel>
                    <ReportDateFilter setFilter={setFilter} />
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <ReportSortFilter setSortingState={setSortingState} />
                </DropdownMenuGroup>
                <DropdownMenuItem
                    className="gap-x-2 px-2"
                    onClick={handleResetFilter}
                >
                    <ResetIcon className="mr-2 size-3.5" />
                    Reset
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type ReportDateFilterProps = {
    setFilter: (
        field: string,
        filter?: TSearchFilter<unknown, unknown> | undefined
    ) => void
}

export const ReportDateFilter = ({ setFilter }: ReportDateFilterProps) => {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: undefined,
    })

    const handleApply = () => {
        if (dateRange?.from && dateRange?.to) {
            setFilter?.('created_at', {
                value: undefined,
                from: dateRange?.from,
                dataType: 'date',
                displayText: 'Date Created',
                to: dateRange?.to,
                mode: 'range',
            })
        }
    }

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className="flex justify-between w-full"
                        size={'sm'}
                        variant={'outline'}
                    >
                        choose from - choose to
                        <CalendarIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 bg-sidebar">
                    <Calendar
                        className="rounded-lg shadow-sm w-full bg-transparent border-0"
                        defaultMonth={dateRange?.from}
                        mode="range"
                        navLayout="after"
                        numberOfMonths={1}
                        onSelect={setDateRange}
                        selected={dateRange}
                        showOutsideDays
                    />
                    <div className="flex w-full p-2">
                        <Button
                            className=" rounded-b-lg"
                            onClick={() => {
                                setDateRange({ from: undefined, to: undefined })
                            }}
                            variant={'ghost'}
                        >
                            Clear
                        </Button>
                        <Button
                            className=" rounded-b-lg"
                            onClick={handleApply}
                            variant={'ghost'}
                        >
                            Apply
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

type ReportSortFilterProps = {
    setSortingState: React.Dispatch<
        React.SetStateAction<TSortingState<unknown>>
    >
}

export const ReportSortFilter = ({
    setSortingState,
}: ReportSortFilterProps) => {
    const handleSort = (order: string) => {
        setSortingState?.((prevState) => {
            if (prevState.length === 0) {
                return [{ field: 'created_at', order: order as 'asc' | 'desc' }]
            } else {
                return prevState.map((sortItem) => {
                    if (sortItem.field === 'created_at') {
                        return { ...sortItem, order: order as 'asc' | 'desc' }
                    }
                    return sortItem
                })
            }
        })
    }

    return (
        <>
            <DropdownMenuLabel>Sorting</DropdownMenuLabel>
            <DropdownMenuItem
                className="gap-x-2 px-2"
                onClick={() => handleSort('asc')}
            >
                <ArrowUpIcon className="mr-2 size-3.5" />
                Ascending
            </DropdownMenuItem>
            <DropdownMenuItem
                className="gap-x-2 px-2"
                onClick={() => handleSort('desc')}
            >
                <ArrowDownIcon className="mr-2 size-3.5" />
                Descending
            </DropdownMenuItem>
        </>
    )
}
