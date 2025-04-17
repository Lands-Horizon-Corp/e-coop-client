import { useState } from 'react'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { IMemberEducationalAttainmentTableActionComponentProp } from '../columns'
import { MemberEducationalAttainmentCreateUpdateFormModal } from '@/components/forms/member-forms/member-educational-attainment-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberEducationalAttainment } from '@/hooks/api-hooks/member/use-member-educational-attainment'

export interface IMemberEducationalAttainmentTableOwnerActionProps
    extends IMemberEducationalAttainmentTableActionComponentProp {
    onMemberEducationalAttainmentUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberEducationalAttainmentTableOwnerAction = ({
    row,
    onDeleteSuccess,
}: IMemberEducationalAttainmentTableOwnerActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const educationalAttainment = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteEducationalAttainment } =
        useDeleteMemberEducationalAttainment({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberEducationalAttainmentCreateUpdateFormModal
                    formProps={{
                        memberEducationalAttainmentId: educationalAttainment.id,
                        defaultValues: { ...educationalAttainment },
                    }}
                    title="Update Educational Attainment"
                    description="Edit/Update educational attainment details"
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Educational Attainment',
                            description:
                                'Are you sure you want to delete this Educational Attainment?',
                            onConfirm: () =>
                                deleteEducationalAttainment(
                                    educationalAttainment.id
                                ),
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

export default MemberEducationalAttainmentTableOwnerAction
