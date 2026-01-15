import { useEffect } from 'react'

import { cn, formatNumber } from '@/helpers'

import { RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { IBaseProps, TEntityId } from '@/types'

import {
    IAdjustmentEntryTotal,
    TAdjustmentEntryHookMode,
    useAdjustmentEntryTotal,
} from '..'

type AdjustmentEntryTotalProps = {
    mode: Exclude<TAdjustmentEntryHookMode, 'all'>
} & IBaseProps

type TAdjustmentEntryTotalProps = AdjustmentEntryTotalProps &
    (
        | {
              mode: 'currency'
              currencyId: TEntityId
          }
        | {
              mode: 'currency-employee'
              currencyId: TEntityId
              userOrganizationId: TEntityId
          }
    )

export const AdjustmentEntryTotal = ({
    mode,
    children,
    className,
    currencyId,
    userOrganizationId,
    onLoad,
}: TAdjustmentEntryTotalProps & {
    currencyId?: TEntityId
    userOrganizationId?: TEntityId
    onLoad?: (adjustmentEntryTotalData: IAdjustmentEntryTotal) => void
}) => {
    const { data, isPending, refetch } = useAdjustmentEntryTotal({
        options: { enabled: true },
        mode,
        currencyId,
        userOrganizationId,
    })

    useEffect(() => {
        if (data && onLoad) {
            onLoad(data)
        }
    }, [data, onLoad])

    return (
        <div
            className={cn(
                'flex justify-end bg-gradient-to-tr from-card/20 to-primary/10 rounded-2xl relative px-4 py-1 border gap-x-8',
                !data?.is_balanced && 'to-rose-600/10 border-rose-400',
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
            {children}

            <div className="p-2 space-y-1">
                <p
                    className={cn(
                        'text-primary text-xl font-bold',
                        !data?.is_balanced &&
                            'text-rose-400 border-rose-400 animate-pulse'
                    )}
                >
                    {formatNumber(data?.total_debit ?? 0, 2)}
                </p>

                <p className="text-xs text-muted-foreground truncate shrink">
                    Total Debit
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p
                    className={cn(
                        'text-primary text-xl font-bold',
                        !data?.is_balanced &&
                            'text-rose-400 border-rose-400 animate-pulse'
                    )}
                >
                    {formatNumber(data?.total_credit ?? 0, 2)}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Total Credit
                </p>
            </div>
        </div>
    )
}
