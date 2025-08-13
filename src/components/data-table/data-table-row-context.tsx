import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import {
    CheckIcon,
    EyeNoneIcon,
    PencilFillIcon,
    TrashIcon,
} from '@/components/icons'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'

export interface IRowActionOption {
    text: string
    isAllowed?: boolean
    onClick: () => void
}

interface Props<TData> {
    row: Row<TData>
    modal?: boolean
    canSelect?: boolean
    children: ReactNode
    onDelete?: IRowActionOption
    onView?: IRowActionOption
    onEdit?: IRowActionOption
    otherActions?: ReactNode
}

const DataTableRowContext = <TData,>({
    row,
    onView,
    onEdit,
    children,
    onDelete,
    otherActions,
    modal = false,
    canSelect = true,
}: Props<TData>) => {
    if (!onDelete && !onView && !onEdit && !otherActions) {
        return <>{children}</>
    }

    return (
        <ContextMenu modal={modal}>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuLabel>Actions</ContextMenuLabel>
                <ContextMenuSeparator />
                {canSelect && (
                    <ContextMenuItem
                        onClick={() => {
                            row?.toggleSelected()
                        }}
                    >
                        <CheckIcon className="mr-2 size-4" />
                        {row?.getIsSelected() ? 'Unselect' : 'Select'}
                    </ContextMenuItem>
                )}
                {otherActions}
                {onView && (
                    <ContextMenuItem
                        disabled={!onView.isAllowed}
                        onClick={(e) => {
                            e.preventDefault()
                            onView.onClick()
                        }}
                    >
                        <EyeNoneIcon className="mr-2 h-4 w-4" />
                        {onView.text}
                    </ContextMenuItem>
                )}
                {onEdit && (
                    <ContextMenuItem
                        disabled={!onEdit.isAllowed}
                        onClick={(e) => {
                            e.preventDefault()
                            onEdit.onClick()
                        }}
                    >
                        <PencilFillIcon className="mr-2 h-4 w-4" />
                        {onEdit.text}
                    </ContextMenuItem>
                )}
                {onDelete && (
                    <ContextMenuItem
                        disabled={!onDelete.isAllowed}
                        className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                        onClick={(e) => {
                            e.preventDefault()
                            onDelete.onClick()
                        }}
                    >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        {onDelete.text}
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default DataTableRowContext
