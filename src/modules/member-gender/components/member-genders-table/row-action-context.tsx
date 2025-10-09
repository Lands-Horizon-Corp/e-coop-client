import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteById } from '../../member-gender.service'
import { IMemberGender } from '../../member-gender.types'
import { MemberGenderCreateUpdateFormModal } from '../member-gender-create-update-form'
import { IMemberGenderTableActionComponentProp } from './columns'

interface UseMemberGenderActionsProps {
    row: Row<IMemberGender>
    onDeleteSuccess?: () => void
}

const useMemberGenderActions = ({
    row,
    onDeleteSuccess,
}: UseMemberGenderActionsProps) => {
    const updateModal = useModalState()
    const gender = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingGender, mutate: deleteGender } = useDeleteById(
        {
            options: {
                onSuccess: onDeleteSuccess,
            },
        }
    )

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Gender',
            description: 'Are you sure you want to delete this Gender?',
            onConfirm: () => deleteGender(gender.id),
        })
    }

    return {
        gender,
        updateModal,
        isDeletingGender,
        handleEdit,
        handleDelete,
    }
}

interface IMemberGenderTableActionProps
    extends IMemberGenderTableActionComponentProp {
    onGenderUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberGenderAction = ({
    row,
    onDeleteSuccess,
}: IMemberGenderTableActionProps) => {
    const { gender, updateModal, isDeletingGender, handleEdit, handleDelete } =
        useMemberGenderActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberGenderCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        genderId: gender.id,
                        defaultValues: { ...gender },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingGender,
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

interface IMemberGenderRowContextProps
    extends IMemberGenderTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberGenderRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberGenderRowContextProps) => {
    const { gender, updateModal, isDeletingGender, handleEdit, handleDelete } =
        useMemberGenderActions({ row, onDeleteSuccess })

    return (
        <>
            <MemberGenderCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    genderId: gender.id,
                    defaultValues: { ...gender },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingGender,
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

export default MemberGenderAction
