import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { BillsAndCoinCreateUpdateFormModal } from '@/components/forms/bills-and-coin-create-update-form'

import { useDeleteBillsAndCoins } from '@/hooks/api-hooks/use-bills-and-coins'
import { useModalState } from '@/hooks/use-modal-state'

import { IBillsAndCoin } from '@/types'

import { IBillsAndCoinsTableActionComponentProp } from './columns'

interface UseBillsAndCoinsActionsProps {
    row: Row<IBillsAndCoin>
    onDeleteSuccess?: () => void
}

const useBillsAndCoinsActions = ({
    row,
    onDeleteSuccess,
}: UseBillsAndCoinsActionsProps) => {
    const updateModal = useModalState()
    const billsAndCoin = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingBillsAndCoin, mutate: deleteBillsAndCoin } =
        useDeleteBillsAndCoins({
            onSuccess: onDeleteSuccess,
        })

    const handleEdit = () => updateModal.onOpenChange(true)

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
        updateModal,
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
    const {
        billsAndCoin,
        updateModal,
        isDeletingBillsAndCoin,
        handleEdit,
        handleDelete,
    } = useBillsAndCoinsActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <BillsAndCoinCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        billsAndCoinId: billsAndCoin.id,
                        defaultValues: billsAndCoin,
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
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
                otherActions={<>{/* Additional actions can be added here */}</>}
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
    const {
        billsAndCoin,
        updateModal,
        isDeletingBillsAndCoin,
        handleEdit,
        handleDelete,
    } = useBillsAndCoinsActions({ row, onDeleteSuccess })

    return (
        <>
            <BillsAndCoinCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    billsAndCoinId: billsAndCoin.id,
                    defaultValues: billsAndCoin,
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete Bill/Coin',
                    isAllowed: !isDeletingBillsAndCoin,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit Bill/Coin',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default BillsAndCoinsAction
