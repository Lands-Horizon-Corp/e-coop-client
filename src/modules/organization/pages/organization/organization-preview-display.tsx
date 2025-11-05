import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import {
    IOrganization,
    UpdateOrganizationFormModal,
} from '@/modules/organization'
import { BranchInfoItem } from '@/modules/organization/organization-forms/branch-card-info'

import {
    CalendarIcon,
    EditPencilIcon,
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

type OrganizationPreviewDisplayProps = {
    organization?: IOrganization
    onCreateBranch?: () => void
    isLoading?: boolean
    showActions?: boolean
    className?: string
    onClick?: () => void
    isEditMode?: boolean
}

const OrganizationPreviewDisplay = ({
    organization,
    onCreateBranch,
    isLoading,
    showActions = true,
    className,
}: OrganizationPreviewDisplayProps) => {
    const updateModal = useModalState(false)
    const queryClient = useQueryClient()

    if (isLoading) {
        return <OrganizationPreviewDisplaySkeleton />
    }

    if (!organization) {
        return null
    }
    const mediaUrl = organization?.cover_media?.download_url
    const categories = organization?.organization_categories ?? []
    const organizationId = organization?.id || ''
    const description =
        organization?.description || 'Organization description not available.'

    return (
        <TooltipProvider>
            <div>
                <div
                    className={cn(
                        'flex relative w-full bg-cover !h-[50vh] bg-center flex-col gap-y-2 ecoop-scroll max-h-screen',
                        className
                    )}
                    style={{
                        backgroundImage: `url(${mediaUrl})`,
                    }}
                >
                    <div className="  absolute w-full min-h-52 bottom-0 px-4 sm:px-8  bg-gradient-to-t from-background via-[80%] via-background/20  to-transparent" />
                </div>
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
                <div className=" w-full -mt-20 inset-0 z-30 px-4 sm:px-8">
                    {/* Organization Logo */}
                    <div className="mb-4 ">
                        <PreviewMediaWrapper media={organization?.media}>
                            <div className="relative">
                                <ImageDisplay
                                    className={cn(
                                        'object-cover hover:border-2 hover:border-primary/50 transition-all duration-200 rounded-2xl size-30'
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
                                                'font-sans font-black  !leading-[52px] cursor-pointer hover:text-primary/80 transition-colors text-[min(50px,8vw)]'
                                            )}
                                        >
                                            {organization?.name}
                                        </h1>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{organization?.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                                </div>
                            </div>
                            <>
                                <div className="text-muted-foreground mt-3">
                                    <TruncatedText
                                        className="text-muted-foreground !bg-inherit max-h-24 overflow-auto ecoop-scroll text-sm sm:text-base"
                                        maxLength={250}
                                        showLessText="Read less"
                                        showMoreText="Read more"
                                        text={description}
                                    />
                                </div>
                            </>
                        </div>
                        <div className="flex-1 relative flex-col !h-full space-y-1">
                            <div className="flex ecoop-scroll max-h-54 overflow-x-auto flex-wrap gap-1">
                                <div className="pointer-events-none absolute top-42 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background" />
                                <BranchInfoItem
                                    className="w-full"
                                    content={
                                        <div className="flex gap-2 ">
                                            <Badge variant="secondary">
                                                {organization?.subscription_plan
                                                    ?.name ||
                                                    'No plan selected'}
                                            </Badge>
                                        </div>
                                    }
                                    contentClassName="translate-y-1 "
                                    iconClassName="size-4 text-muted-foreground"
                                    textAlign="left"
                                    title="Plan:"
                                    TitleIcon={StarIcon}
                                />
                                <span className="text-xs font-semibold">
                                    Categories:
                                    <TagIcon className="inline-block ml-1 mb-0.5 size-4 text-muted-foreground" />
                                </span>
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
                        </div>
                        <div className="flex-1 hidden flex-col !h-full space-y-1">
                            <div className="flex ecoop-scroll max-h-42 overflow-x-auto flex-wrap gap-1">
                                <div className="sticky top-28 bg-gradient-to-b from-transparent to-background bg-red-500 h-16  w-full" />
                                <BranchInfoItem
                                    className="w-full"
                                    content={
                                        <div className="flex gap-2 ">
                                            <Badge variant="secondary">
                                                {organization?.subscription_plan
                                                    ?.name ||
                                                    'No plan selected'}
                                            </Badge>
                                        </div>
                                    }
                                    contentClassName="translate-y-1 "
                                    iconClassName="size-4 text-muted-foreground"
                                    textAlign="left"
                                    title="Plan:"
                                    TitleIcon={StarIcon}
                                />
                                <span className="text-xs font-semibold">
                                    Categories:
                                    <TagIcon className="inline-block ml-1 mb-0.5 size-4 text-muted-foreground" />
                                </span>
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
                        </div>
                    </div>

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

export const OrganizationPreviewDisplaySkeleton = ({
    className,
}: {
    className?: string
}) => {
    return (
        <div
            className={cn(
                'flex relative w-full min-w-3xl bg-secondary rounded-t-4xl animate-pulse',
                className
            )}
        >
            <div className="absolute w-full bottom-0 pb-10 px-4 sm:px-8 pt-20 sm:pt-50 bg-gradient-to-t from-background via-background/95 via-30% to-transparent">
                <div className="mb-4">
                    <Skeleton className="size-24 rounded-xl mb-2 " />
                    <div className="flex gap-4 mb-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
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
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-40" />
                </div>
            </div>
        </div>
    )
}

export default OrganizationPreviewDisplay
