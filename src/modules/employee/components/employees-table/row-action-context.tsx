import { ReactNode, useState } from 'react'

import DisbursementTransactionTable from '@/modules/disbursement-transaction/components/disbursement-transaction-table'
import FootstepTable from '@/modules/footstep/components/footsteps-table'
import { TEntryType } from '@/modules/general-ledger'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import TimesheetTable from '@/modules/timesheet/components/timesheet-table'
import TransactionBatchTable from '@/modules/transaction-batch/components/transaction-batch-table'
import { TransactionsTable } from '@/modules/transactions'
import { IUserOrganization } from '@/modules/user-organization'
import { UserOrgPermissionUpdateFormModal } from '@/modules/user-organization/components/forms/user-org-permission-update-form'
import { UserOrgSettingsFormModal } from '@/modules/user-organization/components/forms/user-org-settings-form'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import {
    BillIcon,
    BookOpenIcon,
    BookThickIcon,
    BriefCaseClockIcon,
    FootstepsIcon,
    GearIcon,
    HandCoinsIcon,
    HandDropCoinsIcon,
    LayersIcon,
    MoneyCheckIcon,
    ReceiptIcon,
    UserShieldIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal from '@/components/modals/modal'
import {
    ContextMenuItem,
    ContextMenuPortal,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
} from '@/components/ui/context-menu'
import {
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

import { useDeleteEmployeeById } from '../../employee.service'
import { IEmployeesTableActionComponentProp } from './columns'

export type EmployeeActionType =
    | 'ledger'
    | 'footsteps'
    | 'timesheets'
    | 'transaction-batch'
    | 'transactions'
    | 'disbursement-transactions'
    | 'permissions'
    | 'settings'
    | 'delete'

export type EmployeeActionExtra = {
    entryType?: TEntryType
}

interface UseEmployeeActionsProps {
    row: Row<IUserOrganization>
    onDeleteSuccess?: () => void
}

const useEmployeeActions = ({
    row,
    onDeleteSuccess,
}: UseEmployeeActionsProps) => {
    const employee = row.original
    const [entryType, setEntryType] = useState<TEntryType>('')

    const { open } = useTableRowActionStore<
        IUserOrganization,
        EmployeeActionType,
        EmployeeActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingEmployee, mutate: deleteEmployee } =
        useDeleteEmployeeById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleDelete = () => {
        onOpen({
            title: 'Delete Employee',
            description: 'Are you sure you want to delete this employee?',
            onConfirm: () => deleteEmployee(employee.id),
        })
    }

    const openLedger = (type: TEntryType) => {
        setEntryType(type)
        open('ledger', { extra: { entryType: type } })
    }

    const getLedgerTitle = () => {
        const map: Record<TEntryType, string> = {
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

        return map[entryType] || 'General Ledger'
    }

    return {
        employee,
        entryType,
        isDeletingEmployee,
        handleDelete,
        openLedger,
        getLedgerTitle,
        open,
    }
}

interface IEmployeesTableActionProps
    extends IEmployeesTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const EmployeesAction = ({
    row,
    onDeleteSuccess,
}: IEmployeesTableActionProps) => {
    const { isDeletingEmployee, handleDelete, openLedger, open } =
        useEmployeeActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()} />
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingEmployee,
                    onClick: handleDelete,
                }}
                otherActions={
                    <>
                        <DropdownMenuItem onClick={() => open('permissions')}>
                            <UserShieldIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Edit permission
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => open('transaction-batch')}
                        >
                            <LayersIcon className="mr-2" strokeWidth={1.5} />
                            View Transaction Batch
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => open('transactions')}>
                            <ReceiptIcon className="mr-2" strokeWidth={1.5} />
                            View Transactions
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => open('timesheets')}>
                            <BriefCaseClockIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            View Timesheets
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => open('footsteps')}>
                            <FootstepsIcon className="mr-2" strokeWidth={1.5} />
                            View Footsteps
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => open('disbursement-transactions')}
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
                                        onClick={() => openLedger('')}
                                    >
                                        <BookThickIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        General Ledger
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            openLedger('check-entry')
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
                                            openLedger('online-entry')
                                        }
                                    >
                                        <BillIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Online Entry
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => openLedger('cash-entry')}
                                    >
                                        <HandCoinsIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Cash Entry
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuItem onClick={() => open('settings')}>
                            <GearIcon className="mr-2" strokeWidth={1.5} />
                            Settings
                        </DropdownMenuItem>
                    </>
                }
                row={row}
            />
        </>
    )
}

