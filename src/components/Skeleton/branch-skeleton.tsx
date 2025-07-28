import { Skeleton } from '@/components/ui/skeleton'

const BranchItemSkeleton = () => (
    <div className="flex min-h-10 w-full rounded-2xl border-0 p-5">
        <Skeleton className="size-16 rounded-full" />

        <div className="ml-2 flex grow flex-col">
            <Skeleton className="mb-2 h-6 w-3/4 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />

            <div className="mb-1 mt-2 flex items-center gap-y-1">
                <Skeleton className="mr-2 size-4 rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>

            <div className="flex items-center gap-y-1">
                <Skeleton className="mr-2 size-4 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>

            <div className="absolute bottom-7 right-2 z-50 flex gap-1">
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-7 w-16 rounded-md" />
            </div>
        </div>
    </div>
)
export default BranchItemSkeleton
