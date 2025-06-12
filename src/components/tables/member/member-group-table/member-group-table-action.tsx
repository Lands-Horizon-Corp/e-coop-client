import { useState } from 'react'

import { IMemberGroupTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberGroupCreateUpdateFormModal } from '@/components/forms/member-forms/member-group-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberGroup } from '@/hooks/api-hooks/member/use-member-group'

interface IMemberGroupTableActionProps
    extends IMemberGroupTableActionComponentProp {
    onGroupUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberGroupTableAction = ({
    row,
    onDeleteSuccess,
}: IMemberGroupTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const group = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingGroup, mutate: deleteGroup } =
        useDeleteMemberGroup({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberGroupCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        groupId: group.id,
                        defaultValues: {
                            ...group,
                        },
                        onSuccess() {
                            setUpdateModalForm(false)
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingGroup,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Group',
                            description:
                                'Are you sure you want to delete this Group?',
                            onConfirm: () => deleteGroup(group.id),
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

export default MemberGroupTableAction
