import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { MemberDepartmentCreateUpdateFormModal } from '@/modules/member-department/components/member-department-create-update-form'
import MemberDepartmentTable from '@/modules/member-department/components/member-department-table'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

const MemberDepartmentPage = () => {
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(`member_department.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-department', 'paginated'],
        })
    })

    useSubscribe(`member_department.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-department', 'paginated'],
        })
    })

    useSubscribe(`member_department.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-department', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <MemberDepartmentCreateUpdateFormModal {...createModal} />
            <MemberDepartmentTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
            />
        </PageContainer>
    )
}

export default MemberDepartmentPage
