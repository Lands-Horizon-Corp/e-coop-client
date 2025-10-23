import { Skeleton } from '@/components/ui/skeleton'

const LoadingSkeleton = () => (
    <div className="space-y-8">
        {Array.from({ length: 2 }).map((_, i) => (
            <div className="space-y-4" key={i}>
                <Skeleton className="h-6 animate-pulse rounded w-48" />
                <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 4 }).map((_, j) => (
                        <div className="min-w-[280px] space-y-3" key={j}>
                            <Skeleton className="h-40 rounded-lg" />
                            <div className="space-y-2 px-2">
                                <Skeleton className="h-4 rounded w-3/4" />
                                <Skeleton className="h-3 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
)

export default LoadingSkeleton
