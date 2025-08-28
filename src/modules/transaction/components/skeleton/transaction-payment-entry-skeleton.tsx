import { cn } from '@/helpers'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const PaymentsEntryListSkeleton = () => {
    return (
        <div className="h-full space-y-2">
            {[...Array(5)].map((_, idx) => (
                <Card key={idx} className="!bg-background/90 p-2">
                    <CardContent className={cn('w-full p-0 pr-1')}>
                        <div className="flex  px-2 w-full items-center gap-x-2">
                            <Skeleton className="size-8 rounded-full" />
                            <div className="w-full space-y-1">
                                <div className="mt-2 flex flex-col w-full items-start space-y-2">
                                    <Skeleton className="h-4 w-1/2 rounded" />
                                    <Skeleton className="h-4 w-1/4 rounded" />
                                </div>
                                <div className="h-3 w-1/3 rounded" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default PaymentsEntryListSkeleton
