import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import {
    IBranch,
    PolicyAcceptanceModal,
    branchTypeEnum,
    useDeleteBranch,
} from '@/modules/branch'
import CreateUpdateBranchFormModal from '@/modules/branch/components/forms/create-branch-form'
import { useGetOrganizationWithPoliciesById } from '@/modules/organization'
import {
    useCanUserCanJoinBranch,
    useJoinOrganization,
} from '@/modules/user-organization'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { BankIcon, BuildingIcon, ShopIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import CardTopImage, { CardTopImageProps } from '@/components/ui/card-top-image'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import TruncatedText from '@/components/ui/truncated-text'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { BranchCardFooter } from './branch-card-footer'

interface BranchCardProps extends CardTopImageProps {
    branch: IBranch
    organizationId: TEntityId
    isSeeding?: boolean
    variant?: 'default' | 'compact' | 'detailed'
    showLocation?: boolean
    showContact?: boolean
    className?: string
    onClick?: (branch: IBranch) => void
    showActions?: boolean
    showJoinBranch?: boolean
}

interface BranchCardHeaderContentProps {
    branch: IBranch
    variant: 'default' | 'compact' | 'detailed'
    showLocation: boolean
    showContact: boolean
}

const getBranchTypeIcon = (type: branchTypeEnum) => {
    switch (type) {
        case branchTypeEnum.CooperativeBranch:
            return <BuildingIcon className="h-3 w-3" />
        case branchTypeEnum.BankingBranch:
            return <BankIcon className="h-3 w-3" />
        case branchTypeEnum.BusinessBranch:
            return <ShopIcon className="h-3 w-3" />
        default:
            return <BuildingIcon className="h-3 w-3" />
    }
}

const getBranchTypeColor = (type: branchTypeEnum) => {
    switch (type) {
        case branchTypeEnum.CooperativeBranch:
            return 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
        case branchTypeEnum.BankingBranch:
            return 'border bg-background shadow-xs hover:bg-accent hover: dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
        case branchTypeEnum.BusinessBranch:
            return 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80'
        default:
            return 'bg-primary/20 text-primary shadow-xs hover:border-[1px] border-primary border-[.6px]'
    }
}

export const BranchCardHeaderContent = ({
    branch,
}: BranchCardHeaderContentProps) => {
    const branchName = branch?.name || 'Unnamed Branch'
    const branchDescription = branch?.description || ''

    return (
        <div className="space-y-2 w-full">
            <div className="inline-flex items-start min-w-0 max-w-full w-full justify-between gap-2">
                <TooltipProvider>
                    <Tooltip delayDuration={500}>
                        <TooltipTrigger asChild>
                            <p
                                className={cn(
                                    'font-semibold truncate min-w-0 text-foreground leading-tight'
                                )}
                            >
                                {branchName} asfasfasdfasdf asdfas dfsaf sad
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{branchName}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className=" gap-2 min-w-fit">
                    <div
                        className={cn(
                            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                            getBranchTypeColor(branch.type)
                        )}
                    >
                        {getBranchTypeIcon(branch.type)}
                        <span className="capitalize">
                            {branch.type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                    </div>
                </div>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                    <Tooltip delayDuration={700}>
                        <TooltipTrigger asChild>
                            <span className="line-clamp-2 cursor-pointer hover:text-foreground transition-colors">
                                <TruncatedText text={branchDescription} />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm text-pirmary bg-background border py-2">
                            <p>{branchDescription}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export const BranchCard = ({
    branch,
    organizationId,
    isSeeding,
    variant = 'default',
    showLocation = true,
    showContact = true,
    className,
    onClick,
    showActions = true,
    showJoinBranch = false,
}: BranchCardProps) => {
    const navigate = useNavigate()
    const updateModal = useModalState()
    const queryClient = useQueryClient()
    const { onOpen } = useConfirmModalStore()
    const { open, onOpenChange } = useModalState()

    const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null)

    const { data: organizationWithPolicies, isPending: isPendingOrganization } =
        useGetOrganizationWithPoliciesById({
            organizationId: organizationId,
            options: { enabled: !!organizationId },
        })

    const { data: isUserCanJoin } = useCanUserCanJoinBranch({
        organizationId: organizationId,
        branchId: branch.id,
    })

    const { mutate: JoinOrganization } = useJoinOrganization({
        onSuccess: () => {
            toast.success('You have successfully joined the organization')
            navigate({ to: `/onboarding` as string })
        },
        onError: () => {
            toast.error('Failed to join organization. Please try again.')
        },
    })

    const handleJoinClick = (branch: IBranch) => {
        if (!organizationId) {
            toast.error('Missing Organization Id. Cannot proceed.')
            return
        }
        setSelectedBranch(branch)
        onOpenChange(true)
    }

    const handleAcceptAndProceed = () => {
        if (selectedBranch) {
            JoinOrganization({
                organizationId: organizationId,
                branchId: selectedBranch.id,
            })
            onOpenChange(false)
        }
    }
    const branchName = branch?.name || 'Unnamed Branch'

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
        if (onClick && !isSeeding) {
            onClick(branch)
        }
    }

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
            {organizationWithPolicies && (
                <PolicyAcceptanceModal
                    branchName={selectedBranch?.name ?? ''}
                    onAccept={handleAcceptAndProceed}
                    onCancel={() => onOpenChange(false)}
                    onOpenChange={onOpenChange}
                    open={open}
                    organization={organizationWithPolicies}
                />
            )}
            <CardTopImage
                cardFooter={
                    <BranchCardFooter
                        branch={branch}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        isDeleting={isDeleting}
                        isSeeding={isSeeding}
                        showActions={showActions}
                    />
                }
                className={cn('cursor-pointer', className)}
                customHeader={
                    <>
                        <BranchCardHeaderContent
                            branch={branch}
                            showContact={showContact}
                            showLocation={showLocation}
                            variant={variant}
                        />
                        {showJoinBranch && (
                            <Button
                                className="mt-2 w-full"
                                disabled={
                                    !isUserCanJoin || isPendingOrganization
                                }
                                onClick={() => {
                                    handleJoinClick(branch)
                                }}
                            >
                                {isPendingOrganization
                                    ? 'Joining...'
                                    : 'Join Branch'}
                            </Button>
                        )}
                    </>
                }
                imageAlt={`${branchName} branch`}
                imageSrc={branch.media?.download_url}
                onCardClick={onClick ? handleCardClick : undefined}
                onImageClick={onClick ? () => onClick(branch) : undefined}
            />
        </TooltipProvider>
    )
}
