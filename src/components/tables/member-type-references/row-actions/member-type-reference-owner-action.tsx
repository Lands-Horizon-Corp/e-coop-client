import { useState } from 'react'
import { IMemberTypeReferencesTableActionComponentProp } from '../columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberTypeReferenceCreateUpdateFormModal } from '@/components/forms/member-forms/member-type-reference-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberType } from '@/hooks/api-hooks/member/use-member-type'

interface IMemberTypeTableOwnerActionProps
    extends IMemberTypeReferencesTableActionComponentProp {
    onMemberTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberTypeReferenceTableOwnerAction = ({
    row,
    onDeleteSuccess,
}: IMemberTypeTableOwnerActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const memberTypeReference = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingMemberType,
        mutate: deleteMemberTypeReference,
    } = useDeleteMemberType({
        onSuccess: onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberTypeReferenceCreateUpdateFormModal
                    formProps={{
                        memberTypeReferenceId: memberTypeReference.id,
                        defaultValues: {
                            ...memberTypeReference,
                        },
                    }}
                    title="Update Member Type Reference"
                    description="Modify/Update members type reference..."
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
                            title: 'Delete Member Type Reference',
                            description:
                                'Are you sure to delete this Member Type Reference?',
                            onConfirm: () =>
                                deleteMemberTypeReference(
                                    memberTypeReference.id
                                ),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
            />
        </>
    )
}

export default MemberTypeReferenceTableOwnerAction
