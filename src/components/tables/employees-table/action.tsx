// import EmployeeFormModal from '@/components/forms/employee-create-update-form'
import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { UserOrgPermissionUpdateFormModal } from '@/components/forms/user-org-permission-update-form'
import { UserShieldIcon } from '@/components/icons'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useDeleteEmployee } from '@/hooks/api-hooks/use-employee'
import { useModalState } from '@/hooks/use-modal-state'

import { IEmployeesTableActionComponentProp } from './columns'

const EmployeesAction = ({
    row,
    onDeleteSuccess,
}: IEmployeesTableActionComponentProp & { onDeleteSuccess?: () => void }) => {
    const employee = row.original
    const permissionModal = useModalState()

    const { onOpen } = useConfirmModalStore()
    const { isPending: isDeleting, mutate: deleteEmployee } = useDeleteEmployee(
        {
            onSuccess: onDeleteSuccess,
        }
    )

    return (
        <>
            <>
                <UserOrgPermissionUpdateFormModal
                    {...permissionModal}
                    formProps={{
                        defaultValues: employee,
                        userOrganizatrionId: employee.id,
                    }}
                />
            </>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Employee',
                            description:
                                'Are you sure you want to delete this employee?',
                            onConfirm: () => deleteEmployee(employee.id),
                        })
                    },
                }}
                // onEdit={{
                //     text: 'Edit',
                //     isAllowed: true,
                //     onClick: () => setUpdateModalForm(true),
                // }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() => permissionModal.onOpenChange(true)}
                        >
                            <UserShieldIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Edit permission
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

export default EmployeesAction
