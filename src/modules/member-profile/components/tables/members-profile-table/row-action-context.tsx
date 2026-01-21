import { ReactNode } from 'react'

import { useRouter } from '@tanstack/react-router'

import { withToastCallbacks } from '@/helpers/callback-helper'
import FootstepTable from '@/modules/footstep/components/footsteps-table'
import { TEntryType } from '@/modules/general-ledger'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import LoanTransactionTable from '@/modules/loan-transaction/components/loan-transaction-table'
import MemberAccountingLedgerTable from '@/modules/member-accounting-ledger/components/member-accounting-ledger-table'
import { MemberProfileCloseFormModal } from '@/modules/member-close-remark/components/forms/member-profile-close-form'
import { TransactionsTable } from '@/modules/transaction'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useInfoModalStore } from '@/store/info-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import {
    BillIcon,
    BookIcon,
    BookOpenIcon,
    BookStackIcon,
    BookThickIcon,
    EyeIcon,
    FootstepsIcon,
    HandCoinsIcon,
    HeartBreakFillIcon,
    MoneyCheckIcon,
    QrCodeIcon,
    ReceiptIcon,
    SettingsIcon,
    UserClockFillIcon,
    WalletIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal from '@/components/modals/modal'
import { QrCodeDownloadable } from '@/components/qr-code'
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

import { IMemberProfile, useDeleteMemberProfileById } from '../../..'
import { MemberHistoriesModal } from '../../member-histories'
import { MemberOverallInfoModal } from '../../member-infos/view-member-info'
import { IMemberProfileTableActionComponentProp } from './columns'

// ===== TYPE DEFINITIONS =====
export type MemberProfileActionType =
    | 'info'
    | 'history'
    | 'close'
    | 'footstep'
    | 'transaction'
    | 'ledger'
    | 'accounting-ledger'
    | 'loan-list'
    | 'qr'
    | 'delete'

export interface MemberProfileActionExtra {
    onDeleteSuccess?: () => void
    entryType?: TEntryType
}

interface UseMemberProfileActionsProps {
    row: Row<IMemberProfile>
    onDeleteSuccess?: () => void
}

const useMemberProfileActions = ({
    row,
    onDeleteSuccess,
}: UseMemberProfileActionsProps) => {
    const router = useRouter()
    const member = row.original
    const { onOpen } = useInfoModalStore()
    const { onOpen: onOpenConfirm } = useConfirmModalStore()
    const { open } = useTableRowActionStore<
        IMemberProfile,
        MemberProfileActionType,
        MemberProfileActionExtra
    >()

    const { mutate: deleteProfile, isPending: isDeleting } =
        useDeleteMemberProfileById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted member profile',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleDelete = () => {
        onOpenConfirm({
            title: 'Delete Member Profile',
            description: `Are you sure you want to delete ${member.full_name}'s profile? This action cannot be undone.`,
            onConfirm: () => deleteProfile(member.id),
        })
    }

    const handleInfo = () => {
        open('info', { id: member.id, defaultValues: member })
    }

    const handleHistory = () => {
        open('history', { id: member.id, defaultValues: member })
    }

    const handleClose = () => {
        open('close', {
            id: member.id,
            defaultValues: member,
            extra: { onDeleteSuccess },
        })
    }

    const handleFootstep = () => {
        open('footstep', { id: member.id, defaultValues: member })
    }

    const handleTransaction = () => {
        open('transaction', { id: member.id, defaultValues: member })
    }

    const handleLedger = (entryType: TEntryType = '') => {
        open('ledger', {
            id: member.id,
            defaultValues: member,
            extra: { entryType },
        })
    }

    const handleAccountingLedger = () => {
        open('accounting-ledger', { id: member.id, defaultValues: member })
    }

    const handleLoanList = () => {
        open('loan-list', { id: member.id, defaultValues: member })
    }

    const handleShowQR = () => {
        onOpen({
            title: 'Member Profile QR',
            description: 'Share this member profile QR Code.',
            classNames: {
                className: 'w-fit',
            },
            hideConfirm: true,
            component: (
                <div className="space-y-2">
                    <QrCodeDownloadable
                        className="size-80 p-3"
                        containerClassName="mx-auto"
                        fileName={`member_profile_${member.passbook}`}
                        value={JSON.stringify(member.qr_code)}
                    />
                </div>
            ),
        })
    }

    const handleEdit = () => {
        router.navigate({
            to: `../member-profile/${member.id}/personal-info`,
        })
    }

    return {
        member,
        isDeleting,
        handleEdit,
        handleDelete,
        handleInfo,
        handleHistory,
        handleClose,
        handleFootstep,
        handleTransaction,
        handleLedger,
        handleAccountingLedger,
        handleLoanList,
        handleShowQR,
    }
}

