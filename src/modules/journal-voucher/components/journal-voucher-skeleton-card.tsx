import { cn } from '@/helpers/tw-utils'

import { Skeleton } from '@/components/ui/skeleton'

type TJournalVoucherSkeletonCardProps = {
    className?: string
}

export const JournalVoucherSkeletonCard = ({
    className,
}: TJournalVoucherSkeletonCardProps) => {
    return (
        <div
            className={cn(
                'space-y-2 relative min-w-[300px] h-fit rounded-xl border p-4 shadow-sm bg-background',
                className
            )}
        >
            {/* Header Section: Title/Voucher No. and View/Status Indicator */}
            <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-3/5" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            </div>

            {/* --- TransactionUserInfoGrid 1: Summary --- */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
            </div>

            {/* --- TransactionUserInfoGrid 3: Tags --- */}
            <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>
            </div>

            {/* Footer: Date Ago */}
            <div className="pt-2 flex items-center justify-end w-full">
                <div className=" inline-flex items-center gap-2">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-24 ml-auto" />
                        <Skeleton className="h-3 w-16 ml-auto" />
                    </div>
                    <Skeleton className="size-8 rounded-full ml-auto" />
                </div>
            </div>
        </div>
    )
}
