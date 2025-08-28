import { cn } from '@/helpers'

import { EmptyIcon } from '@/components/icons'
import { Card } from '@/components/ui/card'

const TransactionNoCurrentPaymentFound = () => {
    return (
        <Card
            className={cn(
                'flex h-full min-h-60 flex-col items-center justify-center gap-2 rounded-3xl bg-background p-2 shadow-md'
            )}
        >
            <div className="flex flex-col items-center gap-y-1">
                <EmptyIcon
                    size={23}
                    className="text-gray-400 dark:text-gray-300"
                />
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    No Payments Found
                </h2>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    There are currently no processed payments. Try reloading the
                    page.
                </p>
            </div>
        </Card>
    )
}

export default TransactionNoCurrentPaymentFound
