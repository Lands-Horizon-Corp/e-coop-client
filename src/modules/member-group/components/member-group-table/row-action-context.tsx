import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteById } from '../../member-group.service'
import { IMemberGroup } from '../../member-group.types'
import { MemberGroupCreateUpdateFormModal } from '../member-group-create-update-form'
import { IMemberGroupTableActionComponentProp } from './columns'

export type MemberGroupActionType = 'edit' | 'delete'
export type MemberGroupActionExtra = Record<string, never>

interface UseMemberGroupActionsProps {
    row: Row<IMemberGroup>
    onDeleteSuccess?: () => void
}

const useMemberGroupActions = ({
    row,
    onDeleteSuccess,
}: UseMemberGroupActionsProps) => {
    const group = row.original

    const { open } = useTableRowActionStore<
        IMemberGroup,
        MemberGroupActionType,
        MemberGroupActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingGroup, mutate: deleteGroup } = useDeleteById({
        options: {
            onSuccess: onDeleteSuccess,
        },
    })

    const handleEdit = () => {
        open('edit', {
            id: group.id,
            defaultValues: group,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Group',
            description: 'Are you sure you want to delete this Group?',
            onConfirm: () => deleteGroup(group.id),
        })
    }

    return {
        group,
        isDeletingGroup,
        handleEdit,
        handleDelete,
    }
}

interface IMemberGroupTableActionProps extends IMemberGroupTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const MemberGroupAction = ({
    row,
    onDeleteSuccess,
}: IMemberGroupTableActionProps) => {
    const { isDeletingGroup, handleEdit, handleDelete } = useMemberGroupActions(
        { row, onDeleteSuccess }
    )

    return (
        <>
            <div onClick={(e) => e.stopPropagation()} />
            <RowActionsGroup
                canSelect
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
                row={row}
            />
        </>
    )
}

interface IMemberGroupRowContextProps extends IMemberGroupTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberGroupRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberGroupRowContextProps) => {
    const { isDeletingGroup, handleEdit, handleDelete } = useMemberGroupActions(
        { row, onDeleteSuccess }
    )

    return (
        <DataTableRowContext
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
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const MemberGroupTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMemberGroup,
        MemberGroupActionType,
        MemberGroupActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const group = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <MemberGroupCreateUpdateFormModal
                    description="Modify/Update group information..."
                    formProps={{
                        groupId: group.id,
                        defaultValues: group,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Update Group"
                />
            )}
        </>
    )
}

export default MemberGroupAction
