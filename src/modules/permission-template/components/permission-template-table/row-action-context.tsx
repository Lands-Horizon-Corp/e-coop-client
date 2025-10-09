import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { IPermissionTemplate, useDeletePermissionTemplateById } from '../..'
import { PermissionTemplateCreateUpdateFormModal } from '../permission-template-create-update-form'
import { IPermissionTemplateTableActionComponentProp } from './columns'

interface UsePermissionTemplateActionsProps {
    row: Row<IPermissionTemplate>
    onDeleteSuccess?: () => void
}

const usePermissionTemplateActions = ({
    row,
    onDeleteSuccess,
}: UsePermissionTemplateActionsProps) => {
    const updateModal = useModalState()
    const permissionTemplate = row.original

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

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Permission Template',
            description:
                'Are you sure you want to delete this Permission Template?',
            onConfirm: () => deletePermissionTemplate(permissionTemplate.id),
        })
    }

    return {
        permissionTemplate,
        updateModal,
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
    const {
        permissionTemplate,
        updateModal,
        isDeleting,
        handleEdit,
        handleDelete,
    } = usePermissionTemplateActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <PermissionTemplateCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        permissionTemplateId: permissionTemplate.id,
                        defaultValues: { ...permissionTemplate },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
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
    const {
        permissionTemplate,
        updateModal,
        isDeleting,
        handleEdit,
        handleDelete,
    } = usePermissionTemplateActions({ row, onDeleteSuccess })

    return (
        <>
            <PermissionTemplateCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    permissionTemplateId: permissionTemplate.id,
                    defaultValues: { ...permissionTemplate },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
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

export default PermissionTemplateAction
