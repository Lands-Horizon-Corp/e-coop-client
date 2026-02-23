import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

const PostSkeleton = () => (
    <div className="feed-card w-full">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
            </div>
        </div>

        <div className="px-4 pb-4 space-y-2">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-[90%] rounded" />
            <Skeleton className="h-3.5 w-[75%] rounded" />
        </div>

        <Separator className="mx-4" />

        <div className="flex items-center gap-2 px-4 py-3">
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
        </div>
    </div>
)

export default PostSkeleton
