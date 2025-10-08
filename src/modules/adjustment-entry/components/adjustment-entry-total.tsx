import { cn, formatNumber } from '@/helpers'

import { RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { useAdjustmentEntryTotal } from '..'

export const AdjustmentEntryTotal = ({ className }: { className?: string }) => {
    const { data, isPending, refetch } = useAdjustmentEntryTotal({
        options: { enabled: true },
    })

    return (
        <div
            className={cn(
                'flex justify-end bg-gradient-to-tr from-card/20 to-primary/10 rounded-2xl relative px-4 py-1 border gap-x-8',
                className
            )}
        >
            <Button
                className="absolute rounded-full size-fit top-2 right-2"
                disabled={isPending}
                onClick={() => refetch()}
                size="icon"
                variant="secondary"
            >
                {isPending ? (
                    <LoadingSpinner className="size-3" />
                ) : (
                    <RefreshIcon className="size-3" />
                )}
            </Button>
            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(data?.total_debit ?? 0, 2)}
                </p>

                <p className="text-xs text-muted-foreground truncate shrink">
                    Total Debit
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(data?.total_credit ?? 0, 2)}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Total Credit
                </p>
            </div>
        </div>
    )
}