interface IMemberProfileTableActionProps
    extends IMemberProfileTableActionComponentProp {
    onMemberUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberProfileAction = ({
    row,
    onDeleteSuccess,
}: IMemberProfileTableActionProps) => {
    const {
        member,
        // isDeleting,
        handleEdit,
        // handleDelete,
        handleInfo,
        handleHistory,
        handleClose,
        handleFootstep,
        handleTransaction,
        handleLedger,
        handleAccountingLedger,
        handleLoanList,
        handleShowQR,
    } = useMemberProfileActions({ row, onDeleteSuccess })

    return (
        <RowActionsGroup
            canSelect
            // onDelete={{
            //     text: 'Delete',
            //     isAllowed: !isDeleting,
            //     onClick: handleDelete,
            // }}
            onEdit={{
                text: 'Edit',
                isAllowed: true,
                onClick: () => {
                    handleEdit()
                },
            }}
            otherActions={
                <>
                    <DropdownMenuItem onClick={handleInfo}>
                        <EyeIcon className="mr-2" strokeWidth={1.5} />
                        View Member&apos;s Info
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleHistory}>
                        <UserClockFillIcon className="mr-2" strokeWidth={1.5} />
                        Member History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleTransaction}>
                        <ReceiptIcon className="mr-2" strokeWidth={1.5} />
                        View Transactions
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={!member.user_id}
                        onClick={handleFootstep}
                    >
                        <FootstepsIcon className="mr-2" strokeWidth={1.5} />
                        See Footstep
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleAccountingLedger}>
                        <BookIcon className="mr-2" strokeWidth={1.5} />
                        View Accounting Ledger
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <BookOpenIcon className="mr-2" strokeWidth={1.5} />
                            GL Entries
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem
                                    onClick={() => handleLedger('')}
                                >
                                    <BookThickIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    General Ledger
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleLedger('check-entry')}
                                >
                                    <MoneyCheckIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    Check Entry
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleLedger('online-entry')}
                                >
                                    <BillIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    Online Entry
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleLedger('cash-entry')}
                                >
                                    <HandCoinsIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    Cash Entry
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() =>
                                        handleLedger('payment-entry')
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
                                        handleLedger('withdraw-entry')
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
                                        handleLedger('deposit-entry')
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
                                        handleLedger('journal-entry')
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
                                        handleLedger('adjustment-entry')
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
                                        handleLedger('journal-voucher')
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
                                        handleLedger('check-voucher')
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

                    <DropdownMenuItem onClick={handleShowQR}>
                        <QrCodeIcon className="mr-2" />
                        Member Profile QR
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleLoanList}>
                        <WalletIcon className="mr-2" />
                        Loans
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="focus:bg-destructive focus:text-destructive-foreground"
                        onClick={handleClose}
                    >
                        <HeartBreakFillIcon
                            className="mr-2 text-rose-500 duration-200 group-focus:text-destructive-foreground"
                            strokeWidth={1.5}
                        />
                        Close Profile/Account
                    </DropdownMenuItem>
                </>
            }
            row={row}
        />
    )
}

interface IMemberProfileRowContextProps
    extends IMemberProfileTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberProfileRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberProfileRowContextProps) => {
    const {
        member,
        // isDeleting,
        handleEdit,
        // handleDelete,
        handleInfo,
        handleHistory,
        handleClose,
        handleFootstep,
        handleTransaction,
        handleLedger,
        handleAccountingLedger,
        handleLoanList,
        handleShowQR,
    } = useMemberProfileActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            // onDelete={{
            //     text: 'Delete',
            //     isAllowed: !isDeleting,
            //     onClick: handleDelete,
            // }}
            onEdit={{
                text: 'Edit',
                isAllowed: true,
                onClick: () => {
                    handleEdit()
                },
            }}
            otherActions={
                <>
                    <ContextMenuItem onClick={handleInfo}>
                        <EyeIcon className="mr-2" strokeWidth={1.5} />
                        View Member&apos;s Info
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleHistory}>
                        <UserClockFillIcon className="mr-2" strokeWidth={1.5} />
                        Member History
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleTransaction}>
                        <ReceiptIcon className="mr-2" strokeWidth={1.5} />
                        View Transactions
                    </ContextMenuItem>
                    <ContextMenuItem
                        disabled={!member.user_id}
                        onClick={handleFootstep}
                    >
                        <FootstepsIcon className="mr-2" strokeWidth={1.5} />
                        See Footstep
                    </ContextMenuItem>

                    <ContextMenuItem onClick={handleAccountingLedger}>
                        <BookIcon className="mr-2" strokeWidth={1.5} />
                        View Accounting Ledger
                    </ContextMenuItem>

                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <BookOpenIcon className="mr-2" strokeWidth={1.5} />
                            GL Entries
                        </ContextMenuSubTrigger>
                        <ContextMenuPortal>
                            <ContextMenuSubContent>
                                <ContextMenuItem
                                    onClick={() => handleLedger('')}
                                >
                                    <BookThickIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    General Ledger
                                </ContextMenuItem>

                                <ContextMenuItem
                                    onClick={() => handleLedger('check-entry')}
                                >
                                    <MoneyCheckIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    Check Entry
                                </ContextMenuItem>

                                <ContextMenuItem
                                    onClick={() => handleLedger('online-entry')}
                                >
                                    <BillIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    Online Entry
                                </ContextMenuItem>

                                <ContextMenuItem
                                    onClick={() => handleLedger('cash-entry')}
                                >
                                    <HandCoinsIcon
                                        className="mr-2"
                                        strokeWidth={1.5}
                                    />
                                    Cash Entry
                                </ContextMenuItem>

                                <ContextMenuItem
                                    onClick={() =>
                                        handleLedger('payment-entry')
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
                                        handleLedger('withdraw-entry')
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
                                        handleLedger('deposit-entry')
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
                                        handleLedger('journal-entry')
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
                                        handleLedger('adjustment-entry')
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
                                        handleLedger('journal-voucher')
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
                                        handleLedger('check-voucher')
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

                    <ContextMenuItem onClick={handleShowQR}>
                        <QrCodeIcon className="mr-2" />
                        Member Profile QR
                    </ContextMenuItem>

                    <ContextMenuItem onClick={handleLoanList}>
                        <WalletIcon className="mr-2" />
                        Loans
                    </ContextMenuItem>

                    <ContextMenuItem
                        className="focus:bg-destructive focus:text-destructive-foreground"
                        onClick={handleClose}
                    >
                        <HeartBreakFillIcon
                            className="mr-2 text-rose-500 duration-200 group-focus:text-destructive-foreground"
                            strokeWidth={1.5}
                        />
                        Close Profile/Account
                    </ContextMenuItem>
                </>
            }
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

