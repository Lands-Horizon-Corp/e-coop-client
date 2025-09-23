import { ReactNode } from 'react'

import { toast } from 'sonner'

import {
    IInvitationCode,
    InvitationCodeCreateUpdateFormModal,
    useDeleteById,
} from '@/modules/invitation-code'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useInfoModalStore } from '@/store/info-modal-store'
import { Row } from '@tanstack/react-table'

import CopyURL from '@/components/copy-url'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { KeySharpIcon, LinkIcon, QrCodeIcon } from '@/components/icons'
import { QrCodeDownloadable } from '@/components/qr-code'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { IInvitationTableActionComponentProp } from './columns'

interface UseInvitationCodeActionsProps {
    row: Row<IInvitationCode>
    onDeleteSuccess?: () => void
}

const useInvitationCodeActions = ({
    row,
    onDeleteSuccess,
}: UseInvitationCodeActionsProps) => {
    const updateModal = useModalState()
    const invitationCode = row.original

    const { onOpen } = useConfirmModalStore()
    const { onOpen: openInfoModal } = useInfoModalStore()

    const {
        mutate: deleteInvitationCodeMutation,
        isPending: isDeletingInvitationCode,
    } = useDeleteById({
        options: {
            onSuccess: () => {
                toast.success('Invitation Code deleted')
                onDeleteSuccess?.()
            },
        },
    })

    const selfUrl = window.location.origin
    const invitationUrl = `${selfUrl}/onboarding/organization?invitation_code=${invitationCode.code}`

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Invitation Code',
            description:
                'Are you sure you want to delete this Invitation Code?',
            onConfirm: () => deleteInvitationCodeMutation(invitationCode.id),
        })
    }

    const handleShowQR = () => {
        openInfoModal({
            title: 'Invitation Code QR',
            description: 'Share this invitation QR Code.',
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

    const handleCopyCode = () => {
        try {
            navigator.clipboard.writeText(invitationCode.code)
            toast.success('Invitation Code Copied')
        } catch {
            toast.error('Failed to copy Invitation Code')
        }
    }

    const handleCopyURL = () => {
        try {
            navigator.clipboard.writeText(invitationUrl)
            toast.success('Invitation URL Copied')
        } catch {
            toast.error('Failed to copy')
        }
    }

    return {
        invitationCode,
        updateModal,
        isDeletingInvitationCode,
        invitationUrl,
        handleEdit,
        handleDelete,
        handleShowQR,
        handleCopyCode,
        handleCopyURL,
    }
}

interface IInvitationCodeTableActionProps
    extends IInvitationTableActionComponentProp {
    onInvitationUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const InvitationCodeAction = ({
    row,
    onDeleteSuccess,
}: IInvitationCodeTableActionProps) => {
    const {
        invitationCode,
        updateModal,
        isDeletingInvitationCode,
        handleEdit,
        handleDelete,
        handleShowQR,
        handleCopyCode,
        handleCopyURL,
    } = useInvitationCodeActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <InvitationCodeCreateUpdateFormModal
                    {...updateModal}
                    title="Edit Invitation Code"
                    description="Update details for this invitation code."
                    titleClassName="font-bold"
                    formProps={{
                        invitationCodeId: invitationCode.id,
                        defaultValues: invitationCode,
                        onSuccess: () => {
                            onDeleteSuccess?.()
                            updateModal.onOpenChange(false)
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingInvitationCode,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <DropdownMenuItem onClick={handleShowQR}>
                            <QrCodeIcon className="mr-2" />
                            Show QR
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopyCode}>
                            <KeySharpIcon className="mr-2" />
                            Copy Code
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopyURL}>
                            <LinkIcon className="mr-2" />
                            Copy URL
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

interface IInvitationCodeRowContextProps
    extends IInvitationTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const InvitationCodeRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IInvitationCodeRowContextProps) => {
    const {
        invitationCode,
        updateModal,
        isDeletingInvitationCode,
        handleEdit,
        handleDelete,
        handleShowQR,
        handleCopyCode,
        handleCopyURL,
    } = useInvitationCodeActions({ row, onDeleteSuccess })

    return (
        <>
            <InvitationCodeCreateUpdateFormModal
                {...updateModal}
                title="Edit Invitation Code"
                description="Update details for this invitation code."
                titleClassName="font-bold"
                formProps={{
                    invitationCodeId: invitationCode.id,
                    defaultValues: invitationCode,
                    onSuccess: () => {
                        onDeleteSuccess?.()
                        updateModal.onOpenChange(false)
                    },
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete Invitation Code',
                    isAllowed: !isDeletingInvitationCode,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit Invitation Code',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <ContextMenuItem onClick={handleShowQR}>
                            <QrCodeIcon className="mr-2" />
                            Show QR
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleCopyCode}>
                            <KeySharpIcon className="mr-2" />
                            Copy Code
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleCopyURL}>
                            <LinkIcon className="mr-2" />
                            Copy URL
                        </ContextMenuItem>
                    </>
                }
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default InvitationCodeAction
