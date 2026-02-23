import { ReactNode } from 'react'

import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { useDeleteById } from '@/modules/member-occupation/member-occupation.service'
import { IMemberOccupation } from '@/modules/member-occupation/member-occupation.types'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { MemberOccupationCreateUpdateFormModal } from '../../member-occupation-create-update-form'
import { IMemberOccupationTableActionComponentProp } from './columns'

export type MemberOccupationActionType = 'edit' | 'delete'

export type MemberOccupationActionExtra = Record<string, never>

interface UseMemberOccupationActionsProps {
    row: Row<IMemberOccupation>
    onDeleteSuccess?: () => void
}

const useMemberOccupationActions = ({
    row,
    onDeleteSuccess,
}: UseMemberOccupationActionsProps) => {
    const memberOccupation = row.original
    const { open } = useTableRowActionStore<
        IMemberOccupation,
        MemberOccupationActionType,
        MemberOccupationActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingMemberOccupation,
        mutate: deleteMemberOccupation,
    } = useDeleteById({
        options: {
            onSuccess: onDeleteSuccess,
        },
    })

    const handleEdit = () => {
        open('edit', {
            id: memberOccupation.id,
            defaultValues: memberOccupation,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Member Occupation',
            description:
                'Are you sure you want to delete this member occupation?',
            onConfirm: () => deleteMemberOccupation(memberOccupation.id),
        })
    }

    return {
        memberOccupation,
        isDeletingMemberOccupation,
        handleEdit,
        handleDelete,
    }
}

interface IMemberOccupationTableActionProps extends IMemberOccupationTableActionComponentProp {
    onMemberOccupationUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberOccupationAction = ({
    row,
    onDeleteSuccess,
}: IMemberOccupationTableActionProps) => {
    const {
        memberOccupation,
        isDeletingMemberOccupation,
        handleEdit,
        handleDelete,
    } = useMemberOccupationActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingMemberOccupation ||
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'MemberOccupation',
                            resource: memberOccupation,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'MemberOccupation',
                        resource: memberOccupation,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
                row={row}
            />
        </>
    )
}

interface IMemberOccupationRowContextProps extends IMemberOccupationTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberOccupationRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberOccupationRowContextProps) => {
    const {
        memberOccupation,
        isDeletingMemberOccupation,
        handleEdit,
        handleDelete,
    } = useMemberOccupationActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeletingMemberOccupation ||
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'MemberOccupation',
                            resource: memberOccupation,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'MemberOccupation',
                        resource: memberOccupation,
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

export const MemberOccupationTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMemberOccupation,
        MemberOccupationActionType,
        MemberOccupationActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const memberOccupation = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <MemberOccupationCreateUpdateFormModal
                    description="Modify/Update this member occupation..."
                    formProps={{
                        memberOccupationId: memberOccupation.id,
                        defaultValues: memberOccupation,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Update Member Occupation"
                />
            )}
        </>
    )
}

export default MemberOccupationAction
