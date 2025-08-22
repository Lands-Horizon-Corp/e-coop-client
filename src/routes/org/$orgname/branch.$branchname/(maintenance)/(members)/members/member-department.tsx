import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberDepartmentCreateUpdateFormModal } from '@/modules/member-department/components/member-department-create-update-form'
import MemberDepartmentTable from '@/modules/member-department/components/member-department-table'
import MemberDepartmentAction from '@/modules/member-department/components/member-department-table/row-action-context'

import PageContainer from '@/components/containers/page-container'

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
