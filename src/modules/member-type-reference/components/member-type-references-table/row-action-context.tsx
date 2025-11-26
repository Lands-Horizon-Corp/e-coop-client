// actions.tsx
import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteById } from '../../member-type-reference.service'
import { IMemberTypeReference } from '../../member-type-reference.types'
import { MemberTypeReferenceCreateUpdateFormModal } from '../member-type-reference-create-update-form'
import { IMemberTypeReferenceTableActionComponentProp } from './columns'

export type MemberTypeReferenceActionType = 'edit' | 'delete'

export type MemberTypeReferenceActionExtra = Record<string, never>

interface UseMemberTypeReferenceActionsProps {
    row: Row<IMemberTypeReference>
    onDeleteSuccess?: () => void
}

const useMemberTypeReferenceActions = ({
    row,
    onDeleteSuccess,
}: UseMemberTypeReferenceActionsProps) => {
    const memberTypeReference = row.original
    const { open } = useTableRowActionStore<
        IMemberTypeReference,
        MemberTypeReferenceActionType,
        MemberTypeReferenceActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteMemberTypeReference } =
        useDeleteById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: memberTypeReference.id,
            defaultValues: memberTypeReference,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Member Type Reference',
            description: 'Are you sure you want to delete this reference?',
            onConfirm: () => deleteMemberTypeReference(memberTypeReference.id),
        })
    }

    return {
        memberTypeReference,
        isDeleting,
        handleEdit,
        handleDelete,
    }
}

interface IMemberTypeReferenceActionProps
    extends IMemberTypeReferenceTableActionComponentProp {
    onMemberTypeReferenceUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberTypeReferenceAction = ({
    row,
    onDeleteSuccess,
}: IMemberTypeReferenceActionProps) => {
    const { isDeleting, handleEdit, handleDelete } =
        useMemberTypeReferenceActions({ row, onDeleteSuccess })

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

interface IMemberTypeReferenceRowContextProps
    extends IMemberTypeReferenceTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberTypeReferenceRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberTypeReferenceRowContextProps) => {
    const { isDeleting, handleEdit, handleDelete } =
        useMemberTypeReferenceActions({ row, onDeleteSuccess })

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

export const MemberTypeReferenceTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMemberTypeReference,
        MemberTypeReferenceActionType,
        MemberTypeReferenceActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const memberTypeReference = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <MemberTypeReferenceCreateUpdateFormModal
                    formProps={{
                        defaultValues: memberTypeReference,
                        memberTypeReferenceId: memberTypeReference.id,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={true}
                />
            )}
        </>
    )
}

export default MemberTypeReferenceAction
