import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import {
    IOrganization,
    UpdateOrganizationFormModal,
} from '@/modules/organization'

import {
    BuildingIcon,
    CalendarIcon,
    EditPencilIcon,
    EmailIcon,
    PhoneIcon,
    CreditCardIcon as SubscriptionIcon,
    TagIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import CardTopImage from '@/components/ui/card-top-image'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { useModalState } from '@/hooks/use-modal-state'

interface OrganizationMiniCardProps {
    organization: IOrganization
    isSeeding?: boolean
    variant?: 'default' | 'compact' | 'detailed'
    showContact?: boolean
    showSubscription?: boolean
    showCategories?: boolean
    className?: string
    onCardClick?: (organization: IOrganization) => void
    showActions?: boolean
}

export const OrganizationMiniCard = ({
    organization,
    isSeeding = false,
    variant = 'default',
    showContact = true,
    showSubscription = true,
    showCategories = true,
    className,
    onCardClick,
    showActions = true,
}: OrganizationMiniCardProps) => {
    const updateModal = useModalState()
    const queryClient = useQueryClient()
    if (!organization || !organization.id) {
        return (
            <div
                className={cn(
                    'opacity-50 border border-dashed rounded-lg p-4',
                    className
                )}
            >
                <div className="text-center text-muted-foreground text-sm">
                    Invalid organization data
                </div>
            </div>
        )
    }

    const organizationName = organization?.name || 'Unnamed Organization'
    const organizationDescription = organization?.description || ''

    const getSubscriptionBadge = () => {
        if (!organization.subscription_plan) return null

        const isPlanhasPro = organization.subscription_plan.name
            .toLowerCase()
            .includes('pro')

        const isEnterprise = organization.subscription_plan.name
            .toLowerCase()
            .includes('enterprise')

        const variant = isEnterprise
            ? 'success'
            : isPlanhasPro
              ? 'default'
              : 'outline'

        return (
            <Badge className="text-xs" variant={variant}>
                <SubscriptionIcon className="h-3 w-3 mr-1" />
                {organization.subscription_plan.name}
            </Badge>
        )
    }

    const handleEdit = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        updateModal.onOpenChange(true)
    }

    const handleCardClick = () => {
        if (onCardClick && !isSeeding) {
            onCardClick(organization)
        }
    }

    const getImageSrc = () => {
        return (
            organization.media?.download_url ?? '/placeholder-organization.jpg'
        )
    }
    const CustomHeader = () => (
        <div className="space-y-3 !h-full">
            {/* Organization Name and Subscription */}
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
                                {organizationName}
                            </h3>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{organizationName}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Subscription Badge */}
                    {showSubscription && getSubscriptionBadge()}
                </div>
            </div>
            {/* Categories */}
            {showCategories &&
                organization.organization_categories &&
                organization.organization_categories.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                        <TagIcon className="h-3 w-3 text-muted-foreground" />
                        {organization.organization_categories
                            .slice(0, 3)
                            .map((orgCat, index) => (
                                <Badge
                                    className="text-xs"
                                    key={index}
                                    variant="outline"
                                >
                                    {orgCat.category?.name}
                                </Badge>
                            ))}
                        {organization.organization_categories.length > 3 && (
                            <Badge className="text-xs" variant="outline">
                                +
                                {organization.organization_categories.length -
                                    3}
                            </Badge>
                        )}
                    </div>
                )}

            {/* Contact Information */}
            {showContact && variant !== 'compact' && (
                <div className="space-y-1.5 text-xs text-muted-foreground">
                    {/* Email */}
                    {organization.email && (
                        <div className="flex items-center gap-2">
                            <EmailIcon className="h-3 w-3 flex-shrink-0" />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        className="truncate hover:text-primary transition-colors"
                                        href={`mailto:${organization.email}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {organization.email}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{organization.email}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}

                    {/* Phone */}
                    {organization.contact_number && (
                        <div className="flex items-center gap-2">
                            <PhoneIcon className="h-3 w-3 flex-shrink-0" />
                            <a
                                className="hover:text-primary transition-colors"
                                href={`tel:${organization.contact_number}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {organization.contact_number}
                            </a>
                        </div>
                    )}

                    {/* Address */}
                    {organization.address && (
                        <div className="flex items-start gap-2">
                            <BuildingIcon className="h-3 w-3 flex-shrink-0 mt-0.5" />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="line-clamp-2 cursor-pointer hover:text-foreground transition-colors">
                                        {organization.address}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>{organization.address}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </div>
            )}

            {/* Subscription Period */}
            {showSubscription &&
                organization.subscription_plan &&
                variant !== 'compact' && (
                    <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                            <span>
                                {new Date(
                                    organization.subscription_start_date
                                ).toLocaleDateString()}{' '}
                                -{' '}
                                {new Date(
                                    organization.subscription_end_date
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                )}
            <div className="space-y-1.5 text-xs text-muted-foreground h-full">
                <div className="flex items-start gap-2  h-full">
                    <Tooltip delayDuration={700}>
                        <TooltipTrigger asChild>
                            <span className="line-clamp-4 cursor-pointer hover:text-foreground transition-colors">
                                {organizationDescription}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm bg-background border py-2">
                            <p>{organizationDescription}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    )

    const CustomFooter = () => (
        <div className="flex items-center w-full justify-between pl-3 p-3 gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {organization.created_at && (
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                            Created{' '}
                            {new Date(
                                organization.created_at
                            ).toLocaleDateString()}
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

    return (
        <TooltipProvider>
            <UpdateOrganizationFormModal
                {...updateModal}
                className="w-full min-w-[80rem] max-w-[80rem]"
                description="Update organization information"
                formProps={{
                    organizationId: organization.id,
                    defaultValues: organization,
                    onSuccess: () => {
                        updateModal.onOpenChange(false)
                        queryClient.invalidateQueries({
                            queryKey: ['get-all-organizations'],
                        })
                        toast.success('Organization updated successfully!')
                    },
                }}
                title={`Update ${organizationName}`}
            />

            <CardTopImage
                cardHeaderClassName="!h-full"
                className={cn(
                    'transition-all duration-200',
                    onCardClick &&
                        'cursor-pointer hover:shadow-lg hover:scale-[1.02]',
                    className
                )}
                customFooter={showActions ? CustomFooter() : null}
                customHeader={CustomHeader()}
                imageAlt={`${organizationName} organization`}
                imageSrc={getImageSrc()}
                onCardClick={handleCardClick}
                onImageClick={
                    onCardClick ? () => onCardClick(organization) : undefined
                }
            />
        </TooltipProvider>
    )
}
