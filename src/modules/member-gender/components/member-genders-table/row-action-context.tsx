import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteById } from '../../member-gender.service'
import { IMemberGender } from '../../member-gender.types'
import { MemberGenderCreateUpdateFormModal } from '../member-gender-create-update-form'
import { IMemberGenderTableActionComponentProp } from './columns'

export type MemberGenderActionType = 'edit' | 'delete'
export type MemberGenderActionExtra = Record<string, never>

interface UseMemberGenderActionsProps {
    row: Row<IMemberGender>
    onDeleteSuccess?: () => void
}

const useMemberGenderActions = ({
    row,
    onDeleteSuccess,
}: UseMemberGenderActionsProps) => {
    const gender = row.original

    const { open } = useTableRowActionStore<
        IMemberGender,
        MemberGenderActionType,
        MemberGenderActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingGender, mutate: deleteGender } = useDeleteById(
        {
            options: {
                onSuccess: onDeleteSuccess,
            },
        }
    )

    const handleEdit = () => {
        open('edit', {
            id: gender.id,
            defaultValues: gender,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Gender',
            description: 'Are you sure you want to delete this Gender?',
            onConfirm: () => deleteGender(gender.id),
        })
    }

    return {
        gender,
        isDeletingGender,
        handleEdit,
        handleDelete,
    }
}

interface IMemberGenderTableActionProps
    extends IMemberGenderTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const MemberGenderAction = ({
    row,
    onDeleteSuccess,
}: IMemberGenderTableActionProps) => {
    const { isDeletingGender, handleEdit, handleDelete } =
        useMemberGenderActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()} />
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
    const { isDeletingGender, handleEdit, handleDelete } =
        useMemberGenderActions({ row, onDeleteSuccess })

    return (
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
    )
}

export const MemberGenderTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMemberGender,
        MemberGenderActionType,
        MemberGenderActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const gender = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <MemberGenderCreateUpdateFormModal
                    description="Modify/Update gender information..."
                    formProps={{
                        genderId: gender.id,
                        defaultValues: gender,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Update Gender"
                />
            )}
        </>
    )
}

export default MemberGenderAction
