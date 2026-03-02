import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreHorizontal } from 'lucide-react'

import { highlightMatch } from '@/components/hightlight-match'
import { PencilFillIcon, TrashFillIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { IFinancialStatementTitle } from '../financial-statement-title.types'

export type TSelectFinancialItem = {
    action: 'view' | 'delete' | 'edit'
    item: IFinancialStatementTitle
}

interface RowProps {
    item: IFinancialStatementTitle
    onSelect?: (data: TSelectFinancialItem) => void
    searchTerm?: string
    isSearching?: boolean
}

const SortableRowFinancialStatementTitle = ({
    item,
    onSelect,
    searchTerm,
    isSearching,
}: RowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    return (
        <div className="" ref={setNodeRef} style={style}>
            <div
                className={`
                    group flex items-center bg-background! gap-2 p-0 transition-all duration-200
                    ${
                        isDragging
                            ? 'bg-accent/50 border-primary/50 shadow-xl scale-[1.02] rotate-1'
                            : 'bg-card hover:bg-accent/20 hover:border-accent shadow-sm'
                    }
                `}
            >
                <div
                    className="w-1.5 h-8"
                    style={{ backgroundColor: item.color }}
                />

                {/* Drag Handle */}
                <Button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab rounded p-1 hover:bg-transparent! text-muted-foreground hover:text-foreground active:cursor-grabbing"
                    disabled={isSearching}
                    size="xs"
                    variant="ghost"
                >
                    <GripVertical />
                </Button>
                <Button
                    className="cursor-grab rounded p-1 hover:bg-transparent! text-muted-foreground hover:text-foreground active:cursor-grabbing"
                    disabled={isSearching}
                    size="xs"
                    variant="ghost"
                >
                    <span>{item.index}</span>
                </Button>

                {/* Title Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate tracking-tight">
                        {searchTerm
                            ? highlightMatch(item.title, searchTerm)
                            : item.title}
                    </h4>
                    {/* <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                            Total
                        </span>
                        <span className="text-xs font-mono font-medium text-primary">
                            {item.total_title}
                        </span>
                    </div> */}
                </div>

                {/* Dropdown Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            size="icon"
                            variant="ghost"
                        >
                            <MoreHorizontal size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()

                                onSelect?.({
                                    item,

                                    action: 'edit',
                                })
                            }}
                        >
                            <PencilFillIcon className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation()
                                onSelect?.({
                                    item,
                                    action: 'delete',
                                })
                            }}
                        >
                            <TrashFillIcon className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default SortableRowFinancialStatementTitle
