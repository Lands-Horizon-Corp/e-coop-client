import { ReactNode } from 'react'

import { useDeleteById } from '@/modules/member-occupation/member-occupation.service'
import { IMemberOccupation } from '@/modules/member-occupation/member-occupation.types'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { MemberOccupationCreateUpdateFormModal } from '../../member-occupation-create-update-form'
import { IMemberOccupationTableActionComponentProp } from './columns'

interface UseMemberOccupationActionsProps {
    row: Row<IMemberOccupation>
    onDeleteSuccess?: () => void
}

const useMemberOccupationActions = ({
    row,
    onDeleteSuccess,
}: UseMemberOccupationActionsProps) => {
    const updateModal = useModalState()
    const memberOccupation = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingMemberOccupation,
        mutate: deleteMemberOccupation,
    } = useDeleteById({
        options: {
            onSuccess: onDeleteSuccess,
        },
    })

    const handleEdit = () => updateModal.onOpenChange(true)

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
        updateModal,
        isDeletingMemberOccupation,
        handleEdit,
        handleDelete,
    }
}

interface IMemberOccupationTableActionProps
    extends IMemberOccupationTableActionComponentProp {
    onMemberOccupationUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberOccupationAction = ({
    row,
    onDeleteSuccess,
}: IMemberOccupationTableActionProps) => {
    const {
        memberOccupation,
        updateModal,
        isDeletingMemberOccupation,
        handleEdit,
        handleDelete,
    } = useMemberOccupationActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberOccupationCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        memberOccupationId: memberOccupation.id,
                        defaultValues: { ...memberOccupation },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                    title="Update Member Occupation"
                    description="Modify/Update this member occupation..."
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberOccupation,
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

interface IMemberOccupationRowContextProps
    extends IMemberOccupationTableActionComponentProp {
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
        updateModal,
        isDeletingMemberOccupation,
        handleEdit,
        handleDelete,
    } = useMemberOccupationActions({ row, onDeleteSuccess })

    return (
        <>
            <MemberOccupationCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    memberOccupationId: memberOccupation.id,
                    defaultValues: { ...memberOccupation },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
                title="Update Member Occupation"
                description="Modify/Update this member occupation..."
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberOccupation,
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

export default MemberOccupationAction
