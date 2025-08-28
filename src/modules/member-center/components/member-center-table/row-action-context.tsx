import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { useModalState } from '@/hooks/use-modal-state'


import { IMemberCenterTableActionComponentProp } from './columns'
import { IMemberCenter } from '../../member-center.types'
import { useDeleteById } from '../../member-center.service'
import { MemberCenterCreateUpdateFormModal } from '../member-center-create-update-form'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

interface UseMemberCenterActionsProps {
    row: Row<IMemberCenter>
    onDeleteSuccess?: () => void
}

const useMemberCenterActions = ({
    row,
    onDeleteSuccess,
}: UseMemberCenterActionsProps) => {
    const updateModal = useModalState()
    const memberCenter = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingMemberCenter, mutate: deleteMemberCenter } =
        useDeleteById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Member Center',
            description: 'Are you sure to delete this Member Center?',
            onConfirm: () => deleteMemberCenter(memberCenter.id),
        })
    }

    return {
        memberCenter,
        updateModal,
        isDeletingMemberCenter,
        handleEdit,
        handleDelete,
    }
}

interface IMemberCenterTableActionProps
    extends IMemberCenterTableActionComponentProp {
    onMemberCenterUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberCenterAction = ({
    row,
    onDeleteSuccess,
}: IMemberCenterTableActionProps) => {
    const {
        memberCenter,
        updateModal,
        isDeletingMemberCenter,
        handleEdit,
        handleDelete,
    } = useMemberCenterActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberCenterCreateUpdateFormModal
                    {...updateModal}
                    title="Update Member Center"
                    description="Modify/Update member center..."
                    formProps={{
                        memberCenterId: memberCenter.id,
                        defaultValues: { ...memberCenter },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberCenter,
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

interface IMemberCenterRowContextProps
    extends IMemberCenterTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberCenterRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberCenterRowContextProps) => {
    const {
        memberCenter,
        updateModal,
        isDeletingMemberCenter,
        handleEdit,
        handleDelete,
    } = useMemberCenterActions({ row, onDeleteSuccess })

    return (
        <>
            <MemberCenterCreateUpdateFormModal
                {...updateModal}
                title="Update Member Center"
                description="Modify/Update member center..."
                formProps={{
                    memberCenterId: memberCenter.id,
                    defaultValues: { ...memberCenter },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberCenter,
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

export default MemberCenterAction
