import { Skeleton } from '@/components/ui/skeleton'

export const FinancialStatementSkeleton = () => {
    return (
        <Skeleton className="flex w-full gap-x-2 bg-secondary/30 p-5 rounded-xl">
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
            </div>
            <Skeleton className="size-5" />
        </Skeleton>
    )
}
export default FinancialStatementSkeleton
