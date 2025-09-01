import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { ICollateral, useDeleteCollateralById } from '../..'
import { CollateralCreateUpdateFormModal } from '../forms/collateral-create-update-form'
import { ICollateralTableActionComponentProp } from './columns'

interface UseCollateralActionsProps {
    row: Row<ICollateral>
    onDeleteSuccess?: () => void
}

const useCollateralActions = ({
    row,
    onDeleteSuccess,
}: UseCollateralActionsProps) => {
    const updateModal = useModalState()
    const collateral = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingCollateral, mutate: deleteCollateral } =
        useDeleteCollateralById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Collateral deleted',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Collateral',
            description: 'Are you sure you want to delete this collateral?',
            onConfirm: () => deleteCollateral(collateral.id),
        })
    }

    return {
        collateral,
        updateModal,
        isDeletingCollateral,
        handleEdit,
        handleDelete,
    }
}

interface ICollateralTableActionProps
    extends ICollateralTableActionComponentProp {
    onCollateralUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const CollateralAction = ({
    row,
    onDeleteSuccess,
}: ICollateralTableActionProps) => {
    const {
        collateral,
        updateModal,
        isDeletingCollateral,
        handleEdit,
        handleDelete,
    } = useCollateralActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <CollateralCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        collateralId: collateral.id,
                        defaultValues: collateral,
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingCollateral,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={<></>}
            />
        </>
    )
}

interface ICollateralRowContextProps
    extends ICollateralTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const CollateralRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ICollateralRowContextProps) => {
    const {
        collateral,
        updateModal,
        isDeletingCollateral,
        handleEdit,
        handleDelete,
    } = useCollateralActions({ row, onDeleteSuccess })

    return (
        <>
            <CollateralCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    collateralId: collateral.id,
                    defaultValues: collateral,
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingCollateral,
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

export default CollateralAction
