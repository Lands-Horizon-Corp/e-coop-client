import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import {
    CheckIcon,
    DotsVerticalIcon,
    EyeNoneIcon,
    PencilFillIcon,
    TrashIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface IRowActionOption {
    text: string
    isAllowed?: boolean
    onClick: () => void
}

interface Props<TData> {
    row?: Row<TData>
    onDelete?: IRowActionOption
    onView?: IRowActionOption
    onEdit?: IRowActionOption
    canSelect?: boolean
    canEdit?: boolean
    canView?: boolean
    canDelete?: boolean
    otherActions?: ReactNode
}

const RowActionsGroup = <TData,>({
    row,
    onView,
    onEdit,
    onDelete,
    canSelect,
    otherActions,
}: Props<TData>) => {
    if (!onDelete && !onView && !onEdit && !otherActions) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="size-fit p-1" variant="ghost">
                    <DotsVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canSelect && (
                    <DropdownMenuItem
                        onClick={() => {
                            row?.toggleSelected()
                        }}
                    >
                        <CheckIcon className="mr-2 size-4" />
                        {row?.getIsSelected() ? 'Unselect' : 'Select'}
                    </DropdownMenuItem>
                )}
                {otherActions}
                {onView && (
                    <DropdownMenuItem
                        disabled={!onView.isAllowed}
                        onClick={onView.onClick}
                    >
                        <EyeNoneIcon className="mr-2" />
                        {onView.text}
                    </DropdownMenuItem>
                )}
                {onEdit && (
                    <DropdownMenuItem
                        disabled={!onEdit.isAllowed}
                        onClick={onEdit.onClick}
                    >
                        <PencilFillIcon className="mr-2" />
                        {onEdit.text}
                    </DropdownMenuItem>
                )}
                {onDelete && (
                    <DropdownMenuItem
                        disabled={!onDelete.isAllowed}
                        className="text-rose-400 focus:bg-destructive"
                        onClick={onDelete.onClick}
                    >
                        <TrashIcon className="mr-2" /> {onDelete.text}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default RowActionsGroup
