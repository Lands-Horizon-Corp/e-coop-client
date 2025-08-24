import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberCenterCreateUpdateFormModal } from '@/modules/member-center/components/member-center-create-update-form'
import MemberCenterTable from '@/modules/member-center/components/tables/member-center-table'
import MemberCenterAction from '@/modules/member-center/components/tables/member-center-table/row-action-context'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

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
            queryKey: ['member-center', 'paginated'],
        })
    })

    useSubscribe(`member_center.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-center', 'paginated'],
        })
    })

    useSubscribe(`member_center.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-center', 'paginated'],
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
                actionComponent={(prop) => <MemberCenterAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
