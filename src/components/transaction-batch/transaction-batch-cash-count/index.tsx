import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib'

import { IClassProps, ITransactionBatchMinimal } from '@/types'

interface Props extends IClassProps {
    transactionBatch: ITransactionBatchMinimal
}

const TransactionBatchCashCount = ({ className }: Props) => {
    return (
        <div
            className={cn(
                'relative space-y-2 rounded-xl bg-accent p-3',
                className
            )}
        >
            <p className="text-xl">Cash Count</p>
            <div>
                <p className="py-8 text-center text-xs text-muted-foreground/80">
                    no bills/coins
                </p>
            </div>
            <div>
                <div className="flex items-center justify-between gap-x-2">
                    <p className="text-xs text-muted-foreground/60">
                        Cashcount Total
                    </p>
                    <Separator className="flex-1 bg-muted-foreground/10" />
                    <p className="text-xl">38000.00</p>
                </div>
                <div className="flex items-center justify-between gap-x-2">
                    <p className="text-xs text-muted-foreground/60">
                        Grand Total
                    </p>
                    <Separator className="flex-1 bg-muted-foreground/10" />
                    <p className="text-xl text-primary">38000.00</p>
                </div>
            </div>
            <Button size="sm" className="w-full">
                Save Cashcount
            </Button>
        </div>
    )
}

export default TransactionBatchCashCount
