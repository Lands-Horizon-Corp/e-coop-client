import { useState } from 'react'
import { IMemberTypeTableActionComponentProp } from '../columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberType } from '@/hooks/api-hooks/member/use-member-type'
import { MemberTypeCreateUpdateFormModal } from '@/components/forms/member-forms/member-type-create-update-form'

interface IMemberTypeTableOwnerActionProps
    extends IMemberTypeTableActionComponentProp {
    onMemberTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberTypeTableOwnerAction = ({
    row,
    onDeleteSuccess,
}: IMemberTypeTableOwnerActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const memberType = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingMemberType, mutate: deleteMemberType } =
        useDeleteMemberType({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberTypeCreateUpdateFormModal
                    formProps={{
                        memberTypeId: memberType.id,
                        defaultValues: {
                            ...memberType,
                        },
                    }}
                    title="Update Member Type"
                    description="Modify/Update members type..."
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberType,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Member Type',
                            description:
                                'Are you sure to delete this Member Type?',
                            onConfirm: () => deleteMemberType(memberType.id),
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

export default MemberTypeTableOwnerAction
