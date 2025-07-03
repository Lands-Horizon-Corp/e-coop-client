import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { BankCreateUpdateFormModal } from '@/components/forms/bank-create-update-form'

import { useDeleteBank } from '@/hooks/api-hooks/use-bank'
import { useModalState } from '@/hooks/use-modal-state'

import { IBankTableActionComponentProp } from './columns'

interface IBankTableActionProps extends IBankTableActionComponentProp {
    onBankUpdate?: () => void
    onDeleteSuccess?: () => void
}

const BankAction = ({ row, onDeleteSuccess }: IBankTableActionProps) => {
    const updateModal = useModalState()
    const bank = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingBank, mutate: deleteBank } = useDeleteBank({
        onSuccess: onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <BankCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        bankId: bank.id,
                        defaultValues: {
                            ...bank,
                        },
                        onSuccess: () => {
                            updateModal.onOpenChange(false)
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
                    onClick: () => updateModal.onOpenChange(true),
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default BankAction
