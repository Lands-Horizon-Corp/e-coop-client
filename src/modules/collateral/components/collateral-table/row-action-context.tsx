import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { ICollateral, useDeleteCollateralById } from '../..'
import { CollateralCreateUpdateFormModal } from '../forms/collateral-create-update-form'
import { ICollateralTableActionComponentProp } from './columns'

export type CollateralActionType = 'edit'

export type CollateralActionExtra = Record<string, never>

interface UseCollateralActionsProps {
    row: Row<ICollateral>
    onDeleteSuccess?: () => void
}

const useCollateralActions = ({
    row,
    onDeleteSuccess,
}: UseCollateralActionsProps) => {
    const collateral = row.original

    const { open } = useTableRowActionStore<
        ICollateral,
        CollateralActionType,
        CollateralActionExtra
    >()

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

    const handleEdit = () => {
        open('edit', {
            id: collateral.id,
            defaultValues: collateral,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Collateral',
            description: 'Are you sure you want to delete this collateral?',
            onConfirm: () => deleteCollateral(collateral.id),
        })
    }

    return {
        collateral,
        isDeletingCollateral,
        handleEdit,
        handleDelete,
    }
}

interface ICollateralTableActionProps extends ICollateralTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const CollateralAction = ({
    row,
    onDeleteSuccess,
}: ICollateralTableActionProps) => {
    const { collateral, isDeletingCollateral, handleEdit, handleDelete } =
        useCollateralActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()} />
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingCollateral &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'Collateral',
                            resource: collateral,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'Collateral',
                        resource: collateral,
                    }),
                    onClick: handleEdit,
                }}
                row={row}
            />
        </>
    )
}

interface ICollateralRowContextProps extends ICollateralTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const CollateralRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ICollateralRowContextProps) => {
    const { collateral, isDeletingCollateral, handleEdit, handleDelete } =
        useCollateralActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingCollateral &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'Collateral',
                        resource: collateral,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'Collateral',
                    resource: collateral,
                }),
                onClick: handleEdit,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const CollateralTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ICollateral,
        CollateralActionType,
        CollateralActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const collateral = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <CollateralCreateUpdateFormModal
                    formProps={{
                        collateralId: collateral.id,
                        defaultValues: collateral,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default CollateralAction
