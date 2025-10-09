import { cn } from '@/helpers'

import { EmptyIcon } from '@/components/icons'
import { Card } from '@/components/ui/card'

const TransactionNoCurrentPaymentFound = () => {
    return (
        <Card
            className={cn(
                'flex h-full min-h-60 border-0 shadow-none flex-col items-center justify-center gap-2 rounded-3xl bg-background p-2 '
            )}
        >
            <div className="flex flex-col items-center gap-y-1">
                <EmptyIcon
                    className="text-gray-400 dark:text-gray-300"
                    size={23}
                />
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    No Payments Found
                </h2>
                <p className="text-center text-sm text-muted-foreground dark:text-secondary">
                    There are currently no processed payments. Try reloading the
                    page.
                </p>
            </div>
        </Card>
    )
}

export default TransactionNoCurrentPaymentFound
