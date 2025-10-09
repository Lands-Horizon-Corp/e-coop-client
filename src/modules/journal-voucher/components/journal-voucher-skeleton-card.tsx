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
                'space-y-4 relative min-w-[400px] h-fit rounded-xl border p-4 shadow-sm bg-background',
                className
            )}
        >
            {/* Header Section: Title/Voucher No. and View/Status Indicator */}
            <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/5" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            </div>

            {/* --- TransactionUserInfoGrid 1: Summary --- */}
            <div className="space-y-2">
                <Skeleton className="h-7 w-full" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {/* Debit / Credit */}
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    {/* Description / Reference */}
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    {/* Date / Print No. */}
                </div>
            </div>

            {/* --- TransactionUserInfoGrid 3: Tags --- */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
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
                    <Skeleton className="size-12 rounded-full ml-auto" />
                </div>
            </div>
        </div>
    )
}
