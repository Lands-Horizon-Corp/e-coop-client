import { useState } from 'react'

import {
    PlusIcon,
    TrashIcon,
    Users3Icon,
    PencilFillIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import EmptyListIndicator from '../empty-list-indicator'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { MemberJointAccountCreateUpdateFormModal } from './member-joint-account-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberJointAccount } from '@/hooks/api-hooks/member/use-member-profile-settings'

import { IMemberJointAccount, IMemberProfile } from '@/types'

const MemberJointAccountCard = ({ joint }: { joint: IMemberJointAccount }) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteJoint, isPending: isDeleting } =
        useDeleteMemberJointAccount()

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border p-4">
            <MemberJointAccountCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Joint Account"
                description="Modify / Update this joint account information."
                formProps={{
                    memberProfileId: joint.member_profile_id,
                    defaultValues: joint,
                }}
            />
            <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                    <Users3Icon className="inline size-6 text-muted-foreground" />
                    <p className="font-bold">
                        {joint.first_name} {joint.last_name}
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
                                title: 'Delete Joint Account',
                                description:
                                    'Are you sure to delete this joint account?',
                                onConfirm: () =>
                                    deleteJoint({
                                        memberProfileId:
                                            joint.member_profile_id,
                                        jointAccountId: joint.id,
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
                    <span className="font-semibold">Birthday:</span>{' '}
                    {joint.birthday}
                </div>
                <div>
                    <span className="font-semibold">Relationship:</span>{' '}
                    {joint.family_relationship}
                </div>
                <div>
                    <span className="font-semibold">Description:</span>{' '}
                    {joint.description}
                </div>
            </div>
        </div>
    )
}

interface Props {
    memberProfile: IMemberProfile
}

const MemberJointAccounts = ({ memberProfile }: Props) => {
    const [create, setCreate] = useState(false)

    return (
        <div>
            <MemberJointAccountCreateUpdateFormModal
                open={create}
                onOpenChange={setCreate}
                title="Create Joint Account"
                description="Add new joint account information."
                formProps={{
                    memberProfileId: memberProfile.id,
                    defaultValues: {
                        member_profile_id: memberProfile.id,
                    },
                }}
            />
            <div className="mb-2 flex items-start justify-between">
                <p>Joint Accounts</p>
                <Button size="sm" onClick={() => setCreate(true)}>
                    Add Joint Account <PlusIcon className="ml-1" />
                </Button>
            </div>
            <div className="space-y-4">
                {memberProfile.member_joint_accounts?.map((joint) => (
                    <MemberJointAccountCard key={joint.id} joint={joint} />
                ))}
                {(!memberProfile.member_joint_accounts ||
                    memberProfile.member_joint_accounts.length === 0) && (
                    <EmptyListIndicator message="This account has no joint accounts." />
                )}
            </div>
        </div>
    )
}

export default MemberJointAccounts
