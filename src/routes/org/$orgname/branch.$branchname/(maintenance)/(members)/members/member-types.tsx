import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberTypeTable from '@/components/tables/member/member-type-table'
import MemberTypeTableAction from '@/components/tables/member/member-type-table/action'
import { MemberTypeCreateUpdateFormModal } from '@/components/forms/member-forms/member-type-create-update-form'

import { useModalState } from '@/hooks/use-modal-state'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-types'
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

    useSubscribe(`member_type.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-type', 'resource-query'],
        })
    })

    useSubscribe(`member_type.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-type', 'resource-query'],
        })
    })

    useSubscribe(`member_type.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-type', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <MemberTypeCreateUpdateFormModal {...createModal} />
            <MemberTypeTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => <MemberTypeTableAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
