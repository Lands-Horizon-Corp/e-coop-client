import { Skeleton } from '@/components/ui/skeleton'

const OrganizationItemSkeleton = () => (
    <div className="w-full py-2">
        <div className="w-full rounded-2xl shadow-md dark:bg-secondary/20">
            <div className="flex min-h-32 flex-col justify-center gap-y-3 rounded-2xl border-0 p-4 py-5">
                <div className="flex w-full gap-x-4">
                    <Skeleton className="size-16 rounded-full" />
                    <div className="grow space-y-2">
                        <Skeleton className="mb-2 h-5 w-3/4 rounded-md" />
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-3 w-1/4 rounded-md" />
                    </div>
                </div>
                <Skeleton className="mt-2 h-8 w-32 rounded-md" />{' '}
            </div>
        </div>
    </div>
)
export default OrganizationItemSkeleton
