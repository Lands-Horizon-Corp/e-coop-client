import { useState } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { toReadableDate } from '@/helpers/date-utils'
import { IMemberProfile } from '@/modules/member-profile'
import { IMemberRelativeAccount } from '@/modules/member-relative-account'
import { useDeleteMemberRelativeAccount } from '@/modules/member-relative-account/member-relative-account.service'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    BadgeCheckFillIcon,
    BadgeQuestionIcon,
    PencilFillIcon,
    TrashIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { MemberRelativeAccountCreateUpdateFormModal } from '../../../../../member-relative-account/components/forms/member-relative-account-create-update-form'

const MemberRelativeAccountCard = ({
    relative,
    memberProfileId,
}: {
    relative: IMemberRelativeAccount
    memberProfileId: string
}) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteRelative, isPending: isDeleting } =
        useDeleteMemberRelativeAccount({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted',
                    textError: 'Failed to Deleted',
                }),
            },
        })

    const relProfile = relative.relative_member_profile

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-background p-4">
            <MemberRelativeAccountCreateUpdateFormModal
                description="Modify / Update this relative account information."
                formProps={{
                    memberProfileId,
                    defaultValues: relative,
                    relativeAccountId: relative.id,
                }}
                onOpenChange={setEdit}
                open={edit}
                title="Update Relative Account"
            />
            <div className="flex items-start justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <PreviewMediaWrapper media={relProfile?.media}>
                        <ImageDisplay
                            className="h-9 w-9 rounded-full border bg-muted object-cover"
                            src={relProfile?.media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <div className="flex min-w-0 flex-col">
                        <span className="flex items-center gap-1 truncate font-semibold">
                            {relProfile?.full_name || '-'}
                            {relProfile?.status === 'verified' ? (
                                <BadgeCheckFillIcon className="inline text-primary" />
                            ) : (
                                <BadgeQuestionIcon className="inline text-muted-foreground/60" />
                            )}
                        </span>
                        <span className="truncate text-xs text-muted-foreground/70">
                            {relProfile?.passbook || '-'}
                        </span>
                    </div>
                </div>
                <fieldset
                    className="flex items-center justify-end gap-1"
                    disabled={isDeleting}
                >
                    <Button
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        onClick={() => setEdit(true)}
                        size="icon"
                        variant="ghost"
                    >
                        <PencilFillIcon className="size-4" />
                    </Button>
                    <Button
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        hoverVariant="destructive"
                        onClick={() =>
                            onOpen({
                                title: 'Delete Relative Account',
                                description:
                                    'Are you sure to delete this relative account?',
                                onConfirm: () =>
                                    deleteRelative({
                                        memberProfileId,
                                        relativeAccountId: relative.id,
                                    }),
                            })
                        }
                        size="icon"
                        variant="ghost"
                    >
                        {isDeleting ? (
                            <LoadingSpinner />
                        ) : (
                            <TrashIcon className="size-4" />
                        )}
                    </Button>
                </fieldset>
            </div>
            <Separator className="!my-2" />
            <div className="grid grid-cols-2 gap-4 gap-y-2 py-4 text-sm">
                <div>
                    <span className="block text-xs text-muted-foreground/70">
                        Created
                    </span>
                    <span className="font-semibold">
                        {relative.created_at
                            ? toReadableDate(relative.created_at)
                            : '-'}
                    </span>
                </div>
                <div>
                    <span className="block text-xs text-muted-foreground/70">
                        Relationship
                    </span>
                    <span className="font-semibold">
                        {relative.family_relationship || '-'}
                    </span>
                </div>
            </div>
        </div>
    )
}

const MemberRelativeAccounts = ({
    memberProfile,
}: {
    memberProfile: IMemberProfile
}) => {
    const [create, setCreate] = useState(false)
    const relativeAccounts = memberProfile.member_relative_accounts || []

    return (
        <div>
            <MemberRelativeAccountCreateUpdateFormModal
                description="Add new relative account information."
                formProps={{
                    memberProfileId: memberProfile.id,
                    defaultValues: {
                        member_profile_id: memberProfile.id,
                    },
                }}
                onOpenChange={setCreate}
                open={create}
                title="Create Relative Account"
            />
            <div className="mb-2 flex items-start justify-between">
                <p>Relative Accounts</p>
                <Button onClick={() => setCreate(true)} size="sm">
                    Add Relative Account
                </Button>
            </div>
            <div className="space-y-4">
                {relativeAccounts.length > 0 ? (
                    relativeAccounts.map((relative) => (
                        <MemberRelativeAccountCard
                            key={relative.id}
                            memberProfileId={memberProfile.id}
                            relative={relative}
                        />
                    ))
                ) : (
                    <div className="py-6 text-center text-muted-foreground">
                        No relative accounts yet
                    </div>
                )}
            </div>
        </div>
    )
}

export default MemberRelativeAccounts
