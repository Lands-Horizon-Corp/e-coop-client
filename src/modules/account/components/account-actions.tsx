import { ComponentType } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'

import { TAction } from '@/constants'
import { cn } from '@/helpers/tw-utils'
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
    EyeIcon,
    HandCoinsIcon,
    MoneyCheckIcon,
    PencilFillIcon,
    TrashIcon,
} from '@/components/icons'
import { Button, ButtonProps } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { PopoverContent } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

export type AccountActionType =
    | 'view-ledger'
    | 'view-accounting-ledger-transaction'
    | 'view-account-consolidations'
    | TAction

export interface AccountActionExtra {
    onDeleteSuccess?: () => void
    entryType?: TEntryType
    onEditSuccess?: () => void
    index?: number
}

interface UseAccountActionsProps {
    account: IAccount
    onDeleteSuccess?: () => void
    onEditSuccess?: () => void
}

interface AccountActionProps extends UseAccountActionsProps {}

export const useAccountActions = ({
    account,
    onDeleteSuccess,
    onEditSuccess,
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
        })
    }

    const handleEdit = () => {
        open('edit', {
            id: account.id,
            defaultValues: account,
            extra: { onEditSuccess },
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

    const openAccountModal = () => {
        open('view', {
            id: account.id,
            defaultValues: account,
        })
    }

    const openAccountConsolidations = () => {
        open('view-account-consolidations', {
            id: account.id,
            defaultValues: account,
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
        openAccountModal,
        openAccountConsolidations,
    }
}

export const AccountActions = ({
    account,
    onDeleteSuccess,
    onEditSuccess,
}: AccountActionProps) => {
    const {
        handleEdit,
        handleDelete,
        openLedgerModal,
        handleViewAccountingLedger,
        openAccountModal,
        openAccountConsolidations,
    } = useAccountActions({
        account,
        onDeleteSuccess,
        onEditSuccess,
    })

    return (
        <PopoverContent className="w-64 p-2 rounded-2xl bg-card ">
            <div className="flex flex-col gap-1 p-0">
                <ActionButton label="View" onClick={openAccountModal} />
                <ActionButton
                    icon={PencilFillIcon}
                    label="Edit"
                    onClick={handleEdit}
                />
                <ActionButton
                    icon={TrashIcon}
                    label="Delete"
                    onClick={handleDelete}
                />
                <ActionButton
                    icon={BookOpenIcon}
                    label="View Accounting Ledger"
                    onClick={handleViewAccountingLedger}
                />
                <ActionButton
                    icon={BookStackIcon}
                    label="View Account Consolidations"
                    onClick={openAccountConsolidations}
                />

                <Separator className="my-2 " />
                <p className="px-3 text-xs font-medium text-muted-foreground">
                    GL Entries
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <ActionButton
                            className="justify-between w-full"
                            disabled={
                                !hasPermissionFromAuth({
                                    action: 'Read',
                                    resourceType: 'GeneralLedger',
                                })
                            }
                            icon={BookOpenIcon}
                            iconClassName="stroke-1.5"
                            label="View GL Entries"
                        />
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

const ActionButton = ({
    onClick,
    label,
    icon: Icon = EyeIcon,
    iconClassName,
    ...props
}: {
    onClick?: () => void
    label: string
    icon?: ComponentType<{ className?: string }>
    iconClassName?: string
} & ButtonProps) => {
    return (
        <Button
            {...props}
            className={cn(
                'flex items-center justify-start gap-2 px-3 py-2 rounded-lg transition'
            )}
            hoverVariant={'primary'}
            onClick={onClick}
            size={'sm'}
            variant={'ghost'}
        >
            <Icon className={cn('size-4', iconClassName)} />
            <span>{label}</span>
        </Button>
    )
}
