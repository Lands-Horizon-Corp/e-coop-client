import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberCenterTable from '@/components/tables/member/member-center-table'
import { MemberCenterCreateUpdateFormModal } from '@/components/forms/member-forms/member-center-create-update-form'
import MemberCenterTableAction from '@/components/tables/member/member-center-table/action'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQueryClient } from '@tanstack/react-query'
import { useModalState } from '@/hooks/use-modal-state'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-center'
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

    useSubscribe(`member_center.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-center', 'resource-query'],
        })
    })

    useSubscribe(`member_center.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-center', 'resource-query'],
        })
    })

    useSubscribe(`member_center.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-center', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <MemberCenterCreateUpdateFormModal {...createModal} />
            <MemberCenterTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberCenterTableAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
