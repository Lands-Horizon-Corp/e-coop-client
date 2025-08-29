import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteBillsAndCoinsById } from '../../bill-and-coins.service'
import { IBillsAndCoin } from '../../bill-and-coins.types'
import { BillsAndCoinCreateUpdateFormModal } from '../bills-and-coin-create-update-form'
import { IBillsAndCoinsTableActionComponentProp } from './columns'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

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
        useDeleteBillsAndCoinsById({
            options: {
                onSuccess: onDeleteSuccess,
            },
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
                    text: 'Delete',
                    isAllowed: !isDeletingBillsAndCoin,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
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
