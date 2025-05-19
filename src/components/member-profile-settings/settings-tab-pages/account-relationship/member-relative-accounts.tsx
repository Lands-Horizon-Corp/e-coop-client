import { useState } from 'react'

import {
    PlusIcon,
    TrashIcon,
    PencilFillIcon,
    UserIcon,
    CalendarIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MemberRelativeAccountCreateUpdateFormModal } from './member-relative-account-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberRelativeAccount } from '@/hooks/api-hooks/member/use-member-profile-settings'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import EmptyListIndicator from '../empty-list-indicator'

import { IMemberRelativeAccount, IMemberProfile } from '@/types'
import { toReadableDate } from '@/utils'

const MemberRelativeAccountCard = ({
    relative,
}: {
    relative: IMemberRelativeAccount
}) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteRelative, isPending: isDeleting } =
        useDeleteMemberRelativeAccount()

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border p-4">
            <MemberRelativeAccountCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Relative Account"
                description="Modify / Update this relative account information."
                formProps={{
                    memberProfileId: relative.member_profile_id,
                    defaultValues: relative,
                }}
            />
            <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                    <UserIcon className="inline size-6 text-muted-foreground" />
                    <p className="font-bold">
                        {relative.relative_member_profile.first_name}{' '}
                        {relative.member_profile.last_name}
                    </p>
                </div>
                <div className="flex items-center justify-end">
                    <Button
                        size="icon"
                        variant="ghost"
                        hoverVariant="destructive"
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        disabled={isDeleting}
                        onClick={() => setEdit(true)}
                    >
                        <PencilFillIcon className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        disabled={isDeleting}
                        hoverVariant="destructive"
                        onClick={() =>
                            onOpen({
                                title: 'Delete Relative Account',
                                description:
                                    'Are you sure to delete this relative account?',
                                onConfirm: () =>
                                    deleteRelative({
                                        memberProfileId:
                                            relative.member_profile_id,
                                        relativeAccountId: relative.id,
                                    }),
                            })
                        }
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                    >
                        {isDeleting ? (
                            <LoadingSpinner />
                        ) : (
                            <TrashIcon className="size-4" />
                        )}
                    </Button>
                </div>
            </div>
            <Separator className="!my-2" />
            <div className="space-y-2">
                <div>
                    <CalendarIcon className="mr-2 inline size-5 text-muted-foreground" />
                    <span className="font-semibold">Birthday:</span>{' '}
                    {relative.relative_member_profile.birth_date
                        ? toReadableDate(
                              relative.relative_member_profile.birth_date
                          )
                        : '-'}
                </div>
                <div>
                    <span className="font-semibold">Relationship:</span>{' '}
                    {relative.family_relationship}
                </div>
                <div>
                    <span className="font-semibold">Description:</span>{' '}
                    {relative.description}
                </div>
            </div>
        </div>
    )
}

interface Props {
    memberProfile: IMemberProfile
}

const MemberRelativeAccounts = ({ memberProfile }: Props) => {
    const [create, setCreate] = useState(false)

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
            <div className="mb-2 flex items-start justify-between">
                <p>Relative Accounts</p>
                <Button size="sm" onClick={() => setCreate(true)}>
                    Add Relative Account <PlusIcon className="ml-1" />
                </Button>
            </div>
            <div className="space-y-4">
                {memberProfile.member_relative_accounts?.map((relative) => (
                    <MemberRelativeAccountCard
                        key={relative.id}
                        relative={relative}
                    />
                ))}
                {(!memberProfile.member_relative_accounts ||
                    memberProfile.member_relative_accounts.length === 0) && (
                    <EmptyListIndicator message="No relative accounts yet" />
                )}
            </div>
        </div>
    )
}

export default MemberRelativeAccounts
