import { ReactNode } from 'react'

import { useRouter } from '@tanstack/react-router'

import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { BrowseReferenceCreateUpdateFormModal } from '@/modules/browse-reference/components/forms/browse-reference-create-update-form'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import { ArrowTrendUpIcon } from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useDeleteMemberTypeById } from '../../member-type.service'
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
    const router = useRouter()
    const memberType = row.original
    const { open } = useTableRowActionStore<
        IMemberType,
        MemberTypeActionType,
        MemberTypeActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingMemberType, mutate: deleteMemberType } =
        useDeleteMemberTypeById({
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
        router.navigate({
            to: '../../schemes' as string,
            search: {
                tab: 'browse-reference',
                memberTypeId: memberType.id,
            },
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

interface IMemberTypeTableActionProps extends IMemberTypeTableActionComponentProp {
    onMemberTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const MemberTypeAction = ({
    row,
    onDeleteSuccess,
}: IMemberTypeTableActionProps) => {
    const {
        memberType,
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
                    isAllowed:
                        !isDeletingMemberType &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'MemberType',
                            resource: memberType,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'MemberType',
                        resource: memberType,
                    }),
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

interface IMemberTypeRowContextProps extends IMemberTypeTableActionComponentProp {
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
                    isAllowed:
                        !isDeletingMemberType &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'MemberType',
                            resource: memberType,
                        }),
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

    if (!state || !state.defaultValues) return null

    const memberType = state.defaultValues

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
                <BrowseReferenceCreateUpdateFormModal
                    formProps={{
                        defaultValues: memberType,
                        disabledFields: ['member_type_id'],
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default MemberTypeAction
