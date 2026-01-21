import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteBillsAndCoinsById } from '../../bill-and-coins.service'
import { IBillsAndCoin } from '../../bill-and-coins.types'
import { BillsAndCoinCreateUpdateFormModal } from '../bills-and-coin-create-update-form'
import { IBillsAndCoinsTableActionComponentProp } from './columns'

export type BillsAndCoinsActionType = 'edit' | 'delete'

export interface BillsAndCoinsActionExtra {
    onDeleteSuccess?: () => void
}

interface UseBillsAndCoinsActionsProps {
    row: Row<IBillsAndCoin>
    onDeleteSuccess?: () => void
}

const useBillsAndCoinsActions = ({
    row,
    onDeleteSuccess,
}: UseBillsAndCoinsActionsProps) => {
    const billsAndCoin = row.original
    const { open } = useTableRowActionStore<
        IBillsAndCoin,
        BillsAndCoinsActionType,
        BillsAndCoinsActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingBillsAndCoin, mutate: deleteBillsAndCoin } =
        useDeleteBillsAndCoinsById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: billsAndCoin.id,
            defaultValues: billsAndCoin,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Bill/Coin',
            description:
                'Are you sure you want to delete this currency bill/coin?',
            onConfirm: () => deleteBillsAndCoin(billsAndCoin.id),
        })
    }

    return {
        billsAndCoin,
        isDeletingBillsAndCoin,
        handleEdit,
        handleDelete,
    }
}

interface IBillsAndCoinsTableActionProps
    extends IBillsAndCoinsTableActionComponentProp {
    onBillsAndCoinsUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const BillsAndCoinsAction = ({
    row,
    onDeleteSuccess,
}: IBillsAndCoinsTableActionProps) => {
    const { isDeletingBillsAndCoin, handleEdit, handleDelete } =
        useBillsAndCoinsActions({ row, onDeleteSuccess })

    return (
        <>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingBillsAndCoin,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={<></>}
                row={row}
            />
        </>
    )
}

interface IBillsAndCoinsRowContextProps
    extends IBillsAndCoinsTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const BillsAndCoinsRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IBillsAndCoinsRowContextProps) => {
    const { isDeletingBillsAndCoin, handleEdit, handleDelete } =
        useBillsAndCoinsActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingBillsAndCoin,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const BillsAndCoinsTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IBillsAndCoin,
        BillsAndCoinsActionType,
        BillsAndCoinsActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <BillsAndCoinCreateUpdateFormModal
                    formProps={{
                        billsAndCoinId: state.id,
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

export default BillsAndCoinsAction
