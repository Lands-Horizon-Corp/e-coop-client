import { useState } from 'react'
import { IBankTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteBank } from '@/hooks/api-hooks/use-bank'
import { BankCreateUpdateFormModal } from '@/components/forms/bank-create-update-form'

interface IBankTableActionProps extends IBankTableActionComponentProp {
    onBankUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BankAction = ({ row, onDeleteSuccess }: IBankTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const bank = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingBank, mutate: deleteBank } = useDeleteBank({
        onSuccess: onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <BankCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        bankId: bank.id,
                        defaultValues: {
                            ...bank,
                        },
                        onSuccess: () => {
                            setUpdateModalForm(false)
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingBank,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Bank',
                            description:
                                'Are you sure you want to delete this bank?',
                            onConfirm: () => deleteBank(bank.id),
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

export default BankAction
