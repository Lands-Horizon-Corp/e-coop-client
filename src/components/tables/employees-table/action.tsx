import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { UserOrgSettingsFormModal } from '@/components/forms/settings-forms/user-org-settings-form'
import { UserOrgPermissionUpdateFormModal } from '@/components/forms/user-org-permission-update-form'
import {
    BillIcon,
    BookOpenIcon,
    BookStackIcon,
    BookThickIcon,
    BriefCaseClockIcon,
    FootstepsIcon,
    GearIcon,
    HandCoinsIcon,
    HandDropCoinsIcon,
    LayersIcon,
    MoneyCheckIcon,
    ReceiptIcon,
    SettingsIcon,
    UserShieldIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal from '@/components/modals/modal'
import {
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

import { useDeleteEmployee } from '@/hooks/api-hooks/use-employee'
import { useModalState } from '@/hooks/use-modal-state'

import { TEntryType } from '@/types'

import DisbursementTransactionTable from '../disbursement-transaction-table'
import FootstepTable from '../footsteps-table'
import GeneralLedgerTable from '../ledgers-tables/general-ledger-table'
import TimesheetTable from '../timesheet-table'
import TransactionBatchTable from '../transaction-batch-table'
import TransactionBatchTableAction from '../transaction-batch-table/action'
import TransactionTable from '../transaction-table'
import { IEmployeesTableActionComponentProp } from './columns'

const EmployeesAction = ({
    row,
    onDeleteSuccess,
}: IEmployeesTableActionComponentProp & { onDeleteSuccess?: () => void }) => {
    const employee = row.original
    const footstepModal = useModalState()
    const timesheetModal = useModalState()
    const permissionModal = useModalState()
    const transactionBatchModal = useModalState()
    const transactionsModal = useModalState()
    const userSettingsModal = useModalState()
    const disbursementTransactionsModal = useModalState()

    const ledgerTableModal = useModalState()
    const [selectedEntryType, setSelectedEntryType] = useState<TEntryType>('')

    const { onOpen } = useConfirmModalStore()
    const { isPending: isDeleting, mutate: deleteEmployee } = useDeleteEmployee(
        {
            onSuccess: onDeleteSuccess,
        }
    )

    const openLedgerModal = (entryType: TEntryType) => {
        setSelectedEntryType(entryType)
        ledgerTableModal.onOpenChange(true)
    }

    const getModalTitle = () => {
        if (!selectedEntryType) return 'General Ledger'

        const entryTypeNames: Record<TEntryType, string> = {
            '': 'General Ledger',
            'check-entry': 'Check Entry',
            'online-entry': 'Online Entry',
            'cash-entry': 'Cash Entry',
            'payment-entry': 'Payment Entry',
            'withdraw-entry': 'Withdraw Entry',
            'deposit-entry': 'Deposit Entry',
            'journal-entry': 'Journal Entry',
            'adjustment-entry': 'Adjustment Entry',
            'journal-voucher': 'Journal Voucher',
            'check-voucher': 'Check Voucher',
        }

        return entryTypeNames[selectedEntryType] || 'General Ledger'
    }

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <Modal
                    {...ledgerTableModal}
                    className="max-w-[95vw]"
                    title={getModalTitle()}
                    description={`You are viewing ${employee.user.full_name}'s ${getModalTitle().toLowerCase()}`}
                >
                    <GeneralLedgerTable
                        mode="employee"
                        TEntryType={selectedEntryType}
                        userOrganizationId={employee.id}
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                    />
                </Modal>

                <Modal
                    className="max-w-[95vw]"
                    title="Disbursement Transactions"
                    {...disbursementTransactionsModal}
                    description={`You are viewing ${employee.user.full_name || 'unknown'}'s disbursement transactions`}
                >
                    <DisbursementTransactionTable
                        mode="employee"
                        userOrganizationId={employee.id}
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                    />
                </Modal>

                <UserOrgSettingsFormModal
                    {...userSettingsModal}
                    formProps={{
                        mode: 'specific',
                        defaultValues: employee,
                    }}
                />
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
                        actionComponent={(props) => (
                            <TransactionBatchTableAction {...props} />
                        )}
                        onRowClick={() => {}}
                        userOrganizationId={employee.id}
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                    />
                </Modal>

                <Modal
                    {...transactionsModal}
                    className="max-w-[95vw]"
                    title="Transactions"
                    description={`You are viewing ${employee.user.full_name}'s transactions`}
                >
                    <TransactionTable
                        mode="employee"
                        onRowClick={() => {}}
                        userId={employee.user_id}
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
                            onClick={() => transactionsModal.onOpenChange(true)}
                        >
                            <ReceiptIcon className="mr-2" strokeWidth={1.5} />
                            View Transactions
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
                            onClick={() =>
                                disbursementTransactionsModal.onOpenChange(true)
                            }
                        >
                            <HandDropCoinsIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Disbursement Transactions
                        </DropdownMenuItem>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <BookOpenIcon
                                    className="mr-2"
                                    strokeWidth={1.5}
                                />
                                GL Entries
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onClick={() => openLedgerModal('')}
                                    >
                                        <BookThickIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        General Ledger
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('check-entry')
                                        }
                                    >
                                        <MoneyCheckIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Check Entry
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('online-entry')
                                        }
                                    >
                                        <BillIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Online Entry
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('cash-entry')
                                        }
                                    >
                                        <HandCoinsIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Cash Entry
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('payment-entry')
                                        }
                                    >
                                        <BillIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Payment Entry
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('withdraw-entry')
                                        }
                                    >
                                        <HandCoinsIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Withdraw Entry
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('deposit-entry')
                                        }
                                    >
                                        <HandCoinsIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Deposit Entry
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('journal-entry')
                                        }
                                    >
                                        <BookStackIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Journal Entry
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('adjustment-entry')
                                        }
                                    >
                                        <SettingsIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Adjustment Entry
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('journal-voucher')
                                        }
                                    >
                                        <BillIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Journal Voucher
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedgerModal('check-voucher')
                                        }
                                    >
                                        <MoneyCheckIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Check Voucher
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuItem
                            onClick={() => userSettingsModal.onOpenChange(true)}
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