interface IEmployeesRowContextProps extends IEmployeesTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const EmployeesRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IEmployeesRowContextProps) => {
    const { isDeletingEmployee, handleDelete, openLedger, open } =
        useEmployeeActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeletingEmployee,
                onClick: handleDelete,
            }}
            otherActions={
                <>
                    <ContextMenuItem onClick={() => open('permissions')}>
                        <UserShieldIcon className="mr-2" strokeWidth={1.5} />
                        Edit permission
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => open('transaction-batch')}>
                        <LayersIcon className="mr-2" strokeWidth={1.5} />
                        View Transaction Batch
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => open('transactions')}>
                        <ReceiptIcon className="mr-2" strokeWidth={1.5} />
                        View Transactions
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => open('timesheets')}>
                        <BriefCaseClockIcon
                            className="mr-2"
                            strokeWidth={1.5}
                        />
                        View Timesheets
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => open('footsteps')}>
                        <FootstepsIcon className="mr-2" strokeWidth={1.5} />
                        View Footsteps
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => open('disbursement-transactions')}
                    >
                        <HandDropCoinsIcon className="mr-2" strokeWidth={1.5} />
                        Disbursement Transactions
                    </ContextMenuItem>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <BookOpenIcon className="mr-2" strokeWidth={1.5} />
                            GL Entries
                        </ContextMenuSubTrigger>
                        <ContextMenuPortal>
                            <ContextMenuSubContent>
                                <ContextMenuItem onClick={() => openLedger('')}>
                                    <BookThickIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    General Ledger
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={() => openLedger('check-entry')}
                                >
                                    <MoneyCheckIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    Check Entry
                                </ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuPortal>
                    </ContextMenuSub>
                    <ContextMenuItem onClick={() => open('settings')}>
                        <GearIcon className="mr-2" strokeWidth={1.5} />
                        Settings
                    </ContextMenuItem>
                </>
            }
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const EmployeesTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IUserOrganization,
        EmployeeActionType,
        EmployeeActionExtra
    >()

    if (!state) return null

    const employee = state.defaultValues
    const entryType = state.extra?.entryType ?? ''

    return (
        <>
            {state.action === 'ledger' && employee && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title="General Ledger"
                >
                    <GeneralLedgerTable
                        className="min-h-[75vh] min-w-0 max-h-[75vh]"
                        entryType={entryType}
                        excludeColumnIds={['balance']}
                        mode="employee"
                        userOrganizationId={employee.id}
                    />
                </Modal>
            )}

            {state.action === 'footsteps' && employee && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title={
                        <div className="flex gap-x-2 items-center">
                            <ImageDisplay
                                className="rounded-xl size-12"
                                src={employee.user.media?.download_url}
                            />
                            <div className="space-y-1">
                                <p>{employee.user.full_name}</p>
                                <p className="text-sm text-muted-foreground/80">
                                    Employee
                                </p>
                            </div>
                        </div>
                    }
                >
                    <FootstepTable
                        className="min-h-[90vh]"
                        mode="user-organization"
                        userOrgId={employee.id}
                    />
                </Modal>
            )}

            {state.action === 'timesheets' && employee && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Timesheet"
                >
                    <TimesheetTable
                        className="min-h-[90vh]"
                        mode="employee"
                        userOrganizationId={employee.id}
                    />
                </Modal>
            )}

            {state.action === 'transaction-batch' && employee && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Transaction Batch"
                >
                    <TransactionBatchTable
                        className="min-h-[90vh]"
                        mode="employee"
                        userOrganizationId={employee.id}
                    />
                </Modal>
            )}

            {state.action === 'transactions' && employee && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Transactions"
                >
                    <TransactionsTable
                        className="min-h-[90vh]"
                        mode="employee"
                        userId={employee.user_id}
                    />
                </Modal>
            )}

            {state.action === 'disbursement-transactions' && employee && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Disbursement Transactions"
                >
                    <DisbursementTransactionTable
                        className="min-h-[90vh]"
                        mode="employee"
                        userOrganizationId={employee.id}
                    />
                </Modal>
            )}

            {state.action === 'permissions' && employee && (
                <UserOrgPermissionUpdateFormModal
                    formProps={{
                        defaultValues: employee,
                        userOrganizatrionId: employee.id,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {state.action === 'settings' && employee && (
                <UserOrgSettingsFormModal
                    className="!max-w-[95vw]"
                    formProps={{
                        mode: 'specific',
                        defaultValues: employee,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default EmployeesAction