const getEntryTypeTitle = (entryType: TEntryType): string => {
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

export const MemberProfileTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMemberProfile,
        MemberProfileActionType,
        MemberProfileActionExtra
    >()

    const member = state.defaultValues
    const entryType = state.extra?.entryType ?? ''

    return (
        <>
            {state.action === 'info' && member && (
                <MemberOverallInfoModal
                    onOpenChange={close}
                    open={state.isOpen}
                    overallInfoProps={{
                        memberProfileId: member.id,
                    }}
                />
            )}

            {state.action === 'history' && member && (
                <MemberHistoriesModal
                    memberHistoryProps={{
                        profileId: member.id,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {state.action === 'close' && member && (
                <MemberProfileCloseFormModal
                    formProps={{
                        profileId: member.id,
                        defaultValues: {
                            remarks: member.member_close_remarks ?? [],
                        },
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {state.action === 'footstep' && member && (
                <Modal
                    className="!max-w-[95vw]"
                    description={`You are viewing ${member.full_name}'s footstep`}
                    onOpenChange={close}
                    open={state.isOpen}
                    title={
                        <div className="flex gap-x-2 items-center">
                            <ImageDisplay
                                className="rounded-xl size-12"
                                src={member.media?.download_url}
                            />
                            <div className="space-y-1">
                                <p>{member.full_name}</p>
                                <p className="text-sm text-muted-foreground/80">
                                    Member
                                </p>
                            </div>
                        </div>
                    }
                >
                    <FootstepTable
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                        memberProfileId={member.id}
                        mode="member-profile"
                    />
                </Modal>
            )}

            {state.action === 'transaction' && member && (
                <Modal
                    className="!max-w-[95vw]"
                    description={`You are viewing ${member.full_name}'s transactions`}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Transactions"
                >
                    <TransactionsTable
                        className="min-h-[90vh] min-w-0 max-h-[90vh]"
                        memberProfileId={member.id}
                        mode="member-profile"
                        onRowClick={() => {}}
                    />
                </Modal>
            )}

            {state.action === 'ledger' && member && (
                <Modal
                    className="!max-w-[95vw]"
                    description={`You are viewing ${member.full_name}'s ${getEntryTypeTitle(entryType).toLowerCase()}`}
                    onOpenChange={close}
                    open={state.isOpen}
                    title={getEntryTypeTitle(entryType)}
                >
                    <GeneralLedgerTable
                        className="min-h-[75vh] min-w-0 max-h-[75vh]"
                        entryType={entryType}
                        excludeColumnIds={['balance']}
                        memberProfileId={member.id}
                        mode="member"
                    />
                </Modal>
            )}

            {state.action === 'accounting-ledger' && member && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title={`${member.first_name}'s Accounting Ledger`}
                >
                    <MemberAccountingLedgerTable
                        className="min-h-[75vh] min-w-0 max-h-[75vh]"
                        memberProfileId={member.id}
                        mode="member"
                    />
                </Modal>
            )}

            {state.action === 'loan-list' && member && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title={`${member.first_name}'s Loans`}
                >
                    <LoanTransactionTable
                        className="min-h-[80vh] min-w-0 max-h-[80vh]"
                        memberProfileId={member.id}
                        mode="member-profile"
                    />
                </Modal>
            )}
        </>
    )
}

// Default export for backward compatibility
export default MemberProfileAction
