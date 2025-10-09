import { cn } from '@/helpers'
import BlotterRequestKanban from '@/modules/transaction-batch/components/approval-kanbans/blotter-request-kanban'

import { IClassProps } from '@/types'

import EndedTransactionBatchKanban from '../../transaction-batch/components/approval-kanbans/ended-transaction-batch-kanban'
import NewMemberProfileKanban from './kanbans/new-member-profile-kanban'
import UserJoinRequestKanban from './kanbans/user-join-request-kanban'

interface Props extends IClassProps {}

const Approval = ({ className }: Props) => {
    return (
        <div
            className={cn(
                'ecoop-scroll flex h-fit w-fit max-w-full gap-x-8 overflow-x-scroll rounded-xl p-4 ',
                className
            )}
        >
            <EndedTransactionBatchKanban />
            <BlotterRequestKanban />
            <UserJoinRequestKanban />
            <NewMemberProfileKanban />
        </div>
    )
}

export default Approval
