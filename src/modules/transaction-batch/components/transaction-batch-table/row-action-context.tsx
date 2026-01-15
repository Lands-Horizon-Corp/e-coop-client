import { ReactNode } from 'react'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import DisbursementTransactionTable from '@/modules/disbursement-transaction/components/disbursement-transaction-table'
import { TEntryType } from '@/modules/general-ledger'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import {
    BillIcon,
    BookOpenIcon,
    BookStackIcon,
    BookThickIcon,
    ClockIcon,
    EyeIcon,
    HandCoinsIcon,
    HandDropCoinsIcon,
    MoneyCheckIcon,
    SettingsIcon,
} from '@/components/icons'
import Modal from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import {
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuPortal,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
} from '@/components/ui/context-menu'
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

import {
    useDeleteTransactionBatchById,
    useTransactionBatchAcceptBlotterView,
} from '../../transaction-batch.service'
import { ITransactionBatch } from '../../transaction-batch.types'
import { TransactionBatchHistoriesModal } from '../transaction-batch/transaction-batch-histories'
import { BatchBlotterQuickViewModal } from '../transaction-batch/transaction-batch-quick-view'
import { ITransactionBatchTableActionComponentProp } from './columns'

export type TransactionBatchActionType =
    | 'delete'
    | 'view-disbursements'
    | 'view-ledger'
    | 'view-history'
    | 'quick-view'

export interface TransactionBatchActionExtra {
    entryType?: TEntryType
}

interface UseTransactionBatchActionsProps {
    row: Row<ITransactionBatch>
    onDeleteSuccess?: () => void
}

const useTransactionBatchActions = ({
    row,
    onDeleteSuccess,
}: UseTransactionBatchActionsProps) => {
    const batch = row.original
    const { open } = useTableRowActionStore<
        ITransactionBatch,
        TransactionBatchActionType,
        TransactionBatchActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const {
        currentAuth: { user },
    } = useAuthUser()

    const { isPending: isDeletingBatch, mutate: deleteBatch } =
        useDeleteTransactionBatchById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const { mutate: approve, isPending: isAproving } =
        useTransactionBatchAcceptBlotterView()

    const handleDelete = () => {
        onOpen({
            title: 'Delete Transaction Batch',
            description:
                'Are you sure you want to delete this Transaction Batch?',
            onConfirm: () => deleteBatch(batch.id),
        })
    }

    const handleApproveView = () => {
        onOpen({
            title: 'Approve View',
            description:
                'Are you sure to approve this employee from viewing own transaction batch summary?',
            confirmString: 'Allow',
            onConfirm: () => approve(batch.id),
        })
    }

    const openLedgerModal = (entryType: TEntryType) => {
        open('view-ledger', {
            id: batch.id,
            defaultValues: batch,
            extra: { entryType },
        })
    }

    const handleQuickView = () => {
        open('quick-view', {
            id: batch.id,
            defaultValues: batch,
        })
    }

    const handleViewHistory = () => {
        open('view-history', {
            id: batch.id,
            defaultValues: batch,
        })
    }

    const handleViewDisbursements = () => {
        open('view-disbursements', {
            id: batch.id,
            defaultValues: batch,
        })
    }

    const getModalTitle = (entryType?: TEntryType) => {
        if (!entryType) return 'General Ledger'

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

        return entryTypeNames[entryType] || 'General Ledger'
    }

    return {
        batch,
        user,
        isDeletingBatch,
        isAproving,
        handleDelete,
        handleApproveView,
        openLedgerModal,
        handleQuickView,
        handleViewHistory,
        handleViewDisbursements,
        getModalTitle,
    }
}

interface ITransactionBatchTableActionProps
    extends ITransactionBatchTableActionComponentProp {
    onBatchUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const TransactionBatchAction = ({
    row,
    onDeleteSuccess,
}: ITransactionBatchTableActionProps) => {
    const {
        batch,
        user,
        isDeletingBatch,
        isAproving,
        handleDelete,
        handleApproveView,
        openLedgerModal,
        handleQuickView,
        handleViewHistory,
        handleViewDisbursements,
    } = useTransactionBatchActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingBatch,
                    onClick: handleDelete,
                }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            disabled={
                                user?.id === batch.employee_user_id &&
                                batch.can_view === false
                            }
                            onClick={handleQuickView}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Quick Summary
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleViewHistory}>
                            <ClockIcon className="mr-2" strokeWidth={1.5} />
                            View Histories
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleViewDisbursements}>
                            <HandDropCoinsIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            View Disbursements
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

                        <DropdownMenuLabel>Advance</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={batch.can_view}
                            onClick={handleApproveView}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            Approve Blotter View{' '}
                            {isAproving && <LoadingSpinner />}
                        </DropdownMenuItem>
                    </>
                }
                row={row}
            />
        </>
    )
}

interface ITransactionBatchRowContextProps
    extends ITransactionBatchTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const TransactionBatchRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ITransactionBatchRowContextProps) => {
    const {
        batch,
        user,
        isDeletingBatch,
        isAproving,
        handleDelete,
        handleApproveView,
        openLedgerModal,
        handleQuickView,
        handleViewHistory,
        handleViewDisbursements,
    } = useTransactionBatchActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingBatch,
                    onClick: handleDelete,
                }}
                otherActions={
                    <>
                        <ContextMenuItem
                            disabled={
                                user?.id === batch.employee_user_id &&
                                batch.can_view === false
                            }
                            onClick={handleQuickView}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Quick Summary
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleViewHistory}>
                            <ClockIcon className="mr-2" strokeWidth={1.5} />
                            View Histories
                        </ContextMenuItem>

                        <ContextMenuItem onClick={handleViewDisbursements}>
                            <HandDropCoinsIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Disbursement Transactions
                        </ContextMenuItem>

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

                        <ContextMenuLabel>Advance</ContextMenuLabel>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                            disabled={batch.can_view}
                            onClick={handleApproveView}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            Approve Blotter View{' '}
                            {isAproving && <LoadingSpinner />}
                        </ContextMenuItem>
                    </>
                }
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const TransactionBatchTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ITransactionBatch,
        TransactionBatchActionType,
        TransactionBatchActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const batch = state.defaultValues
    const entryType = state.extra?.entryType || ''

    const getModalTitle = (entryType?: TEntryType) => {
        if (!entryType) return 'General Ledger'

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

        return entryTypeNames[entryType] || 'General Ledger'
    }

    return (
        <>
            {state.action === 'view-disbursements' && (
                <Modal
                    className="!max-w-[95vw]"
                    description={`You are viewing ${batch.batch_name || 'unknown'}'s disbursement transactions`}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Disbursement Transactions"
                >
                    <DisbursementTransactionTable
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                        mode="transaction-batch"
                        transactionBatchId={batch.id}
                    />
                </Modal>
            )}
            {state.action === 'view-ledger' && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title={getModalTitle(entryType)}
                >
                    <GeneralLedgerTable
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                        entryType={entryType}
                        mode="transaction-batch"
                        transactionBatchId={batch.id}
                    />
                </Modal>
            )}
            {state.action === 'view-history' && (
                <TransactionBatchHistoriesModal
                    onOpenChange={close}
                    open={state.isOpen}
                    transactionBatchHistoryProps={{
                        transactionBatchId: batch.id,
                    }}
                />
            )}
            {state.action === 'quick-view' && (
                <BatchBlotterQuickViewModal
                    batchBlotterProps={{
                        transBatch: batch,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default TransactionBatchAction
