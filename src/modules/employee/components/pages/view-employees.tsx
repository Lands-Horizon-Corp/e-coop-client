import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import EmployeesTable from '../employees-table'
import { EmployeeCreateFormModal } from '../forms/employee-create-form'

const ViewEmployeePage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)

    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`employees.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['employees', 'paginated'],
        })
    )

    useSubscribe(`employees.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['employees', 'paginated'],
        })
    )

    useSubscribe(`employees.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['employees', 'paginated'],
        })
    )

    return (
        <PageContainer>
            <EmployeeCreateFormModal
                {...createModal}
                formProps={{
                    onSuccess: () => {},
                }}
            />
            <EmployeesTable
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

export default ViewEmployeePage
