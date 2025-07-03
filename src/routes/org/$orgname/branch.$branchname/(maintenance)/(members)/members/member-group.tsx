import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { MemberGroupCreateUpdateFormModal } from '@/components/forms/member-forms/member-group-create-update-form'
import MemberGroupTable from '@/components/tables/member/member-group-table'
import MemberGroupTableAction from '@/components/tables/member/member-group-table/member-group-table-action'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-group'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(`member_group.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-group', 'resource-query'],
        })
    })

    useSubscribe(`member_group.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-group', 'resource-query'],
        })
    })

    useSubscribe(`member_group.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-group', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <MemberGroupCreateUpdateFormModal {...createModal} />
            <MemberGroupTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => <MemberGroupTableAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
