import { ReactNode } from 'react'

import {
    IMemberClassification,
    useDeleteById,
} from '@/modules/member-classification'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { MemberClassificationCreateUpdateFormModal } from '../../member-classification-create-update-form'
import { IMemberClassificationTableActionComponentProp } from './columns'

export type MemberClassificationActionType = 'edit' | 'delete'
export type MemberClassificationActionExtra = Record<string, never>

interface UseMemberClassificationActionsProps {
    row: Row<IMemberClassification>
    onDeleteSuccess?: () => void
}

const useMemberClassificationActions = ({
    row,
    onDeleteSuccess,
}: UseMemberClassificationActionsProps) => {
    const memberClassification = row.original

    const { open } = useTableRowActionStore<
        IMemberClassification,
        MemberClassificationActionType,
        MemberClassificationActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingMemberClassification,
        mutate: deleteMemberClassification,
    } = useDeleteById({
        options: {
            onSuccess: onDeleteSuccess,
        },
    })

    const handleEdit = () => {
        open('edit', {
            id: memberClassification.id,
            defaultValues: memberClassification,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Member Classification',
            description:
                'Are you sure you want to delete this Member Classification?',
            onConfirm: () =>
                deleteMemberClassification(memberClassification.id),
        })
    }

    return {
        memberClassification,
        isDeletingMemberClassification,
        handleEdit,
        handleDelete,
    }
}

interface IMemberClassificationTableActionProps
    extends IMemberClassificationTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const MemberClassificationAction = ({
    row,
    onDeleteSuccess,
}: IMemberClassificationTableActionProps) => {
    const { isDeletingMemberClassification, handleEdit, handleDelete } =
        useMemberClassificationActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()} />
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberClassification,
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

interface IMemberClassificationRowContextProps
    extends IMemberClassificationTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberClassificationRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberClassificationRowContextProps) => {
    const { isDeletingMemberClassification, handleEdit, handleDelete } =
        useMemberClassificationActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed: !isDeletingMemberClassification,
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

export const MemberClassificationTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMemberClassification,
        MemberClassificationActionType,
        MemberClassificationActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const memberClassification = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <MemberClassificationCreateUpdateFormModal
                    description="Modify/Update the member classification..."
                    formProps={{
                        memberClassificationId: memberClassification.id,
                        defaultValues: memberClassification,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Update Member Classification"
                />
            )}
        </>
    )
}

export default MemberClassificationAction
