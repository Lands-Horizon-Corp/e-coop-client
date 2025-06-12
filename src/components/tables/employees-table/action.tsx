import { IEmployeesTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
// import EmployeeFormModal from '@/components/forms/employee-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteEmployee } from '@/hooks/api-hooks/use-employee'

const EmployeesAction = ({
    row,
    onDeleteSuccess,
}: IEmployeesTableActionComponentProp & { onDeleteSuccess?: () => void }) => {
    const employee = row.original

    const { onOpen } = useConfirmModalStore()
    const { isPending: isDeleting, mutate: deleteEmployee } = useDeleteEmployee(
        {
            onSuccess: onDeleteSuccess,
        }
    )

    return (
        <>
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
                otherActions={<></>}
            />
        </>
    )
}

export default EmployeesAction
