import { IClassProps } from '@/types'
import BlotterRequestKanban from './kanbans/blotter-request-kanban'
import { cn } from '@/lib'
import EndedTransactionBatchKanban from './kanbans/ended-transaction-batch-kanban'

interface Props extends IClassProps {}

const Approval = ({ className }: Props) => {
    return (
        <div
            className={cn(
                'ecoop-scroll flex w-full max-w-full gap-x-8 overflow-x-scroll rounded-xl p-4',
                className
            )}
        >
            <EndedTransactionBatchKanban />
            <BlotterRequestKanban />
        </div>
    )
}

export default Approval
