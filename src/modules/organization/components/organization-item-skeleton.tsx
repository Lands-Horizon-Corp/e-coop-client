import { cn } from '@/helpers/tw-utils'

import { Skeleton } from '@/components/ui/skeleton'

interface OrganizationItemSkeletonProps {
    className?: string
}

export const OrganizationItemSkeleton = ({
    className,
}: OrganizationItemSkeletonProps) => {
    return (
        <div
            className={cn(
                'flex gap-4 p-4 flex-col border min-w-[15rem] max-w-[15rem] rounded-lg',
                className
            )}
        >
            <Skeleton className="w-full h-16 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    )
}

interface OrganizationItemSkeletonProps {
    mainClassName?: string
    count?: number
    itemClassName?: string
}

export const OrganizationSkeleton = ({
    mainClassName,
    count = 3,
    itemClassName,
}: OrganizationItemSkeletonProps) => {
    return (
        <div className={cn('gap-3 flex flex-wrap', mainClassName)}>
            {Array.from({ length: count }).map((_, sectionIndex) => (
                <OrganizationItemSkeleton
                    className={itemClassName}
                    key={sectionIndex}
                />
            ))}
        </div>
    )
}

export default OrganizationSkeleton
