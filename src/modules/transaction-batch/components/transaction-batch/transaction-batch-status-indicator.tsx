import { cn } from '@/helpers'
import { cva } from 'class-variance-authority'

import { DotBigIcon } from '@/components/icons'

import { IClassProps } from '@/types'

import { ITransactionBatch } from '../..'
import { getTransactionStatus } from './transaction-batch-utils'

interface Props extends IClassProps {
    transBatch: ITransactionBatch
}

const indicatorVariants = cva(
    'flex text-sm gap-x-1 items-center rounded-full',
    {
        variants: {
            variant: {
                BALANCED: 'text-primary',
                SHORTAGE: 'text-rose-500 dark:text-rose-400',
                OVERAGE: 'text-orange-600 dark:text-orange-500',
            },
        },
        defaultVariants: {
            variant: 'BALANCED',
        },
    }
)

const TransactionBatchStatusIndicator = ({ transBatch, className }: Props) => {
    const variant = getTransactionStatus(transBatch)

    return (
        <div className={cn(indicatorVariants({ variant, className }))}>
            <DotBigIcon />
            <p className="capitalize">{variant.toLocaleLowerCase()}</p>
        </div>
    )
}

export default TransactionBatchStatusIndicator
