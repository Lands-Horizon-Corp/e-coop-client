import { ReactNode, useState } from 'react'

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

import { ITransaction } from '../../../transaction/transaction.types'
import { ITransactionTableActionComponentProp } from './columns'

interface UseTransactionActionsProps {
    row: Row<ITransaction>
    onDeleteSuccess?: () => void
}

const useTransactionActions = ({ row }: UseTransactionActionsProps) => {
    const transaction = row.original

    const ledgerTableModal = useModalState()
    const [selectedEntryType, setSelectedEntryType] = useState<TEntryType>('')

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
        transaction,
        ledgerTableModal,
        selectedEntryType,
        openLedgerModal,
        getModalTitle,
    }
}

interface ITransactionTableActionProps
    extends ITransactionTableActionComponentProp {
    onTransactionUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const TransactionAction = ({
    row,
    onDeleteSuccess,
}: ITransactionTableActionProps) => {
    const {
        selectedEntryType,
        transaction,
        ledgerTableModal,
        openLedgerModal,
        getModalTitle,
    } = useTransactionActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <Modal
                    {...ledgerTableModal}
                    className="max-w-[95vw]"
                    title={getModalTitle()}
                    description={`You are viewing transaction ${transaction.reference_number}'s ${getModalTitle().toLowerCase()}`}
                >
                    <GeneralLedgerTable
                        mode="transaction"
                        TEntryType={selectedEntryType}
                        transactionId={transaction.id}
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                    />
                </Modal>
            </div>

            <RowActionsGroup
                canSelect
                row={row}
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
            />
        </>
    )
}

interface ITransactionRowContextProps
    extends ITransactionTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const TransactionRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ITransactionRowContextProps) => {
    const {
        transaction,
        ledgerTableModal,
        selectedEntryType,
        openLedgerModal,
        getModalTitle,
    } = useTransactionActions({ row, onDeleteSuccess })

    return (
        <>
            <Modal
                {...ledgerTableModal}
                className="max-w-[95vw]"
                title={getModalTitle()}
                description={`You are viewing transaction ${transaction.reference_number}'s ${getModalTitle().toLowerCase()}`}
            >
                <GeneralLedgerTable
                    mode="transaction"
                    TEntryType={selectedEntryType}
                    transactionId={transaction.id}
                    className="min-h-[90vh] min-w-0 max-h-[90vh]"
                />
            </Modal>
            <DataTableRowContext
                row={row}
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
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

// Maintain backward compatibility
const TransactionTableAction = ({ row }: ITransactionTableActionProps) => {
    return <TransactionAction row={row} />
}

export default TransactionTableAction
