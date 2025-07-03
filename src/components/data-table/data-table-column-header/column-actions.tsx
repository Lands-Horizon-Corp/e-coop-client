import { Column, Table } from '@tanstack/react-table'

import {
    ArrowDownIcon,
    ArrowUpIcon,
    DotsVerticalIcon,
    EyeNoneIcon,
    PushPinIcon,
    PushPinSlashIcon,
    ResetIcon,
} from '@/components/icons'
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

import { IBaseProps } from '@/types'

interface Props<TData, TValue> extends IBaseProps {
    table: Table<TData>
    column: Column<TData, TValue>
}

const ColumnActions = <TData, TValue>({
    table,
    column,
    children,
}: Props<TData, TValue>) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover size-fit gap-x-2 p-1 data-[state=open]:bg-accent"
                >
                    {column.getCanSort() && (
                        <>
                            {column.getIsSorted() === 'desc' ? (
                                <ArrowUpIcon className="size-3 opacity-55 group-hover:opacity-100" />
                            ) : column.getIsSorted() === 'asc' ? (
                                <ArrowDownIcon className="size-3 opacity-55 group-hover:opacity-100" />
                            ) : (
                                <DotsVerticalIcon className="size-3 opacity-55 group-hover:opacity-100" />
                            )}
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="ecoop-scroll max-h-[50vh] min-w-40 overflow-y-scroll shadow-md"
                align="start"
                onClick={(e) => e.stopPropagation()}
            >
                {children && (
                    <>
                        {children} <DropdownMenuSeparator />
                    </>
                )}
                {column.getCanPin() && (
                    <>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Pin Column</DropdownMenuLabel>
                            {column.getIsPinned() && (
                                <DropdownMenuItem
                                    className="gap-x-2 px-2"
                                    onClick={() => column.pin(false)}
                                >
                                    <PushPinSlashIcon className="mr-2 size-3.5" />
                                    Unpin
                                </DropdownMenuItem>
                            )}
                            {column.getIsPinned() !== 'left' && (
                                <DropdownMenuItem
                                    className="gap-x-2 px-2"
                                    onClick={() => column.pin('left')}
                                >
                                    <PushPinIcon className="mr-2 size-3.5" />
                                    Pin Left
                                </DropdownMenuItem>
                            )}

                            {column.getIsPinned() !== 'right' && (
                                <DropdownMenuItem
                                    className="gap-x-2 px-2"
                                    onClick={() => column.pin('right')}
                                >
                                    <PushPinIcon className="mr-2 size-3.5" />
                                    Pin Right
                                </DropdownMenuItem>
                            )}
                            {table.getIsSomeColumnsPinned() && (
                                <DropdownMenuItem
                                    className="gap-x-2 px-2"
                                    onClick={() => table.resetColumnPinning()}
                                >
                                    <PushPinSlashIcon className="mr-2 size-3.5" />
                                    Unpin All
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>
                    </>
                )}
                {column.getCanSort() && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Sorting</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="gap-x-2 px-2"
                                onClick={() =>
                                    column.toggleSorting(
                                        false,
                                        column.getCanMultiSort()
                                    )
                                }
                            >
                                <ArrowUpIcon className="mr-2 size-3.5" />
                                Ascending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-x-2 px-2"
                                onClick={() =>
                                    column.toggleSorting(
                                        true,
                                        column.getCanMultiSort()
                                    )
                                }
                            >
                                <ArrowDownIcon className="mr-2 size-3.5" />
                                Descending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-x-2 px-2"
                                onClick={() => column.clearSorting()}
                            >
                                <ResetIcon className="mr-2 size-3.5" />
                                Reset
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </>
                )}
                {column.getCanHide() && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-x-2 px-2"
                            onClick={() => column.toggleVisibility(false)}
                        >
                            <EyeNoneIcon className="mr-2 size-3.5" />
                            Hide
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ColumnActions
