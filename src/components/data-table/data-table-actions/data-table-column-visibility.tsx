import { useCallback } from 'react'

import { cn } from '@/lib'
import { Table } from '@tanstack/react-table'

import { ColumnOutlineIcon, EyeIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { IClassProps } from '@/types'

interface DataTableViewOptionsProps<TData> extends IClassProps {
    table: Table<TData>
}

const DatatableColumnVisibility = <TData,>({
    table,
    className,
}: DataTableViewOptionsProps<TData>) => {
    const allColumns = table.getAllColumns()

    const hiddenColumnsLength = allColumns.filter(
        (col) => !col.getIsVisible()
    ).length

    const onShowAllColumns = useCallback(() => {
        table.getAllColumns().forEach((col) => col.toggleVisibility(true))
    }, [table])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="secondary"
                    className={cn('rounded-md', className)}
                >
                    <ColumnOutlineIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="ecoop-scroll max-h-[70vh] min-w-[180px] overflow-y-scroll [&::-webkit-scrollbar]:w-[3px]"
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex items-center justify-between">
                        Toggle columns <ColumnOutlineIcon />
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allColumns
                        .filter(
                            (column) =>
                                typeof column.accessorFn !== 'undefined' &&
                                column.getCanHide()
                        )
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    onSelect={(e) => e.preventDefault()}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                    {hiddenColumnsLength > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={onShowAllColumns}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <EyeIcon className="mr-2" />
                                Show All
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DatatableColumnVisibility
