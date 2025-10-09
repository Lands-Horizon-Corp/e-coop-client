import { ReactNode } from 'react'

import {
    IMemberClassification,
    useDeleteById,
} from '@/modules/member-classification'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { MemberClassificationCreateUpdateFormModal } from '../../member-classification-create-update-form'
import { IMemberClassificationTableActionComponentProp } from './columns'

interface UseMemberClassificationActionsProps {
    row: Row<IMemberClassification>
    onDeleteSuccess?: () => void
}

const useMemberClassificationActions = ({
    row,
    onDeleteSuccess,
}: UseMemberClassificationActionsProps) => {
    const updateModal = useModalState()
    const memberClassification = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingMemberClassification,
        mutate: deleteMemberClassification,
    } = useDeleteById({
        options: {
            onSuccess: onDeleteSuccess,
        },
    })

    const handleEdit = () => updateModal.onOpenChange(true)

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
        updateModal,
        isDeletingMemberClassification,
        handleEdit,
        handleDelete,
    }
}

interface IMemberClassificationTableActionProps
    extends IMemberClassificationTableActionComponentProp {
    onMemberClassificationUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberClassificationAction = ({
    row,
    onDeleteSuccess,
}: IMemberClassificationTableActionProps) => {
    const {
        memberClassification,
        updateModal,
        isDeletingMemberClassification,
        handleEdit,
        handleDelete,
    } = useMemberClassificationActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberClassificationCreateUpdateFormModal
                    {...updateModal}
                    description="Modify/Update the member classification..."
                    formProps={{
                        memberClassificationId: memberClassification.id,
                        defaultValues: { ...memberClassification },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                    title="Update Member Classification"
                />
            </div>
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
                otherActions={<>{/* Additional actions can be added here */}</>}
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
    const {
        memberClassification,
        updateModal,
        isDeletingMemberClassification,
        handleEdit,
        handleDelete,
    } = useMemberClassificationActions({ row, onDeleteSuccess })

    return (
        <>
            <MemberClassificationCreateUpdateFormModal
                {...updateModal}
                description="Modify/Update the member classification..."
                formProps={{
                    memberClassificationId: memberClassification.id,
                    defaultValues: { ...memberClassification },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
                title="Update Member Classification"
            />
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
        </>
    )
}

export default MemberClassificationAction
