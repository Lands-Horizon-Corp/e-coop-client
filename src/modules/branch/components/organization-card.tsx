import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import {
    IOrganization,
    UpdateOrganizationFormModal,
} from '@/modules/organization'
import { BranchInfoItem } from '@/modules/organization/organization-forms/branch-card-info'

import {
    BuildingIcon,
    CalendarIcon,
    EditPencilIcon,
    PinLocationIcon as LocationIcon,
    EmailIcon as MailIcon,
    PhoneIcon,
    PlusIcon,
    StarIcon,
    TagIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import TruncatedText from '@/components/ui/truncated-text'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

type OrganizationCardProps = {
    organization?: IOrganization
    onCreateBranch?: () => void
    isLoading?: boolean
    variant?: 'default' | 'compact' | 'detailed'
    showActions?: boolean
    className?: string
}

const OrganizationCard = ({
    organization,
    onCreateBranch,
    isLoading,
    variant = 'default',
    showActions = true,
    className,
}: OrganizationCardProps) => {
    const updateModal = useModalState(false)
    const queryClient = useQueryClient()

    if (isLoading) {
        return <OrganizationCardSkeleton variant={variant} />
    }

    if (!organization) {
        return null
    }

    const mediaUrl = organization?.cover_media?.url
    const categories = organization?.organization_categories ?? []
    const organizationId = organization?.id || ''
    const description =
        organization?.description || 'Organization description not available.'

    // const branchCount = organization?.branches_count || 0
    // const memberCount = organization?.members_count || 0

    const getContainerHeight = () => {
        switch (variant) {
            case 'compact':
                return 'h-[60vh]'
            case 'detailed':
                return 'h-[90vh]'
            default:
                return 'h-[80vh]'
        }
    }

    const getImageSize = () => {
        switch (variant) {
            case 'compact':
                return 'size-20'
            case 'detailed':
                return 'size-40'
            default:
                return 'size-30'
        }
    }

    const getTextSize = () => {
        switch (variant) {
            case 'compact':
                return 'text-[min(32px,6vw)]'
            case 'detailed':
                return 'text-[min(60px,10vw)]'
            default:
                return 'text-[min(50px,8vw)]'
        }
    }

    return (
        <TooltipProvider>
            <div
                className={cn(
                    'flex relative w-full bg-fixed bg-cover rounded-t-4xl bg-top flex-col gap-y-2 ecoop-scroll overflow-y-auto',
                    getContainerHeight(),
                    'max-h-screen',
                    className
                )}
                style={{
                    backgroundImage: `url(${mediaUrl})`,
                }}
            >
                <UpdateOrganizationFormModal
                    {...updateModal}
                    className="w-full min-w-[70rem] max-w-[80rem]"
                    formProps={{
                        organizationId,
                        defaultValues: organization,
                        coverMedia: organization?.cover_media,
                        media: organization?.media,
                        onSuccess: () => {
                            updateModal.onOpenChange(false)
                            queryClient.invalidateQueries({
                                queryKey: ['organization'],
                            })
                            toast.success('Organization updated successfully!')
                        },
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute w-full bottom-0 pb-10 overflow-auto h-fit px-4 sm:px-8 pt-20 sm:pt-50 bg-gradient-to-t from-background via-background/95 via-30% to-transparent">
                    {/* Organization Logo */}
                    <div className="mb-4">
                        <PreviewMediaWrapper media={organization?.media}>
                            <div className="relative">
                                <ImageDisplay
                                    className={cn(
                                        'object-cover hover:border-2 hover:border-primary/50 transition-all duration-200 rounded-2xl',
                                        getImageSize()
                                    )}
                                    src={
                                        organization?.media?.download_url ||
                                        '/placeholder-org-logo.jpg'
                                    }
                                />
                            </div>
                        </PreviewMediaWrapper>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        {/* Organization Name & Basic Info */}
                        <div className="flex-2">
                            <div className="space-y-3">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <h1
                                            className={cn(
                                                'font-sans font-black leading-tight cursor-pointer',
                                                getTextSize(),
                                                'hover:text-primary/80 transition-colors'
                                            )}
                                        >
                                            {organization?.name}
                                        </h1>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{organization?.name}</p>
                                    </TooltipContent>
                                </Tooltip>

                                {/* Organization Stats */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    {/* Note: Branch and member counts not available in IOrganization type */}
                                    {/* {branchCount > 0 && (
                                        <div className="flex items-center gap-1">
                                            <BuildingIcon className="h-4 w-4" />
                                            <span>{branchCount} {branchCount === 1 ? 'branch' : 'branches'}</span>
                                        </div>
                                    )}
                                    
                                    {memberCount > 0 && (
                                        <div className="flex items-center gap-1">
                                            <UsersIcon className="h-4 w-4" />
                                            <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
                                        </div>
                                    )} */}

                                    {organization?.created_at && (
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>
                                                Since{' '}
                                                {new Date(
                                                    organization.created_at
                                                ).getFullYear()}
                                            </span>
                                        </div>
                                    )}

                                    {/* Organization Key */}
                                    <div className="flex items-center gap-1">
                                        <BuildingIcon className="h-4 w-4" />
                                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                            {organization.organization_key}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Organization Details */}
                        <div className="flex-1 space-y-3">
                            {/* Categories */}
                            <BranchInfoItem
                                className=""
                                content={
                                    categories.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            <TagIcon className="h-4 w-4 text-muted-foreground mr-1" />
                                            {categories.map((catItem) => (
                                                <Badge
                                                    className="mr-1 mb-1"
                                                    key={catItem.id}
                                                    variant="secondary"
                                                >
                                                    {catItem.category?.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <TagIcon className="h-4 w-4" />
                                            <span>No categories selected</span>
                                        </div>
                                    )
                                }
                                contentClassName="flex items-center"
                                textAlign="left"
                                title="Categories:"
                            />

                            {/* Subscription Plan */}
                            <BranchInfoItem
                                content={
                                    <div className="flex items-center gap-2">
                                        <StarIcon className="h-4 w-4 text-muted-foreground" />
                                        <Badge variant="secondary">
                                            {organization?.subscription_plan
                                                ?.name || 'No plan selected'}
                                        </Badge>
                                    </div>
                                }
                                contentClassName="translate-y-1"
                                title="Plan:"
                            />

                            {/* Database Migration Status */}
                            {variant === 'detailed' &&
                                organization?.database_migration_status && (
                                    <BranchInfoItem
                                        content={
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={cn(
                                                        'h-2 w-2 rounded-full',
                                                        organization.database_migration_status ===
                                                            'completed' &&
                                                            'bg-green-500',
                                                        organization.database_migration_status ===
                                                            'pending' &&
                                                            'bg-yellow-500',
                                                        organization.database_migration_status ===
                                                            'migrating' &&
                                                            'bg-blue-500',
                                                        organization.database_migration_status ===
                                                            'error' &&
                                                            'bg-red-500'
                                                    )}
                                                />
                                                <span className="text-sm capitalize">
                                                    {
                                                        organization.database_migration_status
                                                    }
                                                </span>
                                            </div>
                                        }
                                        title="Status:"
                                    />
                                )}

                            {/* Contact Information */}
                            {variant === 'detailed' && (
                                <>
                                    {organization?.email && (
                                        <BranchInfoItem
                                            content={
                                                <div className="flex items-center gap-2">
                                                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                                                    <a
                                                        className="text-primary hover:underline text-sm"
                                                        href={`mailto:${organization.email}`}
                                                    >
                                                        {organization.email}
                                                    </a>
                                                </div>
                                            }
                                            title="Email:"
                                        />
                                    )}

                                    {organization?.contact_number && (
                                        <BranchInfoItem
                                            content={
                                                <div className="flex items-center gap-2">
                                                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                                    <a
                                                        className="text-primary hover:underline text-sm"
                                                        href={`tel:${organization.contact_number}`}
                                                    >
                                                        {
                                                            organization.contact_number
                                                        }
                                                    </a>
                                                </div>
                                            }
                                            title="Phone:"
                                        />
                                    )}

                                    {organization?.address && (
                                        <BranchInfoItem
                                            content={
                                                <div className="flex items-start gap-2">
                                                    <LocationIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm">
                                                        {organization.address}
                                                    </span>
                                                </div>
                                            }
                                            title="Address:"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {variant !== 'compact' && (
                        <>
                            <Separator className="mb-4" />
                            <div className="text-muted-foreground">
                                <TruncatedText
                                    className="text-muted-foreground text-sm sm:text-base"
                                    maxLength={
                                        variant === 'detailed' ? 400 : 250
                                    }
                                    showLessText="Read less"
                                    showMoreText="Read more"
                                    text={description}
                                />
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    {showActions && (
                        <>
                            <Separator className="mt-4 mb-4" />
                            <div className="flex flex-col sm:flex-row gap-2">
                                {onCreateBranch && (
                                    <Button
                                        className="flex-1 sm:flex-initial"
                                        onClick={onCreateBranch}
                                        size="sm"
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add Branch
                                    </Button>
                                )}

                                <Button
                                    className="flex-1 sm:flex-initial"
                                    onClick={() =>
                                        updateModal.onOpenChange(true)
                                    }
                                    size="sm"
                                    variant="secondary"
                                >
                                    <EditPencilIcon className="mr-2 h-4 w-4" />
                                    Edit Organization
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </TooltipProvider>
    )
}

const OrganizationCardSkeleton = ({
    variant = 'default',
}: {
    variant?: 'default' | 'compact' | 'detailed'
}) => {
    const getContainerHeight = () => {
        switch (variant) {
            case 'compact':
                return 'h-[60vh]'
            case 'detailed':
                return 'h-[90vh]'
            default:
                return 'h-[80vh]'
        }
    }

    const getImageSize = () => {
        switch (variant) {
            case 'compact':
                return 'size-20'
            case 'detailed':
                return 'size-40'
            default:
                return 'size-30'
        }
    }

    return (
        <div
            className={cn(
                'flex relative w-full bg-gray-200 rounded-t-4xl animate-pulse',
                getContainerHeight()
            )}
        >
            <div className="absolute w-full bottom-0 pb-10 px-4 sm:px-8 pt-20 sm:pt-50 bg-gradient-to-t from-background via-background/95 via-30% to-transparent">
                {/* Logo Skeleton */}
                <Skeleton className={cn('mb-4 rounded-2xl', getImageSize())} />

                {/* Title Skeleton */}
                <div className="mb-4">
                    <Skeleton className="h-8 sm:h-12 w-3/4 mb-2" />
                    <div className="flex gap-4 mb-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                        {variant === 'detailed' && (
                            <>
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-5/6" />
                                <Skeleton className="h-6 w-4/5" />
                            </>
                        )}
                    </div>
                </div>

                {/* Description Skeleton */}
                {variant !== 'compact' && (
                    <div className="space-y-2 mb-6">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                )}

                {/* Actions Skeleton */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-40" />
                </div>
            </div>
        </div>
    )
}

export default OrganizationCard
