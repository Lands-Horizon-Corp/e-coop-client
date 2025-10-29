import { cn } from '@/helpers/tw-utils'
import { IOrganization } from '@/modules/organization'

import { CalendarIcon, EyeIcon, TagIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CardTopImage from '@/components/ui/card-top-image'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import TruncatedText from '@/components/ui/truncated-text'

import { useModalState } from '@/hooks/use-modal-state'

import OrganizationPreviewModal from './organization-modal'

interface OrganizationItemProps {
    organization: IOrganization
    variant?: 'netflix' | 'grid' | 'list'
    className?: string
    onJoin?: (organization: IOrganization) => void
    onCreateBranch?: (organization: IOrganization) => void
}

export const OrganizationItem = ({
    organization,
    variant = 'netflix',
    className,
    onJoin,
    onCreateBranch,
}: OrganizationItemProps) => {
    const organizationModal = useModalState()
    const handleCardClick = () => {
        organizationModal.onOpenChange(true)
    }

    const handleCreateBranch = (org: IOrganization) => {
        if (onCreateBranch) {
            onCreateBranch(org)
        }
        organizationModal.onOpenChange(false)
    }

    const getImageSrc = () => {
        return (
            organization?.cover_media?.url ||
            organization?.media?.download_url ||
            '/placeholder-org-cover.jpg'
        )
    }

    const organizationName = organization?.name || 'Unnamed Organization'
    const categories = organization?.organization_categories ?? []

    const renderNetflixHeader = () => (
        <div className="space-y-2">
            {/* Organization Name and Verification */}
            <div className="flex items-start justify-between gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h3 className="font-semibold text-base text-foreground leading-tight truncate cursor-pointer">
                                {organizationName}
                            </h3>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{organizationName}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {categories.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                    <TagIcon className="h-3 w-3 text-muted-foreground" />
                    {categories.slice(0, 2).map((catItem) => (
                        <Badge
                            className="text-xs px-1.5 py-0.5"
                            key={catItem.id}
                            variant="outline"
                        >
                            {catItem.category?.name}
                        </Badge>
                    ))}
                    {categories.length > 2 && (
                        <Badge
                            className="text-xs px-1.5 py-0.5"
                            variant="outline"
                        >
                            +{categories.length - 2}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    )

    const renderGridHeader = () => (
        <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h3 className="font-semibold text-lg text-foreground leading-tight truncate cursor-pointer">
                                {organizationName}
                            </h3>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{organizationName}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {organization.description && (
                <TruncatedText
                    className="text-sm text-muted-foreground"
                    maxLength={100}
                    showLessText="less"
                    showMoreText="more"
                    text={organization.description}
                />
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {organization.subscription_plan && (
                    <Badge className="text-xs" variant="secondary">
                        {organization.subscription_plan.name}
                    </Badge>
                )}

                {organization.created_at && (
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                            {new Date(organization.created_at).getFullYear()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )

    const renderListHeader = () => (
        <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base truncate">
                        {organizationName}
                    </h3>
                </div>

                {organization.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {organization.description}
                    </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                    {categories.slice(0, 3).map((catItem) => (
                        <Badge
                            className="text-xs px-1.5 py-0.5"
                            key={catItem.id}
                            variant="outline"
                        >
                            {catItem.category?.name}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderFooter = () => (
        <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
                {organization.created_at && (
                    <span>
                        Since {new Date(organization.created_at).getFullYear()}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    className="text-xs"
                    onClick={(e) => {
                        e.stopPropagation()
                        organizationModal.onOpenChange(true)
                    }}
                    size="sm"
                    variant="outline"
                >
                    <EyeIcon className="h-3 w-3 mr-1" />
                    View
                </Button>

                <Button
                    className="text-xs"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (onJoin) onJoin(organization)
                    }}
                    size="sm"
                >
                    Join
                </Button>
            </div>
        </div>
    )

    if (variant === 'netflix') {
        return (
            <>
                <OrganizationPreviewModal
                    organization={organization}
                    {...organizationModal}
                    onCreateBranch={handleCreateBranch}
                />
                <div
                    className={cn(
                        'group relative transition-all duration-300 ease-out',
                        'hover:scale-110 hover:z-20',
                        'min-w-[280px] max-w-[280px]',
                        className
                    )}
                    // onMouseEnter={() => setIsHovered(true)}
                    // onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Main Card */}
                    <CardTopImage
                        cardContentClassName="p-0"
                        cardFooterClassName="pt-3 border-t"
                        cardHeaderClassName="pb-3"
                        className={cn(
                            'transition-all duration-300 cursor-pointer'
                        )}
                        customFooter={renderFooter()}
                        customHeader={renderNetflixHeader()}
                        imageAlt={`${organizationName} cover`}
                        imageClassName="transition-transform duration-300 hover:scale-105"
                        imageSrc={getImageSrc()}
                        onCardClick={handleCardClick}
                        onImageClick={handleCardClick}
                        title=""
                    />
                </div>
            </>
        )
    }

    // Grid variant
    if (variant === 'grid') {
        return (
            <>
                <div
                    className={cn('transition-all hover:scale-105', className)}
                >
                    <CardTopImage
                        cardContentClassName="p-0"
                        cardFooterClassName="pt-3 border-t"
                        cardHeaderClassName="pb-3"
                        className="cursor-pointer"
                        customFooter={renderFooter()}
                        customHeader={renderGridHeader()}
                        imageAlt={`${organizationName} cover`}
                        imageClassName="transition-transform duration-200 hover:scale-105"
                        imageSrc={getImageSrc()}
                        onCardClick={handleCardClick}
                        onImageClick={handleCardClick}
                        title=""
                    />
                </div>
                <OrganizationPreviewModal
                    organization={organization}
                    {...organizationModal}
                    onCreateBranch={handleCreateBranch}
                />
            </>
        )
    }

    // List variant
    return (
        <>
            <div className={cn('w-full', className)}>
                <CardTopImage
                    cardContentClassName="p-0"
                    cardFooterClassName="pt-2 border-t"
                    cardHeaderClassName="pb-2"
                    className="cursor-pointer h-24"
                    customFooter={renderFooter()}
                    customHeader={renderListHeader()}
                    imageAlt={`${organizationName} cover`}
                    imageClassName="h-16 w-16 rounded-lg object-cover"
                    imageSrc={getImageSrc()}
                    onCardClick={handleCardClick}
                    onImageClick={handleCardClick}
                    title=""
                />
            </div>
            <OrganizationPreviewModal
                organization={organization}
                {...organizationModal}
                onCreateBranch={handleCreateBranch}
            />
        </>
    )
}

export default OrganizationItem
