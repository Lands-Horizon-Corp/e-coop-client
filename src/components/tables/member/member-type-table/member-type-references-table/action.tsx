// actions.tsx
import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { MemberTypeReferenceCreateUpdateFormModal } from '@/components/forms/member-forms/member-type-reference-create-update-form'

import { useDeleteMemberTypeReference } from '@/hooks/api-hooks/member/use-member-type-reference'

import { IMemberTypeReferenceTableActionComponentProp } from './columns'

interface IMemberTypeReferenceActionProps
    extends IMemberTypeReferenceTableActionComponentProp {
    onMemberTypeReferenceUpdate?: () => void
    onDeleteSuccess?: () => void
}

const MemberTypeReferenceAction = ({
    row,
    onDeleteSuccess,
}: IMemberTypeReferenceActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const memberTypeReference = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteMemberTypeReference } =
        useDeleteMemberTypeReference({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <MemberTypeReferenceCreateUpdateFormModal
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                    formProps={{
                        defaultValues: memberTypeReference,
                        memberTypeReferenceId: memberTypeReference.id,
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Member Type Reference',
                            description:
                                'Are you sure you want to delete this reference?',
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

export default MemberTypeReferenceAction
