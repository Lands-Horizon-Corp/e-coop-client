import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonLedgerCard = () => {
    return (
        <div className="flex flex-col gap-y-8">
            <Card className="flex flex-col gap-y-2 p-5">
                <div className="flex justify-between">
                    <Skeleton className="h-[15px] w-[80px] rounded-full" />
                    <Skeleton className="h-[15px] w-[100px] rounded-full" />
                </div>
                <Skeleton className="h-[15px] w-3/4 rounded-full" />
                <Skeleton className="h-[15px] w-1/2 rounded-full" />
                <Skeleton className="mt-2 h-[10px] w-1/6 rounded-full" />
            </Card>
            <Card className="flex flex-col gap-y-2 p-5">
                <div className="flex justify-between">
                    <Skeleton className="h-[15px] w-[80px] rounded-full" />
                    <Skeleton className="h-[15px] w-[100px] rounded-full" />
                </div>
                <Skeleton className="h-[15px] w-3/4 rounded-full" />
                <Skeleton className="h-[15px] w-1/2 rounded-full" />
                <Skeleton className="mt-2 h-[10px] w-1/6 rounded-full" />
            </Card>
            <Card className="flex flex-col gap-y-2 p-5">
                <div className="flex justify-between">
                    <Skeleton className="h-[15px] w-[80px] rounded-full" />
                    <Skeleton className="h-[15px] w-[100px] rounded-full" />
                </div>
                <Skeleton className="h-[15px] w-3/4 rounded-full" />
                <Skeleton className="h-[15px] w-1/2 rounded-full" />
                <Skeleton className="mt-2 h-[10px] w-1/6 rounded-full" />
            </Card>
        </div>
    )
}

export default SkeletonLedgerCard
