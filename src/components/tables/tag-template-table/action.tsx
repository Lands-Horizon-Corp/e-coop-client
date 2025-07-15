import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { TagTemplateCreateUpdateFormModal } from '@/components/forms/tag-template-create-update-form'

import { useDeleteTagTemplate } from '@/hooks/api-hooks/use-tag-template'

import { ITagTemplateTableActionComponentProp } from './columns'

interface ITagTemplateTableActionProps
    extends ITagTemplateTableActionComponentProp {
    onTagTemplateUpdate?: () => void
    onDeleteSuccess?: () => void
}

const TagTemplateAction = ({
    row,
    onDeleteSuccess,
}: ITagTemplateTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const tagTemplate = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteTagTemplate } =
        useDeleteTagTemplate({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <TagTemplateCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        tagTemplateId: tagTemplate.id,
                        defaultValues: tagTemplate,
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Tag Template',
                            description:
                                'Are you sure you want to delete this tag template?',
                            onConfirm: () => deleteTagTemplate(tagTemplate.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default TagTemplateAction
