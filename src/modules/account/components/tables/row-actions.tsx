import { ReactNode, useState } from 'react'

import { toast } from 'sonner'

import {
    AccountCreateUpdateFormModal,
    IAccount,
    useDeleteById,
} from '@/modules/account'
import { TEntryType } from '@/modules/general-ledger'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import {
    BillIcon,
    BookOpenIcon,
    BookStackIcon,
    BookThickIcon,
    HandCoinsIcon,
    MoneyCheckIcon,
    SettingsIcon,
} from '@/components/icons'
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

import { useModalState } from '@/hooks/use-modal-state'

import { NameConfirmation } from '../forms/name-confirmation'
import { IAccountsTableActionComponentProp } from './columns'

interface UseAccountActionsProps {
    row: Row<IAccount>
    onDeleteSuccess?: () => void
}

const useAccountActions = ({
    row,
    onDeleteSuccess,
}: UseAccountActionsProps) => {
    const updateModal = useModalState()
    const confirmModal = useModalState()
    const [mode, setMode] = useState<'delete' | 'update'>('delete')
    const account = row.original

    const ledgerTableModal = useModalState()
    const [selectedEntryType, setSelectedEntryType] = useState<TEntryType>('')

    const { isPending: isDeletingAccount, mutate: deleteAccount } =
        useDeleteById({
            options: {
                onSuccess: () => {
                    onDeleteSuccess?.()
                    ledgerTableModal.onOpenChange(false)
                    updateModal.onOpenChange(false)
                    toast.success(`Account deleted successfully`)
                },
            },
        })

    const handleEdit = () => {
        setMode('update')
        confirmModal.onOpenChange(true)
    }
    const handleDelete = () => {
        confirmModal.onOpenChange(true)
        setMode('delete')
    }

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

    return {
        account,
        updateModal,
        ledgerTableModal,
        selectedEntryType,
        isDeletingAccount,
        handleEdit,
        handleDelete,
        openLedgerModal,
        getModalTitle,
        deleteAccount,
        confirmModal,
        mode,
    }
}

interface IAccountTableActionProps extends IAccountsTableActionComponentProp {
    onAccountUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const AccountAction = ({
    row,
    onDeleteSuccess,
}: IAccountTableActionProps) => {
    const {
        account,
        updateModal,
        ledgerTableModal,
        selectedEntryType,
        isDeletingAccount,
        handleEdit,
        handleDelete,
        openLedgerModal,
        getModalTitle,
        deleteAccount,
        confirmModal,
        mode,
    } = useAccountActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <NameConfirmation
                    description="This action cannot be undone. Please type the project name to confirm deletion."
                    title={`Confirm ${mode === 'delete' ? 'Deletion' : 'Update'}`}
                    {...confirmModal}
                    mode={mode}
                    name={row.original.name}
                    onConfirm={() => {
                        if (mode === 'delete') {
                            deleteAccount(row.original.id)
                        } else {
                            updateModal.onOpenChange(true)
                        }
                    }}
                />
                <Modal
                    {...ledgerTableModal}
                    className="!max-w-[95vw]"
                    description={`You are viewing account (${account.name}) ${getModalTitle().toLowerCase()}`}
                    title={getModalTitle()}
                >
                    <GeneralLedgerTable
                        accountId={account.id}
                        className="min-h-[90vh] !max-w-[90vw] min-w-0 max-h-[90vh]"
                        mode="account"
                        TEntryType={selectedEntryType}
                    />
                </Modal>
                <AccountCreateUpdateFormModal
                    {...updateModal}
                    description="Modify/Update account..."
                    formProps={{
                        accountId: account.id,
                        defaultValues: account,
                        onSuccess: () => {
                            toast.success('1 account updated')
                            updateModal.onOpenChange(false)
                        },
                    }}
                    title="Update Account"
                />
            </div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAccount,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
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
                    </>
                }
                row={row}
            />
        </>
    )
}

interface IAccountRowContextProps extends IAccountsTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const AccountRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IAccountRowContextProps) => {
    const {
        account,
        updateModal,
        ledgerTableModal,
        selectedEntryType,
        isDeletingAccount,
        handleEdit,
        handleDelete,
        openLedgerModal,
        getModalTitle,
    } = useAccountActions({ row, onDeleteSuccess })

    return (
        <>
            <Modal
                {...ledgerTableModal}
                className="!max-w-[95vw]"
                description={`You are viewing account (${account.name}) ${getModalTitle().toLowerCase()}`}
                title={getModalTitle()}
            >
                <GeneralLedgerTable
                    accountId={account.id}
                    className="min-h-[90vh] min-w-0 max-h-[90vh]"
                    mode="account"
                    TEntryType={selectedEntryType}
                />
            </Modal>
            <AccountCreateUpdateFormModal
                {...updateModal}
                description="Modify/Update account..."
                formProps={{
                    accountId: account.id,
                    defaultValues: account,
                    onSuccess: () => {
                        toast.success('1 account Added')
                        updateModal.onOpenChange(false)
                    },
                }}
                title="Update Account"
            />
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAccount,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>
                                <BookOpenIcon
                                    className="mr-2"
                                    strokeWidth={1.5}
                                />
                                GL Entries
                            </ContextMenuSubTrigger>
                            <ContextMenuPortal>
                                <ContextMenuSubContent>
                                    <ContextMenuItem
                                        onClick={() => openLedgerModal('')}
                                    >
                                        <BookThickIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        General Ledger
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('check-entry')
                                        }
                                    >
                                        <MoneyCheckIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Check Entry
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('online-entry')
                                        }
                                    >
                                        <BillIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Online Entry
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('cash-entry')
                                        }
                                    >
                                        <HandCoinsIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Cash Entry
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('payment-entry')
                                        }
                                    >
                                        <BillIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Payment Entry
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('withdraw-entry')
                                        }
                                    >
                                        <HandCoinsIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Withdraw Entry
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('deposit-entry')
                                        }
                                    >
                                        <HandCoinsIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Deposit Entry
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('journal-entry')
                                        }
                                    >
                                        <BookStackIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Journal Entry
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('adjustment-entry')
                                        }
                                    >
                                        <SettingsIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Adjustment Entry
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('journal-voucher')
                                        }
                                    >
                                        <BillIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Journal Voucher
                                    </ContextMenuItem>

                                    <ContextMenuItem
                                        onClick={() =>
                                            openLedgerModal('check-voucher')
                                        }
                                    >
                                        <MoneyCheckIcon
                                            className="mr-2"
                                            strokeWidth={1.5}
                                        />
                                        Check Voucher
                                    </ContextMenuItem>
                                </ContextMenuSubContent>
                            </ContextMenuPortal>
                        </ContextMenuSub>
                    </>
                }
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

// Maintain backward compatibility
const AccountTableAction = ({
    row,
    onDeleteSuccess,
}: IAccountTableActionProps) => {
    return <AccountAction onDeleteSuccess={onDeleteSuccess} row={row} />
}

export default AccountTableAction
