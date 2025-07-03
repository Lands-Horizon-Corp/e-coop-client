import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useInfoModalStore } from '@/store/info-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import CopyURL from '@/components/elements/copy-url'
import { InivationCodeFormModal } from '@/components/forms/inivitation-code-create-update.form'
import { QrCodeIcon } from '@/components/icons'
import { QrCodeDownloadable } from '@/components/qr-code'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useDeleteInvitationCode } from '@/hooks/api-hooks/use-invitation-code'

import { IInvitationTableActionComponentProp } from './columns'

interface IInvitationCodeTableActionProps
    extends IInvitationTableActionComponentProp {
    onInvitationUpdate?: () => void
    onDeleteSuccess?: () => void
}

const InvitationCodeAction = ({
    row,
    onDeleteSuccess,
}: IInvitationCodeTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const invitationCode = row.original
    const { onOpen } = useConfirmModalStore()
    const { onOpen: openInfoModal } = useInfoModalStore()

    const {
        mutate: deleteInvitationCodeMutation,
        isPending: isDeletingInvitationCode,
    } = useDeleteInvitationCode()

    const selfUrl = window.location.origin

    const invitationUrl = `${selfUrl}/onboarding/organization?invitation_code=${invitationCode.code}`

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <InivationCodeFormModal
                    className="!max-w-2xl"
                    onOpenChange={setUpdateModalForm}
                    open={updateModalForm}
                    title="Edit Invitation Code"
                    description="Update details for this invitation code."
                    titleClassName="font-bold"
                    formProps={{
                        invitationCodeId: invitationCode.id,
                        defaultValues: invitationCode,
                        onSuccess: () => {
                            onDeleteSuccess?.()
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
                            onConfirm: () =>
                                deleteInvitationCodeMutation(invitationCode.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() =>
                                openInfoModal({
                                    title: 'Invitation Code QR',
                                    description:
                                        'Share this invitation QR Code.',
                                    classNames: {
                                        className: 'w-fit',
                                    },
                                    component: (
                                        <div className="space-y-2">
                                            <QrCodeDownloadable
                                                className="size-80 p-3"
                                                containerClassName="mx-auto"
                                                fileName={`invitation_code_${invitationCode.code}`}
                                                value={invitationUrl}
                                            />
                                            <CopyURL
                                                url={invitationUrl}
                                                className="mx-auto w-fit"
                                                displayText="Click here to copy invitation URL"
                                            />
                                        </div>
                                    ),
                                })
                            }
                        >
                            <QrCodeIcon className="mr-2" />
                            Show QR
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

export default InvitationCodeAction
