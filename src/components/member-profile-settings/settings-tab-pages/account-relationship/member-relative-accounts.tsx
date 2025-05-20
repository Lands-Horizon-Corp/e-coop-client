import { useState } from 'react'

import {
    TrashIcon,
    PencilFillIcon,
    BadgeQuestionIcon,
    BadgeCheckFillIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Table, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { MemberRelativeAccountCreateUpdateFormModal } from './member-relative-account-create-update-form'

import { IMemberProfile } from '@/types'
import { toReadableDate } from '@/utils'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberRelativeAccount } from '@/hooks/api-hooks/member/use-member-profile-settings'

const MemberRelativeAccounts = ({
    memberProfile,
}: {
    memberProfile: IMemberProfile
}) => {
    const [create, setCreate] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteRelative, isPending: isDeleting } =
        useDeleteMemberRelativeAccount()
    const [editId, setEditId] = useState<string | null>(null)

    return (
        <div>
            <MemberRelativeAccountCreateUpdateFormModal
                open={create}
                onOpenChange={setCreate}
                title="Create Relative Account"
                description="Add new relative account information."
                formProps={{
                    memberProfileId: memberProfile.id,
                    defaultValues: {
                        member_profile_id: memberProfile.id,
                    },
                }}
            />
            {editId && (
                <MemberRelativeAccountCreateUpdateFormModal
                    open={!!editId}
                    onOpenChange={() => setEditId(null)}
                    title="Update Relative Account"
                    description="Modify / Update this relative account information."
                    formProps={{
                        memberProfileId: memberProfile.id,
                        defaultValues:
                            memberProfile.member_relative_accounts?.find(
                                (r) => r.id === editId
                            ) || {},
                    }}
                />
            )}
            <div className="mb-2 flex items-start justify-between">
                <p>Relative Accounts</p>
                <Button size="sm" onClick={() => setCreate(true)}>
                    Add Relative Account
                </Button>
            </div>
            <div className="rounded-xl border bg-background">
                <Table>
                    <TableBody>
                        {memberProfile.member_relative_accounts &&
                        memberProfile.member_relative_accounts.length > 0 ? (
                            memberProfile.member_relative_accounts.map(
                                (relative) => {
                                    const relProfile =
                                        relative.relative_member_profile
                                    return (
                                        <TableRow key={relative.id}>
                                            <TableCell>
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <ImageDisplay
                                                        src={
                                                            relProfile?.media
                                                                ?.download_url
                                                        }
                                                        className="h-9 w-9 rounded-full border bg-muted object-cover"
                                                    />
                                                    <div className="flex min-w-0 flex-col">
                                                        <span className="flex items-center gap-1 truncate font-semibold">
                                                            {relProfile?.full_name ||
                                                                '-'}
                                                            {relProfile?.status ===
                                                            'verified' ? (
                                                                <BadgeCheckFillIcon className="inline text-primary" />
                                                            ) : (
                                                                <BadgeQuestionIcon className="inline text-muted-foreground/60" />
                                                            )}
                                                        </span>
                                                        <span className="truncate text-xs text-muted-foreground/70">
                                                            {relProfile?.passbook ||
                                                                '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-semibold">
                                                        {relative.created_at
                                                            ? toReadableDate(
                                                                  relative.created_at
                                                              )
                                                            : '-'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground/70">
                                                        Created
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-semibold">
                                                        {relative.family_relationship ||
                                                            '-'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground/70">
                                                        Relationship
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                                                        disabled={isDeleting}
                                                        onClick={() =>
                                                            setEditId(
                                                                relative.id
                                                            )
                                                        }
                                                    >
                                                        <PencilFillIcon className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        hoverVariant="destructive"
                                                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                                                        disabled={isDeleting}
                                                        onClick={() =>
                                                            onOpen({
                                                                title: 'Delete Relative Account',
                                                                description:
                                                                    'Are you sure to delete this relative account?',
                                                                onConfirm: () =>
                                                                    deleteRelative(
                                                                        {
                                                                            memberProfileId:
                                                                                relative.member_profile_id,
                                                                            relativeAccountId:
                                                                                relative.id,
                                                                        }
                                                                    ),
                                                            })
                                                        }
                                                    >
                                                        {isDeleting ? (
                                                            <LoadingSpinner />
                                                        ) : (
                                                            <TrashIcon className="size-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <div className="py-6 text-center text-muted-foreground">
                                        No relative accounts yet
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default MemberRelativeAccounts
