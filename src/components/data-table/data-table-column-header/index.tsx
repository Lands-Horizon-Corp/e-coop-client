import { CSSProperties } from 'react'

import { cn } from '@/helpers/tw-utils'
import { Column, Header, Table } from '@tanstack/react-table'

import { PushPinSlashIcon } from '@/components/icons'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'

import ColumnResizeHandle from './column-drag-resize'

interface DataTableColumnHeaderProps<
    TData,
    TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    table: Table<TData>
    disableSort?: boolean
    tooltipDescription?: string
    containerClassName?: string
    column: Column<TData, TValue>
    header: Header<TData, TValue>
}

const DataTableColumnHeader = <TData, TValue>({
    title,
    table,
    header,
    children,
    className,
    tooltipDescription,
    containerClassName,
    disableSort = false,
}: DataTableColumnHeaderProps<TData, TValue>) => {
    const style: CSSProperties = {
        opacity: 1,
        position: 'relative',
        transition: 'width 0.2s ease-in-out',
        whiteSpace: 'nowrap',
        width: header.column.getSize(),
        zIndex: 0,
    }

    const finalTitle = tooltipDescription ? (
        <ActionTooltip tooltipContent={tooltipDescription ?? ''}>
            <span className="relative font-bold">{title}</span>
        </ActionTooltip>
    ) : (
        <span className="relative font-bold">{title}</span>
    )

    return (
        <div className="inline-block w-full flex-1 space-y-1 py-2">
            <div className={cn('flex w-full items-center gap-x-2', className)}>
                <div
                    className={cn(
                        'inline-flex w-full items-center justify-between gap-x-1.5',
                        containerClassName
                    )}
                >
                    <span
                        className={cn(
                            '!size-fit gap-x-2 self-start truncate p-1',
                            disableSort && 'pointer-events-none'
                        )}
                        style={style}
                    >
                        {finalTitle}
                    </span>
                    <div className="flex items-center gap-x-2">
                        {children}
                        {header.column.getCanPin() &&
                            header.column.getIsPinned() && (
                                <Button
                                    className="size-fit rounded-md p-1"
                                    onClick={() => header.column.pin(false)}
                                    size="icon"
                                    variant="secondary"
                                >
                                    <PushPinSlashIcon className="size-3.5" />
                                </Button>
                            )}
                        {header.column.getCanResize() && (
                            <ColumnResizeHandle header={header} table={table} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataTableColumnHeader
