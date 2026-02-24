import { useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { currencyFormat } from '@/modules/currency'
import { useSetTimeMachine } from '@/modules/user-organization'
import { formatISO, isPast } from 'date-fns'

import {
    CalendarNumberIcon,
    LayersSharpDotIcon,
    MoneyStackIcon,
    RefreshIcon,
    SwitchArrowIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { IClassProps } from '@/types'

import {
    TTransactionBatchFullorMin,
    useTransactionBatchSwitch,
    useUnclosedTransactionBatches,
} from '../..'
import { useTransactionBatchStore } from '../../store/transaction-batch-store'

const UnclosedTransactionBatchesList = ({ className }: IClassProps) => {
    const [isSwitching, setSwitching] = useState(false)
    const {
        data: unclosedBatches = [],
        isPending,
        isRefetching,
        refetch,
    } = useUnclosedTransactionBatches()

    return (
        <div
            className={cn(
                'rounded-2xl max-h-[500px] ecoop-scroll overflow-y-auto shadow-sm border-2 bg-secondary ring-offset-0 dark:bg-popover',
                className
            )}
        >
            <div className="border-b border-border z-10 bg-popover sticky top-0 px-4 py-3">
                <div className="flex items-center gap-2">
                    <LayersSharpDotIcon className="size-4 text-warning-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">
                        Unclosed Transaction Batches
                    </h3>
                    <Button
                        className="ml-auto p-1 size-fit"
                        disabled={isRefetching}
                        onClick={() => refetch()}
                        size="icon-sm"
                        variant="ghost"
                    >
                        {isRefetching ? (
                            <LoadingSpinner className="size-3" />
                        ) : (
                            <RefreshIcon className="size-3" />
                        )}
                    </Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                    These batches from previous days are still open. Switch to
                    one to close it out.
                </p>
            </div>
            <div className="space-y-2 w-full overflow-y-auto p-3">
                {unclosedBatches.map((batch) => (
                    <UnclosedBatchItem
                        batch={batch}
                        disableSwitch={isSwitching}
                        key={batch.id}
                        onLoading={(state) => setSwitching(state)}
                    />
                ))}
                {unclosedBatches.length === 0 && (
                    <p className="mx-auto flex text-xs text-center text-muted-foreground/40">
                        You don&apos;t have active or unclosed transaction batch
                    </p>
                )}
                {isPending &&
                    [1, 2, 3].map((i) => (
                        <div
                            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                            key={i}
                        >
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-14" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                        </div>
                    ))}
            </div>
        </div>
    )
}

interface UnclosedBatchItemProps {
    batch: TTransactionBatchFullorMin
    disableSwitch?: boolean
    onLoading?: (state: boolean) => void
    onSwitch?: (batchId: string) => void
}

const UnclosedBatchItem = ({
    batch,
    disableSwitch,
    onSwitch,
    onLoading,
}: UnclosedBatchItemProps) => {
    const { data: currentTransactionBatch } = useTransactionBatchStore()

    const isCurrent = currentTransactionBatch?.id === batch.id

    const { mutateAsync: batchSwitchAsync, isPending: isSwitching } =
        useTransactionBatchSwitch()

    const { mutateAsync: timeMachineAsync } = useSetTimeMachine()

    const hasPassed = isPast(new Date(batch.created_at))

    return (
        <div className="group flex items-center justify-between relative gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
            <div className="flex-1 min-w-0 space-y-1">
                <div className="items-center w-full">
                    <p className="text-xs font-semibold">{batch.batch_name}</p>
                    {isCurrent && (
                        <span className="text-xs absolute top-1.5 right-2 px-1.5 py-0.5 bg-primary/10 rounded-2xl text-primary">
                            Current
                        </span>
                    )}
                    <span className="inline-flex items-center rounded-full text-xs">
                        {dateAgo(batch.created_at)}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                        <CalendarNumberIcon className="size-3" />
                        {toReadableDateTime(batch.created_at)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <MoneyStackIcon className="size-3" />
                        {currencyFormat(batch.beginning_balance, {
                            currency: batch.currency,
                            showSymbol: !!batch.currency,
                        })}
                    </span>
                </div>
            </div>
            {!isCurrent && (
                <Button
                    className="shrink-0 size-fit p-1.5 hover:text-primary cursor-pointer text-muted-foreground"
                    disabled={isSwitching || disableSwitch || isCurrent}
                    onClick={() =>
                        toast.promise(
                            (async () => {
                                onLoading?.(true)
                                await batchSwitchAsync(batch.id)

                                if (batch.created_at && hasPassed) {
                                    const timeValue = formatISO(
                                        new Date(batch.created_at)
                                    )
                                    await timeMachineAsync({
                                        time_machine_time: timeValue,
                                    })
                                }
                            })(),
                            {
                                loading: 'Switching...',
                                success: () => {
                                    onSwitch?.(batch.id)
                                    return `Switched to transaction batch '${batch.batch_name}'`
                                },
                                error: 'Failed to switch',
                                finally: () => onLoading?.(false),
                            }
                        )
                    }
                    size="icon"
                    title={`Switch to batch ${batch.id}`}
                    variant="secondary"
                >
                    <SwitchArrowIcon className="size-4" />
                </Button>
            )}
        </div>
    )
}

export default UnclosedTransactionBatchesList
