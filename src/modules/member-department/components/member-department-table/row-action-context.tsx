import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteById } from '../../member-department.service'
import { IMemberDepartment } from '../../member-department.types'
import { MemberDepartmentCreateUpdateFormModal } from '../member-department-create-update-form'
import { IMemberDepartmentTableActionComponentProp } from './columns'

interface UseMemberDepartmentActionsProps {
    row: Row<IMemberDepartment>
    onDeleteSuccess?: () => void
}

const useMemberDepartmentActions = ({
    row,
    onDeleteSuccess,
}: UseMemberDepartmentActionsProps) => {
    const updateModal = useModalState()
    const memberDepartment = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingMemberDepartment,
        mutate: deleteMemberDepartment,
    } = useDeleteById({
        options: {
            onSuccess: onDeleteSuccess,
        },
    })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Member Department',
            description:
                'Are you sure you want to delete this member department?',
            onConfirm: () => deleteMemberDepartment(memberDepartment.id),
        })
    }

    return {
        memberDepartment,
        updateModal,
        isDeletingMemberDepartment,
        handleEdit,
        handleDelete,
    }
}

interface IMemberDepartmentTableActionProps
    extends IMemberDepartmentTableActionComponentProp {
    onMemberDepartmentUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberDepartmentAction = ({
    row,
    onDeleteSuccess,
}: IMemberDepartmentTableActionProps) => {
    const {
        memberDepartment,
        updateModal,
        isDeletingMemberDepartment,
        handleEdit,
        handleDelete,
    } = useMemberDepartmentActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberDepartmentCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        memberDepartmentId: memberDepartment.id,
                        defaultValues: { ...memberDepartment },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberDepartment,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={<></>}
            />
        </>
    )
}

interface IMemberDepartmentRowContextProps
    extends IMemberDepartmentTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberDepartmentRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberDepartmentRowContextProps) => {
    const {
        memberDepartment,
        updateModal,
        isDeletingMemberDepartment,
        handleEdit,
        handleDelete,
    } = useMemberDepartmentActions({ row, onDeleteSuccess })

    return (
        <>
            <MemberDepartmentCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    memberDepartmentId: memberDepartment.id,
                    defaultValues: { ...memberDepartment },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberDepartment,
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

export default MemberDepartmentAction
