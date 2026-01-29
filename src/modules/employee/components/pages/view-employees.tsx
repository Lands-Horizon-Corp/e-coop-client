import { useQueryClient } from '@tanstack/react-query'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

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
            <PermissionGuard action="Read" resourceType="Employee">
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
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'Employee',
                            }),
                        },
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default ViewEmployeePage
