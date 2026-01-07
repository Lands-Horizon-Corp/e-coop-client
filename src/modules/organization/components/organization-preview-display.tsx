import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import {
    IOrganization,
    UpdateOrganizationFormModal,
} from '@/modules/organization'
import OrganizationMedia from '@/modules/organization-media/components/organization-media'
import { BranchInfoItem } from '@/modules/organization/organization-forms/branch-card-info'

import {
    CalendarIcon,
    EditPencilIcon,
    FacebookIcon,
    GlobeIcon,
    InstagramIcon,
    LinkIcon,
    PlusIcon,
    StarIcon,
    TagIcon,
    XTwitterIcon,
    YoutubeIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import TruncatedText from '@/components/ui/truncated-text'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import OrganizationPreviewDisplaySkeleton from './organization-preview-display-skeleton'

type OrganizationPreviewDisplayProps = {
    organization?: IOrganization
    onCreateBranch?: () => void
    isLoading?: boolean
    showActions?: boolean
    className?: string
    onClick?: () => void
    isEditMode?: boolean
}

export const OrganizationPreviewDisplay = ({
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
                        'flex relative w-full mask-b-from-70% mask-b-to-95% rounded-lg bg-cover !h-[50vh] bg-center ecoop-scroll max-h-screen',
                        className
                    )}
                    style={{
                        backgroundImage: `url(${mediaUrl})`,
                    }}
                >
                    <div className="absolute w-full min-h-52 bottom-0 px-4 sm:px-8  bg-gradient-to-t from-background via-[80%] via-background/20  to-transparent" />
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
                        <div className="flex-1 relative flex-col !h-full space-y-2">
                            <div className="flex mask-b-from-50% mask-b-to-95% ecoop-scroll max-h-54 overflow-x-auto flex-wrap gap-1">
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
                                {categories.length > 0 && (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold">
                            Socials{' '}
                            <LinkIcon className="inline ml-1" size={20} />
                        </p>
                        <div className="flex flex-wrap space-x-2 gap-2">
                            {organization?.personal_website_link && (
                                <div className="flex items-center gap-x-2">
                                    <GlobeIcon />
                                    <a
                                        className="text-sm max-w-50 truncate text-muted-foreground hover:text-primary hover:underline break-all"
                                        href={
                                            organization.personal_website_link
                                        }
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {organization.personal_website_link}
                                    </a>
                                </div>
                            )}
                            {organization?.facebook_link && (
                                <div className="flex items-center gap-x-2">
                                    <FacebookIcon />
                                    <a
                                        className="text-sm  max-w-50 truncate text-muted-foreground hover:text-primary hover:underline break-all"
                                        href={organization.facebook_link}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {organization.facebook_link}
                                    </a>
                                </div>
                            )}
                            {organization?.x_link && (
                                <div className="flex items-center gap-x-2">
                                    <XTwitterIcon />
                                    <a
                                        className="text-sm max-w-50 truncate text-muted-foreground hover:text-primary hover:underline break-all"
                                        href={organization.x_link}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {organization.x_link}
                                    </a>
                                </div>
                            )}
                            {organization?.instagram_link && (
                                <div className="flex items-center gap-x-2">
                                    <InstagramIcon />
                                    <a
                                        className="text-sm max-w-50 truncate text-muted-foreground hover:text-primary hover:underline break-all"
                                        href={organization.instagram_link}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {organization.instagram_link}
                                    </a>
                                </div>
                            )}
                            {organization?.youtube_link && (
                                <div className="flex items-center gap-x-2">
                                    <YoutubeIcon />
                                    <a
                                        className="text-sm max-w-50 truncate text-muted-foreground hover:text-primary hover:underline break-all"
                                        href={organization.youtube_link}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        {organization.youtube_link}
                                    </a>
                                </div>
                            )}
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
                                <OrganizationMedia
                                    organizationId={organizationId}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </TooltipProvider>
    )
}
