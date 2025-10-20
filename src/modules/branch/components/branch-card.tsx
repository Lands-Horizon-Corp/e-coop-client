import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { IBranch, useDeleteBranch } from '@/modules/branch'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    EditPencilIcon,
    PinLocationIcon as LocationIcon,
    TrashIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import CardTopImage from '@/components/ui/card-top-image'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import TruncatedText from '@/components/ui/truncated-text'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

interface BranchCardProps {
    branch: IBranch
    organizationId: TEntityId
    isSeeding: boolean
    variant?: 'default' | 'compact' | 'detailed'
    showLocation?: boolean
    className?: string
    onCardClick?: (branch: IBranch) => void
}

export const BranchCard = ({
    branch,
    organizationId,
    isSeeding,
    variant = 'default',
    showLocation = true,
    className,
    onCardClick,
}: BranchCardProps) => {
    const updateModal = useModalState()
    const { onOpen } = useConfirmModalStore()
    const queryClient = useQueryClient()

    const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch({
        options: {
            onSuccess: () => {
                toast.success('Branch deleted successfully!')
                queryClient.invalidateQueries({
                    queryKey: [
                        'get-branches-by-organization-id',
                        organizationId,
                    ],
                })
            },
            onError: () => {
                toast.error('Failed to delete branch. Please try again.')
            },
        },
    })

    // Handle invalid branch data
    if (!branch || !branch.id) {
        return (
            <div
                className={cn(
                    'opacity-50 border border-dashed rounded-lg p-4',
                    className
                )}
            >
                <div className="text-center text-muted-foreground text-sm">
                    Invalid branch data
                </div>
            </div>
        )
    }

    const hasLocation = branch.latitude && branch.longitude
    const branchName = branch?.name || 'Unnamed Branch'
    const branchDescription = branch?.description || ''

    const handleDelete = () => {
        onOpen({
            title: 'Delete Branch',
            description: `Are you sure you want to delete "${branchName}"? This action cannot be undone.`,
            onConfirm: () => deleteBranch(branch.id),
            confirmString: 'Delete',
        })
    }

    const handleEdit = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        updateModal.onOpenChange(true)
    }

    const handleCardClick = () => {
        if (onCardClick && !isSeeding) {
            onCardClick(branch)
        }
    }

    const getImageSrc = () => {
        return branch.media?.url ?? '/placeholder-branch.jpg'
    }

    const renderCustomHeader = () => (
        <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h3
                                className={cn(
                                    'font-semibold text-foreground leading-tight',
                                    variant === 'compact'
                                        ? 'text-sm'
                                        : 'text-base',
                                    'truncate cursor-pointer'
                                )}
                            >
                                {branchName}
                            </h3>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{branchName}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Status Badge */}
                {branch.is_main_branch && (
                    <Badge className="text-xs flex-shrink-0" variant="default">
                        Main
                    </Badge>
                )}
            </div>

            {/* Branch Stats */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {showLocation && hasLocation && (
                    <div className="flex items-center gap-1">
                        <LocationIcon className="h-3 w-3" />
                        <span>Located</span>
                    </div>
                )}
            </div>

            {/* Description with Truncation */}
            {branchDescription && variant !== 'compact' && (
                <div className="text-sm text-muted-foreground">
                    <TruncatedText
                        className="text-sm"
                        maxLength={variant === 'detailed' ? 150 : 80}
                        showLessText="less"
                        showMoreText="more"
                        text={branchDescription}
                    />
                </div>
            )}
        </div>
    )

    const renderCustomFooter = () => (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {branch.created_at && (
                    <span>
                        Created{' '}
                        {new Date(branch.created_at).toLocaleDateString()}
                    </span>
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

    return (
        <TooltipProvider>
            <CreateUpdateBranchFormModal
                {...updateModal}
                className="w-full min-w-[80rem] max-w-[80rem]"
                description="Update branch information"
                formProps={{
                    organizationId,
                    branchId: branch.id,
                    hiddenFields: ['is_main_branch'],
                    defaultValues: branch,
                    onSuccess: () => {
                        updateModal.onOpenChange(false)
                        queryClient.invalidateQueries({
                            queryKey: [
                                'get-branches-by-organization-id',
                                organizationId,
                            ],
                        })
                        toast.success('Branch updated successfully!')
                    },
                }}
                title={`Update ${branchName}`}
            />

            <CardTopImage
                cardContentClassName="p-0"
                cardFooterClassName="pt-3 border-t"
                cardHeaderClassName="pb-3"
                className={cn(
                    'transition-all duration-200',
                    onCardClick &&
                        !isSeeding &&
                        'cursor-pointer hover:shadow-lg hover:scale-[1.02]',
                    isSeeding && 'opacity-60 cursor-not-allowed',
                    className
                )}
                customFooter={renderCustomFooter()}
                customHeader={renderCustomHeader()}
                imageAlt={`${branchName} branch`}
                imageClassName={cn(
                    'transition-transform duration-200',
                    onCardClick && 'hover:scale-105'
                )}
                imageSrc={getImageSrc()}
                onCardClick={handleCardClick}
                onImageClick={
                    onCardClick ? () => onCardClick(branch) : undefined
                }
                title="" // We'll use custom header
            />
        </TooltipProvider>
    )
}
