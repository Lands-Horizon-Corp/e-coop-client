import { orgBannerList } from '@/assets/pre-organization-banner-background'
import { cn } from '@/helpers/tw-utils'
import { IBranch } from '@/modules/branch'

import { LoadingSpinnerIcon, LocationPinIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MapPicker from '@/components/map/map-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlainTextEditor } from '@/components/ui/text-editor'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import TruncatedText from '@/components/ui/truncated-text'

type BranchItemProps = {
    branch: IBranch
    isUserCanJoin: boolean
    onJoinClick: (branch: IBranch) => void
    isLoading?: boolean
    variant?: 'default' | 'compact' | 'detailed'
    showLocation?: boolean
    showDescription?: boolean
    className?: string
}

export const BranchItem = ({
    branch,
    isUserCanJoin,
    onJoinClick,
    isLoading = false,
    variant = 'default',
    showLocation = true,
    showDescription = true,
    className,
}: BranchItemProps) => {
    const mediaUrl = branch?.media?.url ?? orgBannerList[0]

    if (!branch || !branch.id) {
        return (
            <Card className={cn('opacity-50', className)}>
                <CardContent className="p-4">
                    <div className="text-center text-muted-foreground">
                        Invalid branch data
                    </div>
                </CardContent>
            </Card>
        )
    }

    const hasLocation = branch.latitude && branch.longitude
    const branchName = branch?.name || 'Unnamed Branch'
    const branchDescription = branch?.description || ''

    const getImageSize = () => {
        switch (variant) {
            case 'compact':
                return 'size-8'
            case 'detailed':
                return 'size-16'
            default:
                return 'size-12'
        }
    }

    const getCardPadding = () => {
        switch (variant) {
            case 'compact':
                return 'p-3'
            case 'detailed':
                return 'p-6'
            default:
                return 'p-4'
        }
    }

    return (
        <TooltipProvider>
            <Card
                className={cn(
                    'transition-all duration-200 hover:shadow-md hover:bg-accent/50',
                    'cursor-pointer border-border/50',
                    className
                )}
            >
                <CardContent
                    className={cn('flex items-start gap-3', getCardPadding())}
                >
                    {/* Branch Image */}
                    <div className="flex-shrink-0">
                        <ImageDisplay
                            className={cn(
                                'rounded-xl object-cover',
                                getImageSize()
                            )}
                            src={mediaUrl}
                        />
                    </div>

                    {/* Branch Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                        {/* Branch Name with Truncation */}
                        <div className="flex items-start justify-between gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h3
                                        className={cn(
                                            'font-semibold text-foreground truncate',
                                            variant === 'compact'
                                                ? 'text-sm'
                                                : 'text-base'
                                        )}
                                    >
                                        {branchName}
                                    </h3>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{branchName}</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Join Button */}
                            <Button
                                className="flex-shrink-0"
                                disabled={!isUserCanJoin || isLoading}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onJoinClick(branch)
                                }}
                                size={variant === 'compact' ? 'sm' : 'sm'}
                                variant={
                                    isUserCanJoin ? 'default' : 'secondary'
                                }
                            >
                                {isLoading ? (
                                    <LoadingSpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                                ) : isUserCanJoin ? (
                                    <LocationPinIcon className="mr-2 h-4 w-4" />
                                ) : null}
                                {isLoading
                                    ? 'Joining...'
                                    : isUserCanJoin
                                      ? 'Join'
                                      : 'Joined'}
                            </Button>
                        </div>

                        {/* Branch Description */}
                        {showDescription &&
                            branchDescription &&
                            variant !== 'compact' && (
                                <div className="text-sm text-muted-foreground">
                                    <TruncatedText
                                        className="text-sm"
                                        maxLength={
                                            variant === 'detailed' ? 200 : 100
                                        }
                                        renderText={(text) => (
                                            <PlainTextEditor
                                                className="text-sm text-muted-foreground"
                                                content={text}
                                            />
                                        )}
                                        showLessText="less"
                                        showMoreText="more"
                                        text={branchDescription}
                                    />
                                </div>
                            )}

                        {/* Location Information */}
                        {showLocation &&
                            hasLocation &&
                            variant !== 'compact' && (
                                <div className="flex items-center gap-2">
                                    <LocationPinIcon className="h-4 w-4 text-muted-foreground" />
                                    <MapPicker
                                        className="text-xs flex-1"
                                        disabled={false}
                                        hideButtonCoordinates={true}
                                        onChange={() => {}}
                                        placeholder="View Branch Location"
                                        size="sm"
                                        title={`${branchName} Location`}
                                        value={{
                                            lat: branch.latitude!,
                                            lng: branch.longitude!,
                                        }}
                                        variant="ghost"
                                        viewOnly={true}
                                    />
                                </div>
                            )}

                        {/* Compact variant location indicator */}
                        {showLocation &&
                            hasLocation &&
                            variant === 'compact' && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <LocationPinIcon className="h-3 w-3" />
                                    <span>Location available</span>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}

export default BranchItem
