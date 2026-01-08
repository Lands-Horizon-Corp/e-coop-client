import {
    ArrowRightIcon,
    CalendarIcon,
    EditPencilIcon,
    TrashIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
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
    handleSwitch?: () => void
    isCurrentBranch?: boolean
}

export const BranchCardFooter = ({
    branch,
    isSeeding,
    isDeleting,
    handleEdit,
    handleDelete,
    showActions,
    handleSwitch,
    isCurrentBranch,
}: CustomFooterProps) => {
    if (!showActions) return null
    return (
        <div className="flex  items-center px-3 py-2 w-full justify-between gap-2">
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
            <div className="flex items-center">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="rounded-xl"
                            disabled={isSeeding}
                            onClick={handleSwitch}
                            size={'sm'}
                            variant="secondary"
                        >
                            {isCurrentBranch && <p className="text-xs">Go</p>}
                            <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isCurrentBranch ? 'Current Branch' : 'Switch'}</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="rounded-xl"
                            disabled={isSeeding}
                            onClick={handleEdit}
                            size={'icon'}
                            variant={'ghost'}
                        >
                            <EditPencilIcon className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit branch</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="rounded-xl"
                            disabled={isSeeding || isDeleting}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete()
                            }}
                            size={'icon'}
                            variant={'ghost'}
                        >
                            {isDeleting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                            ) : (
                                <TrashIcon className="h-4 w-4" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete branch</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}
