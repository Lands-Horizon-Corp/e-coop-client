import { useState } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { toReadableDate } from '@/helpers/date-utils'
import {
    IMemberJointAccount,
    useDeleteMemberJointAccount,
} from '@/modules/member-joint-account'
import { MemberJointAccountCreateUpdateFormModal } from '@/modules/member-joint-account/components/forms/member-joint-account-create-update-form'
import { IMemberProfile } from '@/modules/member-profile'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    CalendarIcon,
    PencilFillIcon,
    PlusIcon,
    TrashIcon,
    Users3Icon,
    WoodSignsIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextRenderer from '@/components/text-renderer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import EmptyListIndicator from '../empty-list-indicator'

const MemberJointAccountCard = ({ joint }: { joint: IMemberJointAccount }) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteJoint, isPending: isDeleting } =
        useDeleteMemberJointAccount({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted',
                    textError: 'Failed to delete',
                }),
            },
        })

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-background p-4">
            <MemberJointAccountCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Joint Account"
                description="Modify / Update this joint account information."
                formProps={{
                    jointAccountId: joint.id,
                    memberProfileId: joint.member_profile_id,
                    defaultValues: joint,
                }}
            />
            <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                    <Users3Icon className="inline size-6 text-muted-foreground" />
                    <p className="font-bold">{joint.full_name}</p>
                </div>
                <div className="flex items-center justify-end">
                    <Button
                        size="icon"
                        variant="ghost"
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
            <div className="mb-4 grid grid-cols-4 gap-4">
                <div className="col-span-full flex flex-1 flex-col items-center sm:col-span-2">
                    <PreviewMediaWrapper media={joint.picture_media}>
                        <ImageDisplay
                            src={joint.picture_media?.download_url}
                            className="h-[200px] w-full rounded-lg border object-cover ring ring-ring/40"
                        />
                    </PreviewMediaWrapper>
                    <span className="mt-1 text-xs text-muted-foreground/70">
                        Picture
                    </span>
                </div>
                <div className="col-span-full flex flex-1 flex-col items-center sm:col-span-2">
                    <PreviewMediaWrapper media={joint.signature_media}>
                        <ImageDisplay
                            src={joint.signature_media?.download_url}
                            className="h-[200px] w-full rounded-lg border object-cover ring ring-ring/40"
                        />
                    </PreviewMediaWrapper>
                    <span className="mt-1 text-xs text-muted-foreground/70">
                        Signature
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-4 space-y-2 text-sm">
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">First Name</p>
                    <p>{joint.first_name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Middle Name</p>
                    <p>
                        {joint.middle_name || (
                            <span className="italic text-muted-foreground/60">
                                -
                            </span>
                        )}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Last Name</p>
                    <p>{joint.last_name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Suffix</p>
                    <p>
                        {joint.suffix || (
                            <span className="italic text-muted-foreground/60">
                                -
                            </span>
                        )}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Birthday</p>
                    <p>
                        <CalendarIcon className="mr-1 hidden size-4 text-muted-foreground/60 2xl:inline" />
                        {joint.birthday ? toReadableDate(joint.birthday) : '-'}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground/70">Relationship</p>
                    <p>{joint.family_relationship}</p>
                </div>
            </div>
            <div className="col-span-full !mt-4 space-y-2">
                <p className="text-muted-foreground/70">Description</p>
                {joint?.description ? (
                    <TextRenderer
                        content={joint.description ?? 'no description'}
                    />
                ) : (
                    <p className="text-sm italic text-muted-foreground/60">
                        No Description <WoodSignsIcon className="ml-1 inline" />
                    </p>
                )}
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
            <div className="grid gap-4 sm:grid-cols-2">
                {memberProfile.member_joint_accounts?.map((joint) => (
                    <MemberJointAccountCard key={joint.id} joint={joint} />
                ))}
                {(!memberProfile.member_joint_accounts ||
                    memberProfile.member_joint_accounts.length === 0) && (
                    <EmptyListIndicator
                        className="col-span-3"
                        message="This account has no joint accounts."
                    />
                )}
            </div>
        </div>
    )
}

export default MemberJointAccounts
