import { ReactNode } from 'react'

import {
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

interface Props {
    onDelete?: IRowActionOption
    onView?: IRowActionOption
    onEdit?: IRowActionOption
    canEdit?: boolean
    canView?: boolean
    canDelete?: boolean
    otherActions?: ReactNode
}

const RowActionsGroup = ({ onDelete, onView, onEdit, otherActions }: Props) => {
    if (!onDelete && !onView && !onEdit) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="size-fit p-1" variant="ghost">
                    <DotsVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
