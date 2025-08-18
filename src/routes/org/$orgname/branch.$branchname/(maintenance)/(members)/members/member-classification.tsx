import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { MemberClassificationCreateUpdateFormModal } from '@/components/forms/member-forms/member-classification-create-update-form'
import MemberClassificationTable from '@/components/tables/member/member-classification-table'
import MemberClassificationTableAction from '@/components/tables/member/member-classification-table/row-action-context'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-classification'
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

    useSubscribe(`member_classification.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-classification', 'resource-query'],
        })
    })

    useSubscribe(`member_classification.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-classification', 'resource-query'],
        })
    })

    useSubscribe(`member_classification.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-classification', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <MemberClassificationCreateUpdateFormModal {...createModal} />
            <MemberClassificationTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberClassificationTableAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
