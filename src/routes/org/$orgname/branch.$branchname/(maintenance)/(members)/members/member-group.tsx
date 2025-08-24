import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberGroupCreateUpdateFormModal } from '@/modules/member-group/components/member-group-create-update-form'
import MemberGroupTable from '@/modules/member-group/components/member-group-table'
import MemberGroupAction from '@/modules/member-group/components/member-group-table/row-action-context'

import PageContainer from '@/components/containers/page-container'

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
            queryKey: ['member-group', 'paginated'],
        })
    })

    useSubscribe(`member_group.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-group', 'paginated'],
        })
    })

    useSubscribe(`member_group.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-group', 'paginated'],
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
                actionComponent={(prop) => <MemberGroupAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
