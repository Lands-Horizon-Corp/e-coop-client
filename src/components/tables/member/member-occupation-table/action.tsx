import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberOccupationCreateUpdateFormModal } from '@/components/forms/member-forms/member-occupation-create-update-form'

import { useDeleteMemberOccupation } from '@/hooks/api-hooks/member/use-member-occupation'

import { IMemberOccupationTableActionComponentProp } from './columns'

interface IMemberOccupationTableActionProps
    extends IMemberOccupationTableActionComponentProp {
    onMemberOccupationUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberOccupationTableAction = ({
    row,
    onDeleteSuccess,
}: IMemberOccupationTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const memberOccupation = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingMemberOccupation,
        mutate: deleteMemberOccupation,
    } = useDeleteMemberOccupation({
        onSuccess: onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberOccupationCreateUpdateFormModal
                    formProps={{
                        memberOccupationId: memberOccupation.id,
                        defaultValues: {
                            ...memberOccupation,
                        },

                        onSuccess() {
                            setUpdateModalForm(false)
                        },
                    }}
                    title="Update Member Occupation"
                    description="Modify/Update this member occupation..."
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingMemberOccupation,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Member Occupation',
                            description:
                                'Are you sure you want to delete this member occupation?',
                            onConfirm: () =>
                                deleteMemberOccupation(memberOccupation.id),
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

export default MemberOccupationTableAction
