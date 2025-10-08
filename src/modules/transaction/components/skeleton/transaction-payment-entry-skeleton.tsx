import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const PaymentsEntryListSkeleton = ({ itemNumber }: { itemNumber: number }) => {
    return (
        <div className="h-full space-y-2">
            {[...Array(itemNumber)].map((_, idx) => (
                <Card
                    className="w-full rounded-2xl border border-border bg-background/90 p-0"
                    key={idx}
                >
                    <CardContent className="flex items-center justify-between p-4">
                        {/* Left: Avatar + text */}
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-sidebar dark:bg-secondary" />

                            {/* Text placeholders */}
                            <div className="flex flex-col space-y-2">
                                <Skeleton className="h-4 w-32 sm:w-40 bg-sidebar dark:bg-secondary rounded" />
                                <Skeleton className="h-3 w-20 sm:w-28 bg-sidebar dark:bg-secondary rounded" />
                                <Skeleton className="h-3 w-16 sm:w-20 bg-sidebar dark:bg-secondary rounded" />
                            </div>
                        </div>

                        {/* Right: Amount + chevron */}
                        <div className="flex flex-col items-end space-y-2">
                            <Skeleton className="h-4 w-16 sm:w-20 bg-sidebar dark:bg-secondary rounded" />
                            <Skeleton className="h-3 w-4 bg-sidebar dark:bg-secondary rounded" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default PaymentsEntryListSkeleton
