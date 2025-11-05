import { cn } from '@/helpers'

import { CalendarIcon, EditPencilIcon } from '@/components/icons'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { IOrganization } from '../../organization.types'

type TCustomFooterProps = {
    organization: IOrganization
    isSeeding: boolean
    handleEdit: () => void
}

export const CustomFooter = ({
    organization,
    isSeeding,
    handleEdit,
}: TCustomFooterProps) => (
    <div className="flex items-center w-full justify-between pl-3 p-3 gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {organization.created_at && (
                <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                        Created{' '}
                        {new Date(organization.created_at).toLocaleDateString()}
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
                    <p>Edit organization</p>
                </TooltipContent>
            </Tooltip>
        </div>
    </div>
)
