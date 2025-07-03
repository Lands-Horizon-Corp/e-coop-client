import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberCenterCreateUpdateFormModal } from '@/components/forms/member-forms/member-center-create-update-form'

import { useDeleteMemberCenter } from '@/hooks/api-hooks/member/use-member-center'

import { IMemberCenterTableActionComponentProp } from './columns'

interface IMemberCenterTableActionProps
    extends IMemberCenterTableActionComponentProp {
    onMemberCenterUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberCenterTableAction = ({
    row,
    onDeleteSuccess,
}: IMemberCenterTableActionProps) => {
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

export default MemberCenterTableAction
