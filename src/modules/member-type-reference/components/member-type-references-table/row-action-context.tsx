// actions.tsx
import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteById } from '../../member-type-reference.service'
import { IMemberTypeReference } from '../../member-type-reference.types'
import { MemberTypeReferenceCreateUpdateFormModal } from '../member-type-reference-create-update-form'
import { IMemberTypeReferenceTableActionComponentProp } from './columns'

interface UseMemberTypeReferenceActionsProps {
    row: Row<IMemberTypeReference>
    onDeleteSuccess?: () => void
}

const useMemberTypeReferenceActions = ({
    row,
    onDeleteSuccess,
}: UseMemberTypeReferenceActionsProps) => {
    const updateModal = useModalState()
    const memberTypeReference = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteMemberTypeReference } =
        useDeleteById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Member Type Reference',
            description: 'Are you sure you want to delete this reference?',
            onConfirm: () => deleteMemberTypeReference(memberTypeReference.id),
        })
    }

    return {
        memberTypeReference,
        updateModal,
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
    const {
        memberTypeReference,
        updateModal,
        isDeleting,
        handleEdit,
        handleDelete,
    } = useMemberTypeReferenceActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberTypeReferenceCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        defaultValues: memberTypeReference,
                        memberTypeReferenceId: memberTypeReference.id,
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
    const {
        memberTypeReference,
        updateModal,
        isDeleting,
        handleEdit,
        handleDelete,
    } = useMemberTypeReferenceActions({ row, onDeleteSuccess })

    return (
        <>
            <MemberTypeReferenceCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    defaultValues: memberTypeReference,
                    memberTypeReferenceId: memberTypeReference.id,
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

export default MemberTypeReferenceAction
