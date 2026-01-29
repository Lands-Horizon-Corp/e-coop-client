import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteTagTemplateById } from '../../tag-template.service'
import { ITagTemplate } from '../../tag-template.types'
import { TagTemplateCreateUpdateFormModal } from '../forms/tag-template-create-update-form'
import { ITagTemplateTableActionComponentProp } from './columns'

export type TagTemplateActionType = 'edit'

export type TagTemplateActionExtra = Record<string, never>

interface UseTagTemplateActionsProps {
    row: Row<ITagTemplate>
    onDeleteSuccess?: () => void
}

const useTagTemplateActions = ({
    row,
    onDeleteSuccess,
}: UseTagTemplateActionsProps) => {
    const tagTemplate = row.original

    const { open } = useTableRowActionStore<
        ITagTemplate,
        TagTemplateActionType,
        TagTemplateActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteTagTemplate } =
        useDeleteTagTemplateById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted tag template',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: tagTemplate.id,
            defaultValues: tagTemplate,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Tag Template',
            description: 'Are you sure you want to delete this tag template?',
            onConfirm: () => deleteTagTemplate(tagTemplate.id),
        })
    }

    return {
        tagTemplate,
        isDeleting,
        handleEdit,
        handleDelete,
    }
}

interface ITagTemplateTableActionProps extends ITagTemplateTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const TagTemplateAction = ({
    row,
    onDeleteSuccess,
}: ITagTemplateTableActionProps) => {
    const { tagTemplate, isDeleting, handleEdit, handleDelete } =
        useTagTemplateActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()} />
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed:
                        !isDeleting &&
                        hasPermissionFromAuth({
                            action: ['Delete', 'OwnDelete'],
                            resourceType: 'TagTemplate',
                            resource: tagTemplate,
                        }),
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'TagTemplate',
                        resource: tagTemplate,
                    }),
                    onClick: handleEdit,
                }}
                row={row}
            />
        </>
    )
}

interface ITagTemplateRowContextProps extends ITagTemplateTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const TagTemplateRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ITagTemplateRowContextProps) => {
    const { tagTemplate, isDeleting, handleEdit, handleDelete } =
        useTagTemplateActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeleting &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'TagTemplate',
                        resource: tagTemplate,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'TagTemplate',
                    resource: tagTemplate,
                }),
                onClick: handleEdit,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const TagTemplateTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ITagTemplate,
        TagTemplateActionType,
        TagTemplateActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const tagTemplate = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <TagTemplateCreateUpdateFormModal
                    formProps={{
                        tagTemplateId: tagTemplate.id,
                        defaultValues: tagTemplate,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default TagTemplateAction
