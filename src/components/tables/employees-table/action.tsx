// import EmployeeFormModal from '@/components/forms/employee-create-update-form'
import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { UserOrgPermissionUpdateFormModal } from '@/components/forms/user-org-permission-update-form'
import {
    BriefCaseClockIcon,
    FootstepsIcon,
    GearIcon,
    LayersIcon,
    UserShieldIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal from '@/components/modals/modal'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useDeleteEmployee } from '@/hooks/api-hooks/use-employee'
import { useModalState } from '@/hooks/use-modal-state'

import FootstepTable from '../footsteps-table'
import TimesheetTable from '../timesheet-table'
import TransactionBatchTable from '../transaction-batch-table'
import { IEmployeesTableActionComponentProp } from './columns'

const EmployeesAction = ({
    row,
    onDeleteSuccess,
}: IEmployeesTableActionComponentProp & { onDeleteSuccess?: () => void }) => {
    const employee = row.original
    const permissionModal = useModalState()
    const footstepModal = useModalState()
    const timesheetModal = useModalState()
    const transactionBatchModal = useModalState()

    const { onOpen } = useConfirmModalStore()
    const { isPending: isDeleting, mutate: deleteEmployee } = useDeleteEmployee(
        {
            onSuccess: onDeleteSuccess,
        }
    )

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <UserOrgPermissionUpdateFormModal
                    {...permissionModal}
                    formProps={{
                        defaultValues: employee,
                        userOrganizatrionId: employee.id,
                    }}
                />
                <Modal
                    {...footstepModal}
                    className="max-w-[95vw]"
                    title={
                        <div className="flex gap-x-2 items-center">
                            <ImageDisplay
                                src={employee.user.media?.download_url}
                                className="rounded-xl size-12"
                            />
                            <div className="space-y-1">
                                <p>{employee.user.full_name}</p>
                                <p className="text-sm text-muted-foreground/80">
                                    Employee
                                </p>
                            </div>
                        </div>
                    }
                    description={`You are viewing ${employee.user.full_name}'s footstep`}
                >
                    <FootstepTable
                        userOrgId={employee.id}
                        mode="user-organization"
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                    />
                </Modal>
                <Modal
                    {...timesheetModal}
                    className="max-w-[95vw]"
                    title="Timesheet"
                    description={`You are viewing ${employee.user.full_name}'s timesheet`}
                >
                    <TimesheetTable
                        mode="employee"
                        onRowClick={() => {}}
                        userOrganizationId={employee.id}
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                    />
                </Modal>
                <Modal
                    {...transactionBatchModal}
                    className="max-w-[95vw]"
                    title="Transaction Batch"
                    description={`You are viewing ${employee.user.full_name}'s transaction batch`}
                >
                    <TransactionBatchTable
                        mode="employee"
                        onRowClick={() => {}}
                        userOrganizationId={employee.id}
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                    />
                </Modal>
            </div>
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
                        <DropdownMenuItem
                            onClick={() =>
                                transactionBatchModal.onOpenChange(true)
                            }
                        >
                            <LayersIcon className="mr-2" strokeWidth={1.5} />
                            View Transaction Batch
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => timesheetModal.onOpenChange(true)}
                        >
                            <BriefCaseClockIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            View Timesheets
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => footstepModal.onOpenChange(true)}
                        >
                            <FootstepsIcon className="mr-2" strokeWidth={1.5} />
                            View Footsteps
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        // onClick={() => footstepModal.onOpenChange(true)}
                        >
                            <GearIcon className="mr-2" strokeWidth={1.5} />
                            Settings
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

export default EmployeesAction
