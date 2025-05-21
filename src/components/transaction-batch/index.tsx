import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { Button } from '../ui/button'
import {
    EyeNoneIcon,
    LayersSharpDotIcon,
    PencilFillIcon,
    PlusIcon,
} from '../icons'
import { toReadableDate } from '@/utils'
import { Separator } from '../ui/separator'

interface Props extends IClassProps {
    // TODO: pass transaction id or object here
}

const TransactionBatch = ({ className }: Props) => {
    return (
        <div
            className={cn(
                'ecoop-scroll flex max-h-[90vh] min-w-[900px] flex-col gap-y-3 overflow-auto rounded-2xl border-2 bg-background p-4 ring-offset-1 dark:bg-popover',
                'shadow-xl',
                className
            )}
        >
            <div className="flex items-center justify-between">
                <p>
                    <LayersSharpDotIcon className="mr-1 inline text-primary" />{' '}
                    Transaction Batch
                </p>
                <div className="text-right">
                    <p className="text-sm">
                        {toReadableDate(
                            new Date(),
                            "MMM, dd yyyy 'at' h:mm a "
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground/40">
                        started date time
                    </p>
                </div>
            </div>
            <div className="flex min-h-[50vh] w-full shrink-0 gap-x-2">
                <div className="flex-1 space-y-2 rounded-2xl border bg-background p-4">
                    <div className="flex gap-x-2">
                        <div className="relative flex-1 rounded-xl bg-accent p-2">
                            <p className="text-lg">30000.00</p>
                            <p className="text-sm text-muted-foreground/70">
                                Total beginning fund
                            </p>
                            <Button
                                size="icon"
                                variant="default"
                                className="absolute right-2 top-1.5 size-fit p-1"
                            >
                                <PlusIcon />
                            </Button>
                        </div>
                        <div className="relative flex-1 rounded-xl bg-accent p-2">
                            <p className="text-lg">8000.00</p>
                            <p className="text-sm text-muted-foreground/70">
                                Total Deposit in Bank
                            </p>
                            <Button
                                size="icon"
                                variant="default"
                                className="absolute right-2 top-1.5 size-fit p-1"
                            >
                                <PencilFillIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="relative space-y-2 rounded-xl bg-accent p-3">
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
                </div>
                <div className="flex-1 rounded-xl border bg-background">
                    <div className="flex size-full flex-col items-center justify-center gap-y-2 p-4">
                        <EyeNoneIcon className="size-14 text-muted-foreground/40" />
                        <p>Transaction Batch Blotter Hidden</p>
                        <p className="text-center text-sm text-muted-foreground/80">
                            You can request view and your manager will confirm
                            or decline
                        </p>
                        <Button variant="outline" size="sm">
                            Request View
                        </Button>
                    </div>
                </div>
            </div>
            <Button
                size="sm"
                variant="secondary"
                hoverVariant="primary"
                className="shrink-0 rounded-xl"
            >
                End Batch
            </Button>
        </div>
    )
}

export default TransactionBatch
