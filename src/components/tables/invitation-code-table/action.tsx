import { useState } from 'react'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { IInvitationTableActionComponentProp } from './columns'
import { InivationCodeFormModal } from '@/components/forms/inivitation-code-create-update.form'
import { useDeleteInvitationCode } from '@/hooks/api-hooks/use-invitation-code'

interface IInvitationCodeTableActionProps
    extends IInvitationTableActionComponentProp {
    onBankUpdate?: () => void
    onDeleteSuccess?: () => void
}

const InvitationCodeAction = ({
    row,
    onDeleteSuccess,
}: IInvitationCodeTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)

    const invitationCode = row.original
    const organizationId = invitationCode.organization?.id
    const branchId = invitationCode.branch?.id

    const { onOpen } = useConfirmModalStore()

    const deleteInvitationCodeMutation = useDeleteInvitationCode(
        invitationCode.code,
        organizationId,
        branchId
    )
    const deleteMutation = deleteInvitationCodeMutation({
        onSuccess: onDeleteSuccess,
    })
    const isDeletingInvitationCode = deleteMutation.isPending

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <InivationCodeFormModal
                    className="!max-w-2xl"
                    organizationId={organizationId}
                    branchId={branchId}
                    onOpenChange={setUpdateModalForm}
                    open={updateModalForm}
                    title="Edit Invitation Code"
                    description="Update details for this invitation code."
                    titleClassName="font-bold"
                    formProps={{
                        defaultValues: {
                            ...invitationCode,
                        },
                        onSuccess: () => {
                            setUpdateModalForm(false)
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingInvitationCode,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Invitation Code',
                            description:
                                'Are you sure you want to delete this Invitation Code?',
                            onConfirm: () => deleteMutation.mutate(),
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

export default InvitationCodeAction
