import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export const TransactionSkeletonCard = () => (
    <Card className="w-full animate-pulse">
        <CardHeader>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-16" />
            </div>
        </CardHeader>
        <CardContent>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
            <Skeleton className="mt-6 h-10 w-32" />
        </CardContent>
    </Card>
)
export default TransactionSkeletonCard
