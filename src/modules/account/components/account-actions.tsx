import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'

import {
    IAccount,
    useDeleteById,
    useMoveAccountOrderIndex,
} from '@/modules/account'
import {
    getCrudPermissionFromAuthStore,
    hasPermissionFromAuth,
} from '@/modules/authentication/authgentication.store'
import { TEntryType } from '@/modules/general-ledger'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import {
    BillIcon,
    BookOpenIcon,
    BookStackIcon,
    BookThickIcon,
    HandCoinsIcon,
    MoneyCheckIcon,
    PencilFillIcon,
    SettingsIcon,
    ThreeDotIcon,
    TrashIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

export type AccountActionType =
    | 'edit'
    | 'delete'
    | 'view-ledger'
    | 'view-accounting-ledger-transaction'

export interface AccountActionExtra {
    onDeleteSuccess?: () => void
    entryType?: TEntryType
}

interface UseAccountActionsProps {
    account: IAccount
    onDeleteSuccess?: () => void
}

const useAccountActions = ({
    account,
    onDeleteSuccess,
}: UseAccountActionsProps) => {
    const { open } = useTableRowActionStore<
        IAccount,
        AccountActionType,
        AccountActionExtra
    >()

    const { onOpen } = useConfirmModalStore()
    const queryClient = useQueryClient()
    const accountCrudPerms = getCrudPermissionFromAuthStore({
        resourceType: 'Account',
        resource: account,
    })

    const { isPending: isDeletingAccount, mutate: deleteAccount } =
        useDeleteById({
            options: {
                onSuccess: () => {
                    onDeleteSuccess?.()
                    toast.success(`Account deleted successfully`)
                    queryClient.invalidateQueries({
                        queryKey: ['account', 'all', 'all'],
                    })
                },
            },
        })

    const moveAccountIndexMutation = useMoveAccountOrderIndex()

    const handleViewAccountingLedger = () => {
        open('view-accounting-ledger-transaction', {
            id: account.id,
            defaultValues: account,
            extra: {},
        })
    }

    const handleEdit = () => {
        open('edit', {
            id: account.id,
            defaultValues: account,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Account',
            description: `Are you sure you want to delete account "${account.name}"?`,
            onConfirm: () => deleteAccount(account.id),
        })
    }

    const openLedgerModal = (entryType: TEntryType) => {
        open('view-ledger', {
            id: account.id,
            defaultValues: account,
            extra: { entryType, onDeleteSuccess },
        })
    }

    return {
        account,
        accountCrudPerms,
        isDeletingAccount,
        moveAccountIndexMutation,
        handleEdit,
        handleDelete,
        openLedgerModal,
        handleViewAccountingLedger,
    }
}

interface AccountActionProps {
    accountData: IAccount
    onDeleteSuccess?: () => void
}

export const AccountActions = ({
    accountData,
    onDeleteSuccess,
}: AccountActionProps) => {
    const {
        // account,
        // isDeletingAccount,
        // moveAccountIndexMutation,
        handleEdit,
        handleDelete,
        openLedgerModal,
        handleViewAccountingLedger,
    } = useAccountActions({ account: accountData, onDeleteSuccess })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="xs" variant={'ghost'}>
                    {' '}
                    <ThreeDotIcon className="h-3.5 w-3.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background p-2 rounded-2xl">
                <DropdownMenuItem onClick={handleEdit}>
                    <PencilFillIcon className="mr-2" />
                    edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                    <TrashIcon className="mr-2" />
                    delete
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={
                        !hasPermissionFromAuth({
                            action: 'Read',
                            resourceType: 'AccountTransaction',
                        })
                    }
                    onClick={() => handleViewAccountingLedger()}
                >
                    <BookOpenIcon className="mr-2" strokeWidth={1.5} />
                    View Accounting Ledger
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger
                        disabled={
                            !hasPermissionFromAuth({
                                action: 'Read',
                                resourceType: 'GeneralLedger',
                            })
                        }
                    >
                        <BookOpenIcon className="mr-2" strokeWidth={1.5} />
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
                                onClick={() => openLedgerModal('check-entry')}
                            >
                                <MoneyCheckIcon
                                    className="mr-2"
                                    strokeWidth={1.5}
                                />
                                Check Entry
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => openLedgerModal('online-entry')}
                            >
                                <BillIcon className="mr-2" strokeWidth={1.5} />
                                Online Entry
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => openLedgerModal('cash-entry')}
                            >
                                <HandCoinsIcon
                                    className="mr-2"
                                    strokeWidth={1.5}
                                />
                                Cash Entry
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => openLedgerModal('payment-entry')}
                            >
                                <BillIcon className="mr-2" strokeWidth={1.5} />
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
                                onClick={() => openLedgerModal('deposit-entry')}
                            >
                                <HandCoinsIcon
                                    className="mr-2"
                                    strokeWidth={1.5}
                                />
                                Deposit Entry
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => openLedgerModal('journal-entry')}
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
                                <BillIcon className="mr-2" strokeWidth={1.5} />
                                Journal Voucher
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => openLedgerModal('check-voucher')}
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
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
