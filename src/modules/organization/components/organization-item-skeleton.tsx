import { cn } from '@/helpers/tw-utils'

import { Skeleton } from '@/components/ui/skeleton'

interface OrganizationItemSkeletonProps {
    variant?: 'netflix' | 'grid' | 'list'
    className?: string
}

export const OrganizationItemSkeleton = ({
    variant = 'netflix',
    className,
}: OrganizationItemSkeletonProps) => {
    if (variant === 'netflix') {
        return (
            <div
                className={cn(
                    'min-w-[280px] max-w-[280px] space-y-3',
                    className
                )}
            >
                <Skeleton className="h-[160px] w-full rounded-lg" />
                <div className="space-y-2 px-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
        )
    }

    if (variant === 'grid') {
        return (
            <div className={cn('space-y-3', className)}>
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        )
    }

    // List variant
    return (
        <div className={cn('flex gap-4 p-4 border rounded-lg', className)}>
            <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    )
}

export default OrganizationItemSkeleton
