import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { MemberDepartmentCreateUpdateFormModal } from '@/components/forms/member-forms/member-department-create-update-form'
import MemberDepartmentTable from '@/components/tables/member/member-department-table'
import { MemberDepartmentAction } from '@/components/tables/member/member-department-table/row-action-context'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/members/member-department'
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

    useSubscribe(`member_department.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-department', 'resource-query'],
        })
    })

    useSubscribe(`member_department.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-department', 'resource-query'],
        })
    })

    useSubscribe(`member_department.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-department', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <MemberDepartmentCreateUpdateFormModal {...createModal} />
            <MemberDepartmentTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                actionComponent={(prop) => <MemberDepartmentAction {...prop} />}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
