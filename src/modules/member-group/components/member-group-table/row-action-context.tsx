import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteById } from '../../member-group.service'
import { IMemberGroup } from '../../member-group.types'
import { MemberGroupCreateUpdateFormModal } from '../member-group-create-update-form'
import { IMemberGroupTableActionComponentProp } from './columns'

interface UseMemberGroupActionsProps {
    row: Row<IMemberGroup>
    onDeleteSuccess?: () => void
}

const useMemberGroupActions = ({
    row,
    onDeleteSuccess,
}: UseMemberGroupActionsProps) => {
    const updateModal = useModalState()
    const group = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingGroup, mutate: deleteGroup } = useDeleteById({
        options: {
            onSuccess: onDeleteSuccess,
        },
    })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Group',
            description: 'Are you sure you want to delete this Group?',
            onConfirm: () => deleteGroup(group.id),
        })
    }

    return {
        group,
        updateModal,
        isDeletingGroup,
        handleEdit,
        handleDelete,
    }
}

interface IMemberGroupTableActionProps
    extends IMemberGroupTableActionComponentProp {
    onGroupUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberGroupAction = ({
    row,
    onDeleteSuccess,
}: IMemberGroupTableActionProps) => {
    const { group, updateModal, isDeletingGroup, handleEdit, handleDelete } =
        useMemberGroupActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberGroupCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        groupId: group.id,
                        defaultValues: { ...group },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingGroup,
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

interface IMemberGroupRowContextProps
    extends IMemberGroupTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberGroupRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberGroupRowContextProps) => {
    const { group, updateModal, isDeletingGroup, handleEdit, handleDelete } =
        useMemberGroupActions({ row, onDeleteSuccess })

    return (
        <>
            <MemberGroupCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    groupId: group.id,
                    defaultValues: { ...group },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingGroup,
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

export default MemberGroupAction
