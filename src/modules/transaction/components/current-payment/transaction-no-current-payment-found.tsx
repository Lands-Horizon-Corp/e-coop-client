import { RefreshCcwIcon } from 'lucide-react'

import { EmptyIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

const TransactionNoCurrentPaymentFound = () => {
    return (
        <Empty className="flex-1 h-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <EmptyIcon
                        className="text-gray-400 dark:text-gray-300"
                        size={23}
                    />
                </EmptyMedia>
                <EmptyTitle>No Payments Found</EmptyTitle>
                <EmptyDescription>
                    There are currently no processed payments. Try reloading the
                    page.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button size="sm" variant="outline">
                    <RefreshCcwIcon />
                    Refresh
                </Button>
            </EmptyContent>
        </Empty>
    )
}

export default TransactionNoCurrentPaymentFound
