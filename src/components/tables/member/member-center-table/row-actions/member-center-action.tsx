import { useState } from 'react'
import { IMemberCenterTableActionComponentProp } from '../columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberCenter } from '@/hooks/api-hooks/member/use-member-center'
import { MemberCenterCreateUpdateFormModal } from '@/components/forms/member-forms/member-center-create-update-form'

interface IMemberCenterTableOwnerActionProps
    extends IMemberCenterTableActionComponentProp {
    onMemberCenterUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberCenterTableOwnerAction = ({
    row,
    onDeleteSuccess,
}: IMemberCenterTableOwnerActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const memberCenter = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingMemberCenter, mutate: deleteMemberCenter } =
        useDeleteMemberCenter({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberCenterCreateUpdateFormModal
                    formProps={{
                        memberCenterId: memberCenter.id,
                        defaultValues: {
                            ...memberCenter,
                        },
                        onSuccess() {
                            setUpdateModalForm(false)
                        },
                    }}
                    title="Update Member Center"
                    description="Modify/Update member center..."
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberCenter,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Member Center',
                            description:
                                'Are you sure to delete this Member Center?',
                            onConfirm: () =>
                                deleteMemberCenter(memberCenter.id),
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

export default MemberCenterTableOwnerAction
