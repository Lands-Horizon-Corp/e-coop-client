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
    ChevronRightIcon,
    HandCoinsIcon,
    MoneyCheckIcon,
    PencilFillIcon,
    TrashIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { PopoverContent } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

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

export const useAccountActions = ({
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

interface AccountActionProps extends UseAccountActionsProps {}

export const AccountActions = ({
    account,
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
    } = useAccountActions({ account, onDeleteSuccess })

    return (
        <PopoverContent className="w-64 p-2 rounded-2xl bg-background">
            <div className="flex flex-col gap-1">
                {/* Edit */}
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition"
                    onClick={handleEdit}
                >
                    <PencilFillIcon className="h-4 w-4" />
                    Edit
                </button>

                {/* Delete */}
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition"
                    onClick={handleDelete}
                >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                </button>

                {/* View Accounting Ledger */}
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:pointer-events-none transition"
                    disabled={
                        !hasPermissionFromAuth({
                            action: 'Read',
                            resourceType: 'AccountTransaction',
                        })
                    }
                    onClick={() => handleViewAccountingLedger()}
                >
                    <BookOpenIcon className="h-4 w-4" strokeWidth={1.5} />
                    View Accounting Ledger
                </button>

                {/* Divider */}
                <Separator className="my-2 " />

                {/* GL Entries Label */}
                <p className="px-3 text-xs font-medium text-muted-foreground">
                    GL Entries
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="popover-item justify-between w-full"
                            disabled={
                                !hasPermissionFromAuth({
                                    action: 'Read',
                                    resourceType: 'GeneralLedger',
                                })
                            }
                        >
                            <div className="flex items-center gap-2">
                                <BookOpenIcon
                                    className="h-4 w-4"
                                    strokeWidth={1.5}
                                />
                                GL Entries
                            </div>
                            <ChevronRightIcon className="h-4 w-4 opacity-60" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="start"
                        className="rounded-2xl bg-background p-2"
                        side="right"
                    >
                        <DropdownMenuItem onClick={() => openLedgerModal('')}>
                            <BookThickIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            General Ledger
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('check-entry')}
                        >
                            <MoneyCheckIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Check Entry
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('online-entry')}
                        >
                            <BillIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Online Entry
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('cash-entry')}
                        >
                            <HandCoinsIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Cash Entry
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('payment-entry')}
                        >
                            <BillIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Payment Entry
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('withdraw-entry')}
                        >
                            <HandCoinsIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Withdraw Entry
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('deposit-entry')}
                        >
                            <HandCoinsIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Deposit Entry
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('journal-entry')}
                        >
                            <BookStackIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Journal Entry
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('adjustment-entry')}
                        >
                            <BookStackIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Adjustment Entry
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('journal-voucher')}
                        >
                            <BillIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Journal Voucher
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openLedgerModal('check-voucher')}
                        >
                            <MoneyCheckIcon
                                className="mr-2 h-4 w-4"
                                strokeWidth={1.5}
                            />
                            Check Voucher
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </PopoverContent>
    )
}
