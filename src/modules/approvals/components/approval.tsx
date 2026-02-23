import { cn } from '@/helpers'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import BlotterRequestKanban from '@/modules/transaction-batch/components/approval-kanbans/blotter-request-kanban'

import { IClassProps } from '@/types'

import EndedTransactionBatchKanban from '../../transaction-batch/components/approval-kanbans/ended-transaction-batch-kanban'
import NewMemberProfileKanban from './kanbans/new-member-profile-kanban'
import UserJoinRequestKanban from './kanbans/user-join-request-kanban'

interface Props extends IClassProps {}

const Approval = ({ className }: Props) => {
    const canSeeEndBatch = hasPermissionFromAuth({
        action: 'Read',
        resourceType: 'ApprovalsEndBatch',
    })
    const canSeeBlotterViewRequest = hasPermissionFromAuth({
        action: 'Read',
        resourceType: 'ApprovalsBlotterView',
    })
    const canSeeUserJoinRequest = hasPermissionFromAuth({
        action: 'Read',
        resourceType: 'ApprovalsUser',
    })
    const canSeeNewMemberApprovalRequest = hasPermissionFromAuth({
        action: 'Read',
        resourceType: 'ApprovalsMemberProfile',
    })

    return (
        <div
            className={cn(
                'ecoop-scroll flex h-fit w-fit max-w-full gap-x-8 overflow-x-scroll rounded-xl p-4 ',
                className
            )}
        >
            {canSeeEndBatch && <EndedTransactionBatchKanban />}
            {canSeeBlotterViewRequest && <BlotterRequestKanban />}
            {canSeeUserJoinRequest && <UserJoinRequestKanban />}
            {canSeeNewMemberApprovalRequest && <NewMemberProfileKanban />}
        </div>
    )
}

export default Approval
