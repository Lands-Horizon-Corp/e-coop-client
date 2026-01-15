import { cn } from '@/helpers'

import { Skeleton } from '@/components/ui/skeleton'

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

export default OrganizationPreviewDisplaySkeleton
