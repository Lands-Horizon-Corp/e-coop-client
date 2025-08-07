import { FC, useState } from 'react'

import { useInfoModalStore } from '@/store/info-modal-store'
import { useRouter } from '@tanstack/react-router'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberProfileCloseFormModal } from '@/components/forms/member-forms/member-profile-close-form'
import {
    BillIcon,
    BookOpenIcon,
    BookThickIcon,
    EyeIcon,
    FootstepsIcon,
    HandCoinsIcon,
    HeartBreakFillIcon,
    MoneyCheckIcon,
    QrCodeIcon,
    ReceiptIcon,
    UserClockFillIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { MemberHistoriesModal } from '@/components/member-infos/member-histories'
import { MemberOverallInfoModal } from '@/components/member-infos/view-member-info'
import Modal from '@/components/modals/modal'
import { QrCodeDownloadable } from '@/components/qr-code'
import {
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

import { useDeleteMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'
import { useModalState } from '@/hooks/use-modal-state'

import { TEntryType } from '@/types'

import FootstepTable from '../../footsteps-table'
import GeneralLedgerTable from '../../ledgers-tables/general-ledger-table'
import TransactionTable from '../../transaction-table'
import { IMemberProfileTableActionComponentProp } from './columns'

interface IMemberProfileTableActionProps
    extends IMemberProfileTableActionComponentProp {
    onMemberUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberProfileTableAction: FC<IMemberProfileTableActionProps> = ({
    row,
}) => {
    const member = row.original
    const router = useRouter()
    const { onOpen } = useInfoModalStore()

    const infoModal = useModalState(false)
    const closeModal = useModalState(false)
    const historyModal = useModalState(false)
    const footstepModal = useModalState(false)
    const transactionModal = useModalState(false)

    // GL Entries modal state
    const ledgerTableModal = useModalState()
    const [selectedEntryType, setSelectedEntryType] = useState<TEntryType>('')

    const { mutate: deleteProfile, isPending: isDeleting } =
        useDeleteMemberProfile()

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
                    </>
                )}
            </div>
            <RowActionsGroup
                canDelete={!isDeleting}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick() {
                        router.navigate({
                            to: `../member-profile/${member.id}/personal-info`,
                        })
                    },
                }}
                onDelete={{
                    text: 'Delete',
                    isAllowed: true,
                    onClick: () => deleteProfile(member.id),
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
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuItem
                            onClick={() =>
                                onOpen({
                                    title: 'Member Profile QR',
                                    description:
                                        'Share this member profile QR Code.',
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
                                                value={JSON.stringify(
                                                    member.qr_code
                                                )}
                                            />
                                        </div>
                                    ),
                                })
                            }
                        >
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

export default MemberProfileTableAction
