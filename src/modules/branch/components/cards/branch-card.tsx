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

import {
    BankIcon,
    BuildingIcon,
    EmailIcon,
    PinLocationIcon as LocationIcon,
    PhoneIcon,
    ShopIcon,
    StarIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardHeader } from '@/components/ui/card'
import CardTopImage, { CardTopImageProps } from '@/components/ui/card-top-image'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

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

const formatAddress = (branch: IBranch): string => {
    return [
        branch.address,
        branch.barangay,
        branch.city,
        branch.province,
        branch.postal_code,
    ]
        .filter(Boolean)
        .join(', ')
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
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        case branchTypeEnum.BankingBranch:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        case branchTypeEnum.BusinessBranch:
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
}

export const BranchCardHeaderContent = ({
    branch,
    variant,
    showLocation,
    showContact,
}: BranchCardHeaderContentProps) => {
    const branchName = branch?.name || 'Unnamed Branch'
    const branchDescription = branch?.description || ''
    const fullAddress = formatAddress(branch)

    return (
        <div className="space-y-2">
            {/* Branch Name and Status */}
            <div className="flex items-start justify-between gap-2">
                <TooltipProvider>
                    <Tooltip delayDuration={500}>
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

                <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Main Branch Badge */}
                    {branch.is_main_branch && (
                        <Badge className="text-xs" variant="default">
                            <StarIcon className="h-3 w-3 mr-1" />
                            Main
                        </Badge>
                    )}
                </div>
            </div>

            {/* Branch Type Badge */}
            <div className="flex items-center gap-2 flex-wrap">
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

            {/* Contact Information */}
            {showContact && variant !== 'compact' && (
                <div className="space-y-1.5 text-xs text-muted-foreground">
                    {/* Email */}
                    {branch.email && (
                        <div className="flex items-center gap-2">
                            <EmailIcon className="h-3 w-3 flex-shrink-0" />
                            <Tooltip delayDuration={500}>
                                <TooltipTrigger asChild>
                                    <a
                                        className="truncate hover:text-primary transition-colors"
                                        href={`mailto:${branch.email}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {branch.email}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{branch.email}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}

                    {/* Phone */}
                    {branch.contact_number && (
                        <div className="flex items-center gap-2">
                            <PhoneIcon className="h-3 w-3 flex-shrink-0" />
                            <a
                                className="hover:text-primary transition-colors"
                                href={`tel:${branch.contact_number}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {branch.contact_number}
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* Location Information */}
            {showLocation && (
                <div className="space-y-1.5 text-xs text-muted-foreground">
                    {/* Full Address */}
                    <div className="flex items-start gap-2">
                        <LocationIcon className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        <Tooltip delayDuration={500}>
                            <TooltipTrigger asChild>
                                <span className="line-clamp-2 cursor-pointer hover:text-foreground transition-colors">
                                    {fullAddress}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <p>{fullAddress}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            )}
            <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                    <Tooltip delayDuration={700}>
                        <TooltipTrigger asChild>
                            <span className="line-clamp-2 cursor-pointer hover:text-foreground transition-colors">
                                {branchDescription}
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
                    <CardHeader className="p-2 pt-3">
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
                    </CardHeader>
                }
                imageAlt={`${branchName} branch`}
                imageSrc={branch.media?.download_url}
                onCardClick={onClick ? handleCardClick : undefined}
                onImageClick={onClick ? () => onClick(branch) : undefined}
            />
        </TooltipProvider>
    )
}
