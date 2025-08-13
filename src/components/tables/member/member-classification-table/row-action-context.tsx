import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { MemberClassificationCreateUpdateFormModal } from '@/components/forms/member-forms/member-classification-create-update-form'

import { useDeleteMemberClassification } from '@/hooks/api-hooks/member/use-member-classification'
import { useModalState } from '@/hooks/use-modal-state'

import { IMemberClassification } from '@/types'

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
    } = useDeleteMemberClassification({
        onSuccess: onDeleteSuccess,
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
                    formProps={{
                        memberClassificationId: memberClassification.id,
                        defaultValues: { ...memberClassification },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                    title="Update Member Classification"
                    description="Modify/Update the member classification..."
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
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
                formProps={{
                    memberClassificationId: memberClassification.id,
                    defaultValues: { ...memberClassification },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
                title="Update Member Classification"
                description="Modify/Update the member classification..."
            />
            <DataTableRowContext
                row={row}
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
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default MemberClassificationAction
