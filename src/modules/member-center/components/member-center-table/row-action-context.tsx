import { ReactNode } from 'react'

import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteById } from '../../member-center.service'
import { IMemberCenter } from '../../member-center.types'
import { MemberCenterCreateUpdateFormModal } from '../member-center-create-update-form'
import { IMemberCenterTableActionComponentProp } from './columns'

export type MemberCenterActionType = 'edit' | 'delete'

export type MemberCenterActionExtra = Record<string, never>

interface UseMemberCenterActionsProps {
    row: Row<IMemberCenter>
    onDeleteSuccess?: () => void
}

const useMemberCenterActions = ({
    row,
    onDeleteSuccess,
}: UseMemberCenterActionsProps) => {
    const memberCenter = row.original
    const { open } = useTableRowActionStore<
        IMemberCenter,
        MemberCenterActionType,
        MemberCenterActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingMemberCenter, mutate: deleteMemberCenter } =
        useDeleteById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: memberCenter.id,
            defaultValues: memberCenter,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Member Center',
            description: 'Are you sure to delete this Member Center?',
            onConfirm: () => deleteMemberCenter(memberCenter.id),
        })
    }

    return {
        memberCenter,
        isDeletingMemberCenter,
        handleEdit,
        handleDelete,
    }
}

interface IMemberCenterTableActionProps extends IMemberCenterTableActionComponentProp {
    onMemberCenterUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberCenterAction = ({
    row,
    onDeleteSuccess,
}: IMemberCenterTableActionProps) => {
    const { memberCenter, isDeletingMemberCenter, handleEdit, handleDelete } =
        useMemberCenterActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingMemberCenter &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'MemberCenter',
                            resource: memberCenter,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'MemberCenter',
                        resource: memberCenter,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
                row={row}
            />
        </>
    )
}

interface IMemberCenterRowContextProps extends IMemberCenterTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberCenterRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberCenterRowContextProps) => {
    const { memberCenter, isDeletingMemberCenter, handleEdit, handleDelete } =
        useMemberCenterActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingMemberCenter &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'MemberCenter',
                            resource: memberCenter,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'MemberCenter',
                        resource: memberCenter,
                    }),
                    onClick: handleEdit,
                }}
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const MemberCenterTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMemberCenter,
        MemberCenterActionType,
        MemberCenterActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const memberCenter = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <MemberCenterCreateUpdateFormModal
                    description="Modify/Update member center..."
                    formProps={{
                        memberCenterId: memberCenter.id,
                        defaultValues: memberCenter,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Update Member Center"
                />
            )}
        </>
    )
}

export default MemberCenterAction
