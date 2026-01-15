import { ReactNode } from 'react'

import { toast } from 'sonner'

import { MutualFundEntryTableModal } from '@/modules/mutual-fund-entry/components/tables/mutual-fund-entry-table'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import {
    BoxesStackedIcon,
    PaperPlaneIcon,
    PrinterFillIcon,
    UndoIcon,
} from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { TEntityId } from '@/types'

import {
    useDeleteMutualFundById,
    useUndoPrintMutualFund,
} from '../../mutual-fund.service'
import { IMutualFund } from '../../mutual-fund.types'
import { MutualFundCreateUpdateFormModal } from '../forms/mutual-fund-create-update-form/mutual-fund-create-update-form'
import { MutualFundPrintFormModal } from '../forms/mutual-fund-create-update-form/mutual-fund-print-form'
import { MutualFundPostFormModal } from '../forms/mutual-fund-post-form'
import { IMutualFundTableActionComponentProp } from './columns'

export type MutualFundActionType =
    | 'edit'
    | 'print'
    | 'delete'
    | 'view'
    | 'manageEntries'
    | 'post'

export interface MutualFundActionExtra {
    onDeleteSuccess?: () => void
}

interface UseMutualFundActionsProps {
    row: Row<IMutualFund>
    onDeleteSuccess?: () => void
}

const useMutualFundActions = ({
    row,
    onDeleteSuccess,
}: UseMutualFundActionsProps) => {
    const mutualFund = row.original
    const { open } = useTableRowActionStore<
        IMutualFund,
        MutualFundActionType,
        MutualFundActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingMutualFund, mutate: deleteMutualFund } =
        useDeleteMutualFundById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const { isPending: isUnprinting, mutateAsync: undoPrintMutualFund } =
        useUndoPrintMutualFund({
            options: {
                onSuccess: () => {
                    toast.success('Mutual fund unprinted successfully')
                },
            },
        })

    const handleView = () => {
        open('view', {
            id: mutualFund.id,
            defaultValues: mutualFund,
            extra: { onDeleteSuccess },
        })
    }

    const handleManageEntries = () => {
        open('manageEntries', {
            id: mutualFund.id,
            defaultValues: mutualFund,
            extra: { onDeleteSuccess },
        })
    }

    const handleEdit = () => {
        open('edit', {
            id: mutualFund.id,
            defaultValues: mutualFund,
            extra: { onDeleteSuccess },
        })
    }

    const handlePost = () => {
        open('post', {
            id: mutualFund.id,
            defaultValues: mutualFund,
            extra: { onDeleteSuccess },
        })
    }

    const handlePrint = () => {
        open('print', { id: mutualFund.id, defaultValues: mutualFund })
    }

    const handleUndoPrint = () => {
        onOpen({
            title: 'Undo Print',
            description:
                'Are you sure you want to undo print for this mutual fund?',
            onConfirm: () =>
                toast.promise(
                    undoPrintMutualFund({
                        mutualFundId: mutualFund.id,
                    }),
                    {
                        loading: 'Undoing print...',
                        success: 'Mutual fund unprinted successfully',
                        error: 'Failed to undo print',
                    }
                ),
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Mutual Fund',
            description:
                'Are you sure you want to delete this mutual fund record?',
            onConfirm: () => deleteMutualFund(mutualFund.id),
        })
    }

    const isPosted = !!mutualFund.posted_date
    const isPrinted = !!mutualFund.printed_date

    const canPrint = !isPrinted && !isPosted
    const canUndoPrint = isPrinted && !isPosted
    const canPost = isPrinted && !isPosted

    return {
        mutualFund,
        isDeletingMutualFund,
        isUnprinting,
        canPrint,
        canUndoPrint,
        canPost,
        handleView,
        handleManageEntries,
        handleEdit,
        handlePost,
        handlePrint,
        handleUndoPrint,
        handleDelete,
    }
}

interface IMutualFundTableActionProps
    extends IMutualFundTableActionComponentProp {
    onMutualFundUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MutualFundAction = ({
    row,
    onDeleteSuccess,
}: IMutualFundTableActionProps) => {
    const {
        isDeletingMutualFund,
        isUnprinting,
        canPrint,
        canUndoPrint,
        canPost,
        handleManageEntries,
        handleEdit,
        handlePost,
        handlePrint,
        handleUndoPrint,
        handleDelete,
    } = useMutualFundActions({ row, onDeleteSuccess })

    return (
        <>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMutualFund,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            disabled={!canPrint}
                            onClick={handlePrint}
                        >
                            <PrinterFillIcon className="size-4 mr-2" />
                            Print
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!canUndoPrint || isUnprinting}
                            onClick={handleUndoPrint}
                        >
                            <UndoIcon className="size-4 mr-2" />
                            Undo Print
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleManageEntries}>
                            <BoxesStackedIcon className="mr-2 size-4" />
                            Manage Entries
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!canPost}
                            onClick={handlePost}
                        >
                            <PaperPlaneIcon className="mr-2 size-4" />
                            Post
                        </DropdownMenuItem>
                    </>
                }
                row={row}
            />
        </>
    )
}

interface IMutualFundRowContextProps
    extends IMutualFundTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MutualFundRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMutualFundRowContextProps) => {
    const {
        isDeletingMutualFund,
        isUnprinting,
        canPrint,
        canUndoPrint,
        canPost,
        handleManageEntries,
        handleEdit,
        handlePost,
        handlePrint,
        handleUndoPrint,
        handleDelete,
    } = useMutualFundActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMutualFund,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <ContextMenuItem
                            disabled={!canPrint}
                            onClick={handlePrint}
                        >
                            <PrinterFillIcon className="mr-2 size-4" />
                            Print
                        </ContextMenuItem>
                        <ContextMenuItem
                            disabled={!canUndoPrint || isUnprinting}
                            onClick={handleUndoPrint}
                        >
                            <UndoIcon className="mr-2 size-4" />
                            Undo Print
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleManageEntries}>
                            <BoxesStackedIcon className="mr-2 size-4" />
                            Manage Entries
                        </ContextMenuItem>
                        <ContextMenuItem
                            disabled={!canPost}
                            onClick={handlePost}
                        >
                            <PaperPlaneIcon className="mr-2 size-4" />
                            Post
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

export const MutualFundTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMutualFund,
        MutualFundActionType,
        MutualFundActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <MutualFundCreateUpdateFormModal
                    formProps={{
                        readOnly: !!state.defaultValues?.printed_date,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'manageEntries' && state.id && (
                <MutualFundEntryTableModal
                    onOpenChange={close}
                    open={state.isOpen}
                    tableProps={{
                        readOnly: !!state.defaultValues?.posted_date,
                        mutualFundId: state.defaultValues?.id as TEntityId,
                    }}
                    title={`Manage Entries ${state.defaultValues?.name ? `for ${state.defaultValues?.name}` : ''}`}
                />
            )}
            {state.action === 'print' && state.id && (
                <MutualFundPrintFormModal
                    formProps={{
                        mutualFundId: state.id,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'post' && state.id && (
                <MutualFundPostFormModal
                    formProps={{
                        mutualFundId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default MutualFundAction
