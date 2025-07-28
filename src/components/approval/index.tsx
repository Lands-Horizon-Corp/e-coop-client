import { cn } from '@/lib'

import { IClassProps } from '@/types'

import BlotterRequestKanban from './kanbans/blotter-request-kanban'
import EndedTransactionBatchKanban from './kanbans/ended-transaction-batch-kanban'
import NewMemberProfileKanban from './kanbans/new-member-profile-kanban'
import UserJoinRequestKanban from './kanbans/user-join-request-kanban'

interface Props extends IClassProps {}

const Approval = ({ className }: Props) => {
    return (
        <div
            className={cn(
                'ecoop-scroll flex h-fit w-fit max-w-full gap-x-8 overflow-x-scroll rounded-xl p-4',
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
