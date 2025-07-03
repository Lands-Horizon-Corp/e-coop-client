import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { MemberOccupationCreateUpdateFormModal } from '@/components/forms/member-forms/member-occupation-create-update-form'
import MemberOccupationTable from '@/components/tables/member/member-occupation-table'
import MemberOccupationTableAction from '@/components/tables/member/member-occupation-table/action'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-occupation'
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

    useSubscribe(`member_occupation.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-occupation', 'resource-query'],
        })
    })

    useSubscribe(`member_occupation.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-occupation', 'resource-query'],
        })
    })

    useSubscribe(`member_occupation.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-occupation', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <MemberOccupationCreateUpdateFormModal {...createModal} />
            <MemberOccupationTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberOccupationTableAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
