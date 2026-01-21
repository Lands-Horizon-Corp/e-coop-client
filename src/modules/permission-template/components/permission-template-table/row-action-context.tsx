import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { IPermissionTemplate, useDeletePermissionTemplateById } from '../..'
import { PermissionTemplateCreateUpdateFormModal } from '../permission-template-create-update-form'
import { IPermissionTemplateTableActionComponentProp } from './columns'

export type PermissionTemplateActionType = 'edit' | 'delete'

export type PermissionTemplateActionExtra = Record<string, never>

interface UsePermissionTemplateActionsProps {
    row: Row<IPermissionTemplate>
    onDeleteSuccess?: () => void
}

const usePermissionTemplateActions = ({
    row,
    onDeleteSuccess,
}: UsePermissionTemplateActionsProps) => {
    const permissionTemplate = row.original
    const { open } = useTableRowActionStore<
        IPermissionTemplate,
        PermissionTemplateActionType,
        PermissionTemplateActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deletePermissionTemplate } =
        useDeletePermissionTemplateById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: permissionTemplate.id,
            defaultValues: permissionTemplate,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Permission Template',
            description:
                'Are you sure you want to delete this Permission Template?',
            onConfirm: () => deletePermissionTemplate(permissionTemplate.id),
        })
    }

    return {
        isDeleting,
        handleEdit,
        handleDelete,
    }
}

interface IPermissionTemplateTableActionProps
    extends IPermissionTemplateTableActionComponentProp {
    onPermissionTemplateUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const PermissionTemplateAction = ({
    row,
    onDeleteSuccess,
}: IPermissionTemplateTableActionProps) => {
    const { isDeleting, handleEdit, handleDelete } =
        usePermissionTemplateActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
                row={row}
            />
        </>
    )
}

interface IPermissionTemplateRowContextProps
    extends IPermissionTemplateTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const PermissionTemplateRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IPermissionTemplateRowContextProps) => {
    const { isDeleting, handleEdit, handleDelete } =
        usePermissionTemplateActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
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

export const PermissionTemplateTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IPermissionTemplate,
        PermissionTemplateActionType,
        PermissionTemplateActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const permissionTemplate = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <PermissionTemplateCreateUpdateFormModal
                    formProps={{
                        permissionTemplateId: permissionTemplate.id,
                        defaultValues: { ...permissionTemplate },
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default PermissionTemplateAction
