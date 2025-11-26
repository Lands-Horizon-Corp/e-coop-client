import { ReactNode } from 'react'

import { MemberTypeReferenceCreateUpdateFormModal } from '@/modules/member-type-reference/components/member-type-reference-create-update-form'
import MemberTypeReferenceTable from '@/modules/member-type-reference/components/member-type-references-table'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import { ArrowTrendUpIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useDeleteById } from '../../member-type.service'
import { IMemberType } from '../../member-type.types'
import { MemberTypeCreateUpdateFormModal } from '../forms/member-type-create-update-form'
import { IMemberTypeTableActionComponentProp } from './columns'

export type MemberTypeActionType =
    | 'edit'
    | 'delete'
    | 'reference-create'
    | 'browse-references'

export type MemberTypeActionExtra = Record<string, never>

interface UseMemberTypeActionsProps {
    row: Row<IMemberType>
    onDeleteSuccess?: () => void
}

const useMemberTypeActions = ({
    row,
    onDeleteSuccess,
}: UseMemberTypeActionsProps) => {
    const memberType = row.original
    const { open } = useTableRowActionStore<
        IMemberType,
        MemberTypeActionType,
        MemberTypeActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingMemberType, mutate: deleteMemberType } =
        useDeleteById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: memberType.id,
            defaultValues: memberType,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Member Type',
            description: 'Are you sure to delete this Member Type?',
            onConfirm: () => deleteMemberType(memberType.id),
        })
    }

    const handleBrowseReferences = () => {
        open('browse-references', {
            id: memberType.id,
            defaultValues: memberType,
        })
    }

    return {
        memberType,
        isDeletingMemberType,
        handleEdit,
        handleDelete,
        handleBrowseReferences,
    }
}

interface IMemberTypeTableActionProps
    extends IMemberTypeTableActionComponentProp {
    onMemberTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberTypeAction = ({
    row,
    onDeleteSuccess,
}: IMemberTypeTableActionProps) => {
    const {
        isDeletingMemberType,
        handleEdit,
        handleDelete,
        handleBrowseReferences,
    } = useMemberTypeActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberType,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <DropdownMenuItem onClick={handleBrowseReferences}>
                            <ArrowTrendUpIcon className="mr-2" />
                            Browse References
                        </DropdownMenuItem>
                    </>
                }
                row={row}
            />
        </>
    )
}

interface IMemberTypeRowContextProps
    extends IMemberTypeTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const MemberTypeRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMemberTypeRowContextProps) => {
    const {
        isDeletingMemberType,
        handleEdit,
        handleDelete,
        handleBrowseReferences,
    } = useMemberTypeActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberType,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <ContextMenuItem onClick={handleBrowseReferences}>
                            <ArrowTrendUpIcon className="mr-2" />
                            Browse References
                        </ContextMenuItem>
                    </>
                }
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const MemberTypeTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMemberType,
        MemberTypeActionType,
        MemberTypeActionExtra
    >()
    const { open } = useTableRowActionStore<
        IMemberType,
        MemberTypeActionType,
        MemberTypeActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const memberType = state.defaultValues

    const handleOpenReferenceCreate = () => {
        open('reference-create', {
            id: memberType.id,
            defaultValues: memberType,
        })
    }

    return (
        <>
            {state.action === 'edit' && (
                <MemberTypeCreateUpdateFormModal
                    description="Modify/Update members type..."
                    formProps={{
                        memberTypeId: memberType.id,
                        defaultValues: memberType,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Update Member Type"
                />
            )}
            {state.action === 'reference-create' && (
                <MemberTypeReferenceCreateUpdateFormModal
                    formProps={{
                        defaultValues: memberType,
                        disabledFields: ['member_type_id'],
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'browse-references' && (
                <Modal
                    className="!max-w-[95vw]"
                    onOpenChange={close}
                    open={state.isOpen}
                    title={`Member type reference for member type ${memberType.name}`}
                >
                    <MemberTypeReferenceTable
                        className="flex min-h-[80vh] max-w-full min-w-0 flex-1 flex-col gap-y-4 rounded-xl bg-background"
                        memberTypeId={memberType.id}
                        mode="specific"
                        toolbarProps={{
                            createActionProps: {
                                onClick: handleOpenReferenceCreate,
                            },
                        }}
                    />
                </Modal>
            )}
        </>
    )
}

export default MemberTypeAction
