import { cn } from '@/lib'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const TransactionBatchSummary = ({ className }: Props) => {
    return <div className={cn('', className)}>TransactionBatchSummary</div>
}

export default TransactionBatchSummary
