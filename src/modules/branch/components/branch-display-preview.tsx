import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'

import {
    CalendarIcon,
    EditPencilIcon,
    PinLocationIcon as LocationIcon,
    EmailIcon as MailIcon,
    LocationPinOutlineIcon as MapPinIcon,
    SettingsIcon,
    StarIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import TruncatedText from '@/components/ui/truncated-text'

import { useModalState } from '@/hooks/use-modal-state'

import { IBranch } from '../branch.types'
import CreateUpdateBranchFormModal from './forms/create-branch-form'

type BranchPreviewDisplayProps = {
    branch?: IBranch
    onCreateMember?: () => void
    onViewOrganization?: () => void
    isLoading?: boolean
    variant?: 'default' | 'compact' | 'detailed'
    showActions?: boolean
    className?: string
    onClick?: () => void
    isEditMode?: boolean
}

const BranchPreviewDisplay = ({
    branch,
    isLoading,
    variant = 'default',
    showActions = true,
    className,
}: BranchPreviewDisplayProps) => {
    const updateModal = useModalState(false)
    const queryClient = useQueryClient()

    if (isLoading) {
        return <BranchPreviewDisplaySkeleton variant={variant} />
    }

    if (!branch) {
        return null
    }

    const mediaUrl = branch?.media?.url || branch?.media?.download_url
    const branchId = branch?.id || ''
    const description =
        branch?.description || 'Branch description not available.'

    const addressComponents = [
        branch?.address,
        branch?.barangay,
        branch?.city,
        branch?.province,
        branch?.region,
        branch?.postal_code,
    ].filter(Boolean)

    const fullAddress = addressComponents.join(', ')

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

    const getTextSize = () => {
        switch (variant) {
            case 'compact':
                return 'text-[min(28px,5vw)]'
            case 'detailed':
                return 'text-[min(50px,9vw)]'
            default:
                return 'text-[min(40px,7vw)]'
        }
    }

    return (
        <TooltipProvider>
            <div>
                <div
                    className={cn(
                        'flex relative w-full bg-cover !h-[50vh] bg-center flex-col gap-y-2 ecoop-scroll',
                        getContainerHeight(),
                        'max-h-screen',
                        className
                    )}
                    style={{
                        backgroundImage: `url(${mediaUrl || '/placeholder-branch-bg.jpg'})`,
                    }}
                >
                    <div className="absolute w-full min-h-52 bottom-0 px-4 sm:px-8 bg-gradient-to-t from-background via-[80%] via-background/10 to-transparent" />
                </div>

                <CreateUpdateBranchFormModal
                    {...updateModal}
                    className="w-full min-w-[70rem] max-w-[80rem]"
                    formProps={{
                        branchId,
                        organizationId: branch?.organization_id || '',
                        defaultValues: branch,
                        onSuccess: () => {
                            updateModal.onOpenChange(false)
                            queryClient.invalidateQueries({
                                queryKey: ['branch', 'branches'],
                            })
                            toast.success('Branch updated successfully!')
                        },
                    }}
                />

                <div className="w-full inset-0 z-30 px-4 sm:px-8">
                    <div className="flex flex-col space-y-5 mb-8">
                        <div className="space-y-6">
                            {/* Branch Title & Type */}
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <h1
                                                    className={cn(
                                                        'font-sans font-black !leading-[0.9] cursor-pointer max-w-4xl',
                                                        getTextSize(),
                                                        'hover:text-primary/80 transition-colors duration-300'
                                                    )}
                                                >
                                                    {branch?.name}
                                                </h1>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{branch?.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {/* Branch Type & Main Badge */}
                                        <div className="flex items-center gap-3">
                                            {branch?.is_main_branch && (
                                                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 shadow-lg text-sm font-semibold px-3 py-1">
                                                    <StarIcon className="h-4 w-4 mr-1" />
                                                    Headquarters
                                                </Badge>
                                            )}
                                            {branch?.created_at && (
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    <span>
                                                        Since{' '}
                                                        {new Date(
                                                            branch.created_at
                                                        ).getFullYear()}
                                                    </span>
                                                </div>
                                            )}
                                            {branch?.type && (
                                                <Badge className={cn('text-')}>
                                                    {branch.type
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        branch.type.slice(
                                                            1
                                                        )}{' '}
                                                    Branch
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Action Buttons */}
                                    <div className="flex gap-2">
                                        {branch?.latitude &&
                                            branch?.longitude && (
                                                <Button
                                                    className="shadow-md hover:shadow-lg transition-all duration-300"
                                                    onClick={() => {
                                                        const url = `https://maps.google.com?q=${branch.latitude},${branch.longitude}`
                                                        window.open(
                                                            url,
                                                            '_blank'
                                                        )
                                                    }}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <MapPinIcon className="h-4 w-4 mr-2" />
                                                    Map
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Description */}
                        {variant !== 'compact' && description && (
                            <>
                                <div className="">
                                    <TruncatedText
                                        className="text-muted-foreground !bg-inherit max-h-52 overflow-auto ecoop-scroll text-sm sm:text-base leading-relaxed"
                                        maxLength={
                                            variant === 'detailed' ? 400 : 250
                                        }
                                        showLessText="Read less"
                                        showMoreText="Read more"
                                        text={
                                            'facilis corporis optio voluptas quia doloremque laudantium voluptatem deleniti sed magnam deserunt ab reprehenderit repellat neque iure ipsam accusantium tempore rerum quae voluptatem sed consequatur tempora quae deserunt aperiam recusandae possimus deleniti ex sed delectus laborum quisquam rerum soluta excepturi omnis adipisci minus atque nulla est velit soluta quasi sunt ea iusto et a quia explicabo quis odit. error itaque et qui molestiae et veniam voluptatibus aut nulla molestiae perferendis aut ut accusantium est blanditiis natus tempore eaque quae et sit sed et dignissimos sunt consequatur dicta molestiae qui. aspernatur dolor dolores iusto neque voluptatem sed est ut optio et eaque error consequuntur est sequi in fugit voluptatem non ut voluptas ut porro dolores dolores adipisci saepe voluptas voluptate a vitae aut eos dolorum non est modi velit aut numquam eum natus non itaque qui distinctio.'
                                        }
                                    />
                                </div>
                            </>
                        )}
                        {showActions && (
                            <>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        className="flex-1 sm:flex-initial shadow-sm"
                                        onClick={() =>
                                            updateModal.onOpenChange(true)
                                        }
                                        size="sm"
                                        variant="secondary"
                                    >
                                        <EditPencilIcon className="mr-2 h-4 w-4" />
                                        Edit Branch
                                    </Button>
                                    {branch?.latitude && branch?.longitude && (
                                        <Button
                                            className="flex-1 sm:flex-initial shadow-sm"
                                            onClick={() => {
                                                const url = `https://maps.google.com/dir/?api=1&destination=${branch.latitude},${branch.longitude}`
                                                window.open(url, '_blank')
                                            }}
                                            size="sm"
                                            variant="outline"
                                        >
                                            <MapPinIcon className="mr-2 h-4 w-4" />
                                            Get Directions
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                        {/* Details Grid - Netflix Episode Style */}
                        <div className="grid  grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            {/* Contact Information Card */}
                            {(branch?.email || branch?.contact_number) && (
                                <div className="group">
                                    <div className="relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl" />
                                        <div className="relative p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-muted hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center">
                                                    <MailIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <h3 className="font-semibold text-foreground">
                                                    Contact Info
                                                </h3>
                                            </div>

                                            <div className="space-y-3">
                                                {branch?.email && (
                                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                                                        <MailIcon className="h-4 w-4 text-primary flex-shrink-0" />
                                                        <a
                                                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors truncate"
                                                            href={`mailto:${branch.email}`}
                                                        >
                                                            {branch.email}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Location Card */}
                            <div className="group lg:col-span-1 xl:col-span-2">
                                <div className="relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl" />
                                    <div className="relative p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-muted hover:border-red-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-red-100 dark:bg-red-950 rounded-xl flex items-center justify-center">
                                                <LocationIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <h3 className="font-semibold text-foreground">
                                                Location
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-sm leading-relaxed text-foreground/80 font-medium">
                                                {fullAddress}
                                            </p>

                                            {branch?.latitude &&
                                                branch?.longitude && (
                                                    <div className="flex flex-wrap gap-3">
                                                        <Button
                                                            className="bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:scale-105"
                                                            onClick={() => {
                                                                const url = `https://maps.google.com?q=${branch.latitude},${branch.longitude}`
                                                                window.open(
                                                                    url,
                                                                    '_blank'
                                                                )
                                                            }}
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <MapPinIcon className="h-4 w-4 mr-2" />
                                                            View on Map
                                                        </Button>
                                                        <Button
                                                            className="bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:scale-105"
                                                            onClick={() => {
                                                                const url = `https://maps.google.com/dir/?api=1&destination=${branch.latitude},${branch.longitude}`
                                                                window.open(
                                                                    url,
                                                                    '_blank'
                                                                )
                                                            }}
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <LocationIcon className="h-4 w-4 mr-2" />
                                                            Get Directions
                                                        </Button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Branch Settings Card */}
                            {branch?.branch_setting && (
                                <div className="group">
                                    <div className="relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl" />
                                        <div className="relative p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-muted hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-xl flex items-center justify-center">
                                                    <SettingsIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <h3 className="font-semibold text-foreground">
                                                    Configuration
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-sm font-medium text-foreground">
                                                    Settings Configured
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}

export const BranchPreviewDisplaySkeleton = ({
    variant = 'default',
    className,
}: {
    variant?: 'default' | 'compact' | 'detailed'
    className?: string
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
                'flex relative w-full min-w-5xl bg-secondary rounded-t-4xl animate-pulse',
                getContainerHeight(),
                className
            )}
        >
            <div className="absolute w-full bottom-0 pb-10 px-4 sm:px-8 pt-20 sm:pt-50 bg-gradient-to-t from-background via-background/95 via-30% to-transparent">
                {/* Logo Skeleton with Badge */}
                <div className="mb-4 relative">
                    <Skeleton className={cn('rounded-2xl', getImageSize())} />
                    <Skeleton className="absolute -top-2 -right-2 h-6 w-20 rounded-full" />
                </div>

                {/* Title and Organization Skeleton */}
                <div className="mb-6">
                    <Skeleton className="h-8 sm:h-12 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-24 rounded-full mb-3" />
                    <Skeleton className="h-16 w-full rounded-lg mb-2" />
                    <Skeleton className="h-8 w-32 rounded-full" />
                </div>

                {/* Content Area */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    <div className="flex-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                </div>

                {/* Description Skeleton */}
                {variant !== 'compact' && (
                    <div className="bg-muted/30 rounded-lg p-4 border mb-6">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                )}

                {/* Actions Skeleton */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-36" />
                </div>
            </div>
        </div>
    )
}

export default BranchPreviewDisplay
