import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { BillsAndCoinCreateUpdateFormModal } from '@/components/forms/bills-and-coin-create-update-form'

import { useDeleteBillsAndCoins } from '@/hooks/api-hooks/use-bills-and-coins'

import { IBillsAndCoinsTableActionComponentProp } from './columns'

interface IBillsAndCoinsTableActionProps
    extends IBillsAndCoinsTableActionComponentProp {
    onBillsAndCoinsUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BillsAndCoinsAction = ({
    row,
    onDeleteSuccess,
}: IBillsAndCoinsTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const billsAndCoin = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteBillsAndCoin } =
        useDeleteBillsAndCoins({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <BillsAndCoinCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        billsAndCoinId: billsAndCoin.id,
                        defaultValues: billsAndCoin,
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Bill/Coin',
                            description:
                                'Are you sure you want to delete this currency bill/coin?',
                            onConfirm: () =>
                                deleteBillsAndCoin(billsAndCoin.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default BillsAndCoinsAction
