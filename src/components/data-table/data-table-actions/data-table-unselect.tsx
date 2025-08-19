import { Table } from '@tanstack/react-table'

import { DashSquareDottedIcon } from '@/components/icons'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'

export interface IDataTableDeleteSelectedProps<T> extends IClassProps {
    table: Table<T>
}

const DataTableUnselect = <T,>({
    table,
    className,
}: IDataTableDeleteSelectedProps<T>) => {
    const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map((row) => row.original)

    if (selectedRows.length === 0) return null

    return (
        <ActionTooltip
            tooltipContent={`Unselect ${selectedRows.length} row(s)`}
        >
            <Button
                size="icon"
                disabled={selectedRows.length === 0}
                variant="secondary"
                className={className}
                onClick={() => table.resetRowSelection()}
            >
                <DashSquareDottedIcon />
            </Button>
        </ActionTooltip>
    )
}

export default DataTableUnselect
