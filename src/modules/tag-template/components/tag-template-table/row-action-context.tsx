import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteTagTemplateById } from '../../tag-template.service'
import { ITagTemplate } from '../../tag-template.types'
import { TagTemplateCreateUpdateFormModal } from '../forms/tag-template-create-update-form'
import { ITagTemplateTableActionComponentProp } from './columns'

interface UseTagTemplateActionsProps {
    row: Row<ITagTemplate>
    onDeleteSuccess?: () => void
}

const useTagTemplateActions = ({
    row,
    onDeleteSuccess,
}: UseTagTemplateActionsProps) => {
    const updateModal = useModalState()
    const tagTemplate = row.original

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

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Tag Template',
            description: 'Are you sure you want to delete this tag template?',
            onConfirm: () => deleteTagTemplate(tagTemplate.id),
        })
    }

    return {
        tagTemplate,
        updateModal,
        isDeleting,
        handleEdit,
        handleDelete,
    }
}

interface ITagTemplateTableActionProps
    extends ITagTemplateTableActionComponentProp {
    onTagTemplateUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const TagTemplateAction = ({
    row,
    onDeleteSuccess,
}: ITagTemplateTableActionProps) => {
    const { tagTemplate, updateModal, isDeleting, handleEdit, handleDelete } =
        useTagTemplateActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <TagTemplateCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        tagTemplateId: tagTemplate.id,
                        defaultValues: tagTemplate,
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

interface ITagTemplateRowContextProps
    extends ITagTemplateTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const TagTemplateRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ITagTemplateRowContextProps) => {
    const { tagTemplate, updateModal, isDeleting, handleEdit, handleDelete } =
        useTagTemplateActions({ row, onDeleteSuccess })

    return (
        <>
            <TagTemplateCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    tagTemplateId: tagTemplate.id,
                    defaultValues: tagTemplate,
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

export default TagTemplateAction
