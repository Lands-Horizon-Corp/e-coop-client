import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberTypeCreateUpdateFormModal } from '@/modules/member-type/components/member-type-create-update-form'
import MemberTypeTable from '@/modules/member-type/components/member-type-table'
import MemberTypeAction from '@/modules/member-type/components/member-type-table/row-action-context'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
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
            queryKey: ['member-type', 'paginated'],
        })
    })

    useSubscribe(`member_type.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-type', 'paginated'],
        })
    })

    useSubscribe(`member_type.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-type', 'paginated'],
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
                actionComponent={(prop) => <MemberTypeAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
