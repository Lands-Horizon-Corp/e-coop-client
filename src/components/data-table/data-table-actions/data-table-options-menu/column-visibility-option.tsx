import { useCallback } from 'react'

import { Table } from '@tanstack/react-table'

import { EyeIcon } from '@/components/icons'
import {
    DropdownMenuCheckboxItem,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

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
    )
}

export default ColumnVisibilityOption
