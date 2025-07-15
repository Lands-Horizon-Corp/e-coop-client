import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { CollateralCreateUpdateFormModal } from '@/components/forms/collateral-create-update-form'

import { useDeleteCollateral } from '@/hooks/api-hooks/use-collateral'

import { ICollateralTableActionComponentProp } from './columns'

const CollateralAction = ({
    row,
    onDeleteSuccess,
}: {
    row: ICollateralTableActionComponentProp['row']
    onDeleteSuccess?: () => void
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { isPending, mutate } = useDeleteCollateral({
        onSuccess: onDeleteSuccess,
    })

    const collateral = row.original

    return (
        <>
            <CollateralCreateUpdateFormModal
                open={isOpen}
                onOpenChange={setIsOpen}
                formProps={{
                    defaultValues: collateral,
                    collateralId: collateral.id,
                }}
            />
            <RowActionsGroup
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setIsOpen(true),
                }}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isPending,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Collateral',
                            description:
                                'Are you sure you want to delete this collateral?',
                            onConfirm: () => mutate(collateral.id),
                        })
                    },
                }}
            />
        </>
    )
}

export default CollateralAction
