import { Table } from '@tanstack/react-table'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MixerHorizontalIcon } from '@/components/icons'

import DataTableScrollOption, {
    IDataTableScrollableOptionProps,
} from './scroll-option'
import ColumnVisibilityOption from './column-visibility-option'
import { cn } from '@/lib'
import { IClassProps } from '@/types'
import DataTableFilterLogicOption, {
    IDataTableFilterLogicOptionProps,
} from './filter-logic-option'

interface Props<T> extends IClassProps {
    table: Table<T>
    scrollOption?: IDataTableScrollableOptionProps
    filterLogicOption?: IDataTableFilterLogicOptionProps
}

const DataTableOptionsMenu = <T,>({
    table,
    className,
    scrollOption,
    filterLogicOption,
}: Props<T>) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="secondary"
                    className={cn('rounded-md', className)}
                >
                    <MixerHorizontalIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="ecoop-scroll max-h-[70vh] min-w-[180px] overflow-y-scroll [&::-webkit-scrollbar]:w-[3px]"
            >
                <ColumnVisibilityOption table={table} />
                {scrollOption && (
                    <>
                        <DropdownMenuSeparator />
                        <DataTableScrollOption {...scrollOption} />
                    </>
                )}
                {filterLogicOption && (
                    <>
                        <DropdownMenuSeparator />
                        <DataTableFilterLogicOption {...filterLogicOption} />
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DataTableOptionsMenu
