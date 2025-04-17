import { Table } from '@tanstack/react-table'

import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { EyeIcon } from '@/components/icons'
import { useCallback } from 'react'

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>
}

const ColumnVisibilityOption = <TData,>({
    table,
}: DataTableViewOptionsProps<TData>) => {
    const allColumns = table.getAllColumns()

    const hiddenColumnsLength = allColumns.filter(
        (col) => !col.getIsVisible()
    ).length

    const onShowAllColumns = useCallback(() => {
        table.getAllColumns().forEach((col) => col.toggleVisibility(true))
    }, [table])

    return (
        <DropdownMenuGroup>
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hiddenColumnsLength > 0 && (
                <DropdownMenuItem onClick={onShowAllColumns}>
                    <EyeIcon className="mr-2" />
                    Show All
                </DropdownMenuItem>
            )}
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
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                            }
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                    )
                })}
        </DropdownMenuGroup>
    )
}

export default ColumnVisibilityOption
