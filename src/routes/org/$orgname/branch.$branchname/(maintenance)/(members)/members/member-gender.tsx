import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberGenderTable from '@/components/tables/member/member-genders-table'
import MemberGenderTableAction from '@/components/tables/member/member-genders-table/action'
import { MemberGenderCreateUpdateFormModal } from '@/components/forms/member-forms/member-gender-create-update-form'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQueryClient } from '@tanstack/react-query'
import { useModalState } from '@/hooks/use-modal-state'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-gender'
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

    useSubscribe(`member_gender.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-gender', 'resource-query'],
        })
    })

    useSubscribe(`member_gender.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-gender', 'resource-query'],
        })
    })

    useSubscribe(`member_gender.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-gender', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <MemberGenderCreateUpdateFormModal {...createModal} />
            <MemberGenderTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => (
                    <MemberGenderTableAction {...prop} />
                )}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
