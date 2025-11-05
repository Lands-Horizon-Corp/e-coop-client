import { cn } from '@/helpers'

import { CalendarIcon, EditPencilIcon, TrashIcon } from '@/components/icons'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { IBranch } from '../../branch.types'

type CustomFooterProps = {
    branch: IBranch
    isSeeding?: boolean
    isDeleting: boolean
    handleEdit: () => void
    handleDelete: () => void
    showActions?: boolean
}

export const BranchCardFooter = ({
    branch,
    isSeeding,
    isDeleting,
    handleEdit,
    handleDelete,
    showActions,
}: CustomFooterProps) => {
    if (!showActions) return null
    return (
        <div className="flex items-center px-1 !pt-0 pb-2 w-full justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {branch.created_at && (
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                            Created{' '}
                            {new Date(branch.created_at).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className={cn(
                                'p-2 rounded-md hover:bg-accent transition-colors',
                                'disabled:opacity-50 disabled:cursor-not-allowed'
                            )}
                            disabled={isSeeding}
                            onClick={handleEdit}
                        >
                            <EditPencilIcon className="h-4 w-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit branch</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className={cn(
                                'p-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors',
                                'disabled:opacity-50 disabled:cursor-not-allowed'
                            )}
                            disabled={isSeeding || isDeleting}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete()
                            }}
                        >
                            {isDeleting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                            ) : (
                                <TrashIcon className="h-4 w-4" />
                            )}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete branch</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}
