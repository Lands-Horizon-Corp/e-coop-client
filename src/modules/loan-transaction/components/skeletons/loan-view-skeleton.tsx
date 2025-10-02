import { cn } from '@/helpers'

import { Skeleton } from '@/components/ui/skeleton'

export const LoanViewSkeleton = () => {
    return (
        <>
            {/* Header */}
            <div className="flex gap-2 w-full">
                <div className="space-y-2 shrink-0">
                    <div className="bg-secondary px-4 py-2 rounded-lg">
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                    <div className="bg-secondary px-4 py-2 rounded-lg">
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                </div>
                <div className="flex grow justify-between gap-4 bg-gradient-to-r from-primary/20 to-card/10 ring-2 ring-card dark:ring-primary/40 rounded-xl p-4">
                    <div className="flex-shrink-0">
                        <Skeleton className="size-14 rounded-lg" />
                    </div>
                    <div className="space-y-2 grow">
                        <div className="flex gap-x-2 items-center">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-1 w-full my-2" />
                        <div className="flex justify-between flex-wrap space-x-5 text-xs">
                            {[...Array(4)].map((_, i) => (
                                <div className="shrink-0 space-y-1" key={i}>
                                    <Skeleton className="h-3 w-24 mb-1" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="w-full flex gap-1 bg-popover text-sm justify-between p-4 rounded-lg">
                {[...Array(5)].map((_, i) => (
                    <div
                        className="space-y-2 min-w-[180px] px-4 border-l first:border-l-0"
                        key={i}
                    >
                        <Skeleton className="h-3 w-32 mb-2" />
                        <div className="space-y-2">
                            {[...Array(i === 2 ? 4 : 3)].map((_, j) => (
                                <div
                                    className="flex items-center gap-1"
                                    key={j}
                                >
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton
                                        className={cn(
                                            'h-6 w-16 rounded-md',
                                            i === 2 && j > 0 ? 'w-12' : ''
                                        )}
                                    />
                                    {i === 2 && j === 1 && (
                                        <Skeleton className="h-6 w-12 rounded-md" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-64 rounded-md" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
            </div>

            {/* Table */}
            <div className="w-full h-[50vh] rounded-lg bg-popover flex flex-col">
                <div className="flex gap-2 px-2 py-2">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton className="h-4 w-24 rounded-md" key={i} />
                    ))}
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <Skeleton className="h-8 w-48 rounded-md" />
                </div>
            </div>
        </>
    )
}
