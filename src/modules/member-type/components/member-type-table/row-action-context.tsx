import { ReactNode } from 'react'

import { MemberTypeReferenceCreateUpdateFormModal } from '@/modules/member-type-reference/components/member-type-reference-create-update-form'
import MemberTypeReferenceTable from '@/modules/member-type-reference/components/member-type-references-table'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { ArrowTrendUpIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteById } from '../../member-type.service'
import { IMemberType } from '../../member-type.types'
import { MemberTypeCreateUpdateFormModal } from '../forms/member-type-create-update-form'
import { IMemberTypeTableActionComponentProp } from './columns'

interface UseMemberTypeActionsProps {
    row: Row<IMemberType>
    onDeleteSuccess?: () => void
}

const useMemberTypeActions = ({
    row,
    onDeleteSuccess,
}: UseMemberTypeActionsProps) => {
    const createUpdateModal = useModalState()
    const referenceCreateUpdateModal = useModalState()
    const referenceTableModal = useModalState()
    const memberType = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingMemberType, mutate: deleteMemberType } =
        useDeleteById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => createUpdateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Member Type',
            description: 'Are you sure to delete this Member Type?',
            onConfirm: () => deleteMemberType(memberType.id),
        })
    }

    const handleBrowseReferences = () => referenceTableModal.onOpenChange(true)

    return {
        memberType,
        createUpdateModal,
        referenceCreateUpdateModal,
        referenceTableModal,
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
        memberType,
        createUpdateModal,
        referenceCreateUpdateModal,
        referenceTableModal,
        isDeletingMemberType,
        handleEdit,
        handleDelete,
        handleBrowseReferences,
    } = useMemberTypeActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberTypeCreateUpdateFormModal
                    {...createUpdateModal}
                    description="Modify/Update members type..."
                    formProps={{
                        memberTypeId: memberType.id,
                        defaultValues: memberType,
                        onSuccess: () => createUpdateModal.onOpenChange(false),
                    }}
                    title="Update Member Type"
                />
                <MemberTypeReferenceCreateUpdateFormModal
                    {...referenceCreateUpdateModal}
                    formProps={{
                        defaultValues: memberType,
                        disabledFields: ['member_type_id'],
                        onSuccess: () =>
                            referenceCreateUpdateModal.onOpenChange(false),
                    }}
                />
                <Modal
                    {...referenceTableModal}
                    className="!max-w-[95vw]"
                    title={`Member type reference for member type ${memberType.name}`}
                >
                    <MemberTypeReferenceTable
                        className="flex min-h-[80vh] max-w-full min-w-0 flex-1 flex-col gap-y-4 rounded-xl bg-background"
                        memberTypeId={memberType.id}
                        mode="specific"
                        toolbarProps={{
                            createActionProps: {
                                onClick: () =>
                                    referenceCreateUpdateModal.onOpenChange(
                                        true
                                    ),
                            },
                        }}
                    />
                </Modal>
            </div>
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
        memberType,
        createUpdateModal,
        referenceCreateUpdateModal,
        referenceTableModal,
        isDeletingMemberType,
        handleEdit,
        handleDelete,
        handleBrowseReferences,
    } = useMemberTypeActions({ row, onDeleteSuccess })

    return (
        <>
            <MemberTypeCreateUpdateFormModal
                {...createUpdateModal}
                description="Modify/Update members type..."
                formProps={{
                    memberTypeId: memberType.id,
                    defaultValues: memberType,
                    onSuccess: () => createUpdateModal.onOpenChange(false),
                }}
                title="Update Member Type"
            />
            <MemberTypeReferenceCreateUpdateFormModal
                {...referenceCreateUpdateModal}
                formProps={{
                    defaultValues: memberType,
                    disabledFields: ['member_type_id'],
                    onSuccess: () =>
                        referenceCreateUpdateModal.onOpenChange(false),
                }}
            />
            <Modal
                {...referenceTableModal}
                className="!max-w-[95vw]"
                title={`Member type reference for member type ${memberType.name}`}
            >
                <MemberTypeReferenceTable
                    className="flex min-h-[80vh] max-w-full min-w-0 flex-1 flex-col gap-y-4 rounded-xl bg-background"
                    memberTypeId={memberType.id}
                    mode="specific"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () =>
                                referenceCreateUpdateModal.onOpenChange(true),
                        },
                    }}
                />
            </Modal>
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

export default MemberTypeAction
