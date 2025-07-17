import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { PermissionTemplateCreateUpdateFormModal } from '@/components/forms/permission-template-create-update-form'

import { useDeletePermissionTemplate } from '@/hooks/api-hooks/use-permission-template'

import { IPermissionTemplateTableActionComponentProp } from './columns'

interface IPermissionTemplateTableActionProps
    extends IPermissionTemplateTableActionComponentProp {
    onPermissionTemplateUpdate?: () => void
    onDeleteSuccess?: () => void
}

const PermissionTemplateTableAction = ({
    row,
    onDeleteSuccess,
}: IPermissionTemplateTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const permissionTemplate = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deletePermissionTemplate } =
        useDeletePermissionTemplate({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <PermissionTemplateCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        permissionTemplateId: permissionTemplate.id,
                        defaultValues: {
                            ...permissionTemplate,
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Permission Template',
                            description:
                                'Are you sure you want to delete this Permission Template?',
                            onConfirm: () =>
                                deletePermissionTemplate(permissionTemplate.id),
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

export default PermissionTemplateTableAction
