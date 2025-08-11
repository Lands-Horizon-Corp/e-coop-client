import { ReactNode, useState } from 'react'

import { useInfoModalStore } from '@/store/info-modal-store'
import { useRouter } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { MemberProfileCloseFormModal } from '@/components/forms/member-forms/member-profile-close-form'
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
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { MemberHistoriesModal } from '@/components/member-infos/member-histories'
import { MemberOverallInfoModal } from '@/components/member-infos/view-member-info'
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

import { useDeleteMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'
import { useModalState } from '@/hooks/use-modal-state'

import { IMemberProfile, TEntryType } from '@/types'

import FootstepTable from '../../footsteps-table'
import GeneralLedgerTable from '../../ledgers-tables/general-ledger-table'
import MemberAccountingLedgerTable from '../../ledgers-tables/member-accounting-ledger-table'
import TransactionTable from '../../transaction-table'
import { IMemberProfileTableActionComponentProp } from './columns'

interface UseMemberProfileActionsProps {
    row: Row<IMemberProfile>
    onDeleteSuccess?: () => void
}

const useMemberProfileActions = ({
    row,
    onDeleteSuccess,
}: UseMemberProfileActionsProps) => {
    const member = row.original
    const router = useRouter()
    const { onOpen } = useInfoModalStore()

    const infoModal = useModalState(false)
    const closeModal = useModalState(false)
    const historyModal = useModalState(false)
    const footstepModal = useModalState(false)
    const transactionModal = useModalState(false)
    const ledgerTableModal = useModalState()
    const accountingLedgerModal = useModalState()

    const [selectedEntryType, setSelectedEntryType] = useState<TEntryType>('')

    const { mutate: deleteProfile, isPending: isDeleting } =
        useDeleteMemberProfile({
            onSuccess: onDeleteSuccess,
        })

    const handleEdit = () => {
        router.navigate({
            to: `../member-profile/${member.id}/personal-info`,
        })
    }

    const handleDelete = () => deleteProfile(member.id)

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

    return {
        member,
        infoModal,
        closeModal,
        historyModal,
        footstepModal,
        transactionModal,
        ledgerTableModal,
        accountingLedgerModal,
        selectedEntryType,
        isDeleting,
        handleEdit,
        handleDelete,
        openLedgerModal,
        getModalTitle,
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
        infoModal,
        closeModal,
        historyModal,
        footstepModal,
        transactionModal,
        ledgerTableModal,
        selectedEntryType,
        accountingLedgerModal,
        isDeleting,
        handleEdit,
        handleDelete,
        openLedgerModal,
        getModalTitle,
        handleShowQR,
    } = useMemberProfileActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                {member && (
                    <>
                        <Modal
                            {...ledgerTableModal}
                            className="max-w-[95vw]"
                            title={getModalTitle()}
                            description={`You are viewing ${member.full_name}'s ${getModalTitle().toLowerCase()}`}
                        >
                            <GeneralLedgerTable
                                mode="member"
                                memberProfileId={member.id}
                                TEntryType={selectedEntryType}
                                excludeColumnIds={['balance']}
                                className="min-h-[75vh] min-w-0 max-h-[75vh]"
                            />
                        </Modal>

                        <MemberHistoriesModal
                            {...historyModal}
                            memberHistoryProps={{
                                profileId: member.id,
                            }}
                        />
                        <MemberOverallInfoModal
                            {...infoModal}
                            overallInfoProps={{
                                memberProfileId: member.id,
                            }}
                        />
                        <MemberProfileCloseFormModal
                            {...closeModal}
                            formProps={{
                                profileId: member.id,
                                defaultValues: {
                                    remarks: member.member_close_remarks ?? [],
                                },
                            }}
                        />
                        <Modal
                            {...footstepModal}
                            className="max-w-[95vw]"
                            title={
                                <div className="flex gap-x-2 items-center">
                                    <ImageDisplay
                                        src={member.media?.download_url}
                                        className="rounded-xl size-12"
                                    />
                                    <div className="space-y-1">
                                        <p>{member.full_name}</p>
                                        <p className="text-sm text-muted-foreground/80">
                                            Member
                                        </p>
                                    </div>
                                </div>
                            }
                            description={`You are viewing ${member.full_name}'s footstep`}
                        >
                            <FootstepTable
                                mode="member-profile"
                                memberProfileId={member.id}
                                className="min-h-[90vh] min-w-0 max-h-[90vh]"
                            />
                        </Modal>

                        <Modal
                            {...transactionModal}
                            className="max-w-[95vw]"
                            title="Transactions"
                            description={`You are viewing ${member.full_name}'s transactions`}
                        >
                            <TransactionTable
                                mode="member-profile"
                                onRowClick={() => {}}
                                memberProfileId={member.id}
                                className="min-h-[90vh] min-w-0 max-h-[90vh]"
                            />
                        </Modal>

                        <Modal
                            {...accountingLedgerModal}
                            title={`${member.first_name}'s Accounting Ledger`}
                            className="max-w-[95vw]"
                        >
                            <MemberAccountingLedgerTable
                                mode="member"
                                memberProfileId={member.id}
                                className="min-h-[75vh] min-w-0 max-h-[75vh]"
                            />
                        </Modal>
                    </>
                )}
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: handleDelete,
                }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() => infoModal.onOpenChange(true)}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Member&apos;s Info
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => historyModal.onOpenChange(true)}
                        >
                            <UserClockFillIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Member History
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => transactionModal.onOpenChange(true)}
                        >
                            <ReceiptIcon className="mr-2" strokeWidth={1.5} />
                            View Transactions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!member.user_id}
                            onClick={() => footstepModal.onOpenChange(true)}
                        >
                            <FootstepsIcon className="mr-2" strokeWidth={1.5} />
                            See Footstep
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() =>
                                accountingLedgerModal.onOpenChange(true)
                            }
                        >
                            <BookIcon className="mr-2" strokeWidth={1.5} />
                            View Accounting Ledger
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

                        <DropdownMenuItem onClick={handleShowQR}>
                            <QrCodeIcon className="mr-2" />
                            Member Profile QR
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="focus:bg-destructive focus:text-destructive-foreground"
                            onClick={() => closeModal.onOpenChange(true)}
                        >
                            <HeartBreakFillIcon
                                className="mr-2 text-rose-500 duration-200 group-focus:text-destructive-foreground"
                                strokeWidth={1.5}
                            />
                            Close Profile/Account
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
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
        infoModal,
        closeModal,
        historyModal,
        footstepModal,
        transactionModal,
        ledgerTableModal,
        selectedEntryType,
        accountingLedgerModal,
        isDeleting,
        handleEdit,
        handleDelete,
        openLedgerModal,
        getModalTitle,
        handleShowQR,
    } = useMemberProfileActions({ row, onDeleteSuccess })

    return (
        <>
            {member && (
                <>
                    <Modal
                        {...ledgerTableModal}
                        className="max-w-[95vw]"
                        title={getModalTitle()}
                        description={`You are viewing ${member.full_name}'s ${getModalTitle().toLowerCase()}`}
                    >
                        <GeneralLedgerTable
                            mode="member"
                            memberProfileId={member.id}
                            TEntryType={selectedEntryType}
                            excludeColumnIds={['balance']}
                            className="min-h-[75vh] min-w-0 max-h-[75vh]"
                        />
                    </Modal>

                    <Modal
                        {...accountingLedgerModal}
                        title={`${member.first_name}'s Accounting Ledger`}
                        className="max-w-[95vw]"
                    >
                        <MemberAccountingLedgerTable
                            mode="member"
                            memberProfileId={member.id}
                            className="min-h-[75vh] min-w-0 max-h-[75vh]"
                        />
                    </Modal>

                    <MemberHistoriesModal
                        {...historyModal}
                        memberHistoryProps={{
                            profileId: member.id,
                        }}
                    />
                    <MemberOverallInfoModal
                        {...infoModal}
                        overallInfoProps={{
                            memberProfileId: member.id,
                        }}
                    />
                    <MemberProfileCloseFormModal
                        {...closeModal}
                        formProps={{
                            profileId: member.id,
                            defaultValues: {
                                remarks: member.member_close_remarks ?? [],
                            },
                        }}
                    />
                    <Modal
                        {...footstepModal}
                        className="max-w-[95vw]"
                        title={
                            <div className="flex gap-x-2 items-center">
                                <ImageDisplay
                                    src={member.media?.download_url}
                                    className="rounded-xl size-12"
                                />
                                <div className="space-y-1">
                                    <p>{member.full_name}</p>
                                    <p className="text-sm text-muted-foreground/80">
                                        Member
                                    </p>
                                </div>
                            </div>
                        }
                        description={`You are viewing ${member.full_name}'s footstep`}
                    >
                        <FootstepTable
                            mode="member-profile"
                            memberProfileId={member.id}
                            className="min-h-[90vh] min-w-0 max-h-[90vh]"
                        />
                    </Modal>

                    <Modal
                        {...transactionModal}
                        className="max-w-[95vw]"
                        title="Transactions"
                        description={`You are viewing ${member.full_name}'s transactions`}
                    >
                        <TransactionTable
                            mode="member-profile"
                            onRowClick={() => {}}
                            memberProfileId={member.id}
                            className="min-h-[90vh] min-w-0 max-h-[90vh]"
                        />
                    </Modal>
                </>
            )}
            <DataTableRowContext
                row={row}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: handleDelete,
                }}
                otherActions={
                    <>
                        <ContextMenuItem
                            onClick={() => infoModal.onOpenChange(true)}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Member&apos;s Info
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => historyModal.onOpenChange(true)}
                        >
                            <UserClockFillIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Member History
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => transactionModal.onOpenChange(true)}
                        >
                            <ReceiptIcon className="mr-2" strokeWidth={1.5} />
                            View Transactions
                        </ContextMenuItem>
                        <ContextMenuItem
                            disabled={!member.user_id}
                            onClick={() => footstepModal.onOpenChange(true)}
                        >
                            <FootstepsIcon className="mr-2" strokeWidth={1.5} />
                            See Footstep
                        </ContextMenuItem>

                        <ContextMenuItem
                            onClick={() =>
                                accountingLedgerModal.onOpenChange(true)
                            }
                        >
                            <BookIcon className="mr-2" strokeWidth={1.5} />
                            View Accounting Ledger
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

                        <ContextMenuItem onClick={handleShowQR}>
                            <QrCodeIcon className="mr-2" />
                            Member Profile QR
                        </ContextMenuItem>

                        <ContextMenuItem
                            className="focus:bg-destructive focus:text-destructive-foreground"
                            onClick={() => closeModal.onOpenChange(true)}
                        >
                            <HeartBreakFillIcon
                                className="mr-2 text-rose-500 duration-200 group-focus:text-destructive-foreground"
                                strokeWidth={1.5}
                            />
                            Close Profile/Account
                        </ContextMenuItem>
                    </>
                }
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default MemberProfileAction
