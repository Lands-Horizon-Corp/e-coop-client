import { ReactNode } from 'react'

import { toast } from 'sonner'

import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
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
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import { KeySharpIcon, LinkIcon, QrCodeIcon } from '@/components/icons'
import { QrCodeDownloadable } from '@/components/qr-code'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { IInvitationTableActionComponentProp } from './columns'

export type InvitationCodeActionType = 'edit'

export type InvitationCodeActionExtra = Record<string, never>

interface UseInvitationCodeActionsProps {
    row: Row<IInvitationCode>
    onDeleteSuccess?: () => void
}

const useInvitationCodeActions = ({
    row,
    onDeleteSuccess,
}: UseInvitationCodeActionsProps) => {
    const invitationCode = row.original

    const { open } = useTableRowActionStore<
        IInvitationCode,
        InvitationCodeActionType,
        InvitationCodeActionExtra
    >()

    const { onOpen } = useConfirmModalStore()
    const { onOpen: openInfoModal } = useInfoModalStore()

    const {
        mutate: deleteInvitationCode,
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

    const handleEdit = () => {
        open('edit', {
            id: invitationCode.id,
            defaultValues: invitationCode,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Invitation Code',
            description:
                'Are you sure you want to delete this Invitation Code?',
            onConfirm: () => deleteInvitationCode(invitationCode.id),
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
                        className="mx-auto w-fit"
                        displayText="Click here to copy invitation URL"
                        url={invitationUrl}
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
        invitationUrl,
        isDeletingInvitationCode,
        handleEdit,
        handleDelete,
        handleShowQR,
        handleCopyCode,
        handleCopyURL,
    }
}

interface IInvitationCodeTableActionProps extends IInvitationTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const InvitationCodeAction = ({
    row,
    onDeleteSuccess,
}: IInvitationCodeTableActionProps) => {
    const {
        invitationCode,
        isDeletingInvitationCode,
        handleEdit,
        handleDelete,
        handleShowQR,
        handleCopyCode,
        handleCopyURL,
    } = useInvitationCodeActions({ row, onDeleteSuccess })

    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingInvitationCode &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'InvitationCode',
                        resource: invitationCode,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'InvitationCode',
                    resource: invitationCode,
                }),
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
            row={row}
        />
    )
}

interface IInvitationCodeRowContextProps extends IInvitationTableActionComponentProp {
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
        isDeletingInvitationCode,
        handleEdit,
        handleDelete,
        handleShowQR,
        handleCopyCode,
        handleCopyURL,
    } = useInvitationCodeActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete Invitation Code',
                isAllowed:
                    !isDeletingInvitationCode &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'InvitationCode',
                        resource: invitationCode,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit Invitation Code',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'InvitationCode',
                    resource: invitationCode,
                }),
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
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const InvitationCodeTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IInvitationCode,
        InvitationCodeActionType,
        InvitationCodeActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const invitationCode = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <InvitationCodeCreateUpdateFormModal
                    description="Update details for this invitation code."
                    formProps={{
                        invitationCodeId: invitationCode.id,
                        defaultValues: invitationCode,
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Edit Invitation Code"
                    titleClassName="font-bold"
                />
            )}
        </>
    )
}

export default InvitationCodeAction
