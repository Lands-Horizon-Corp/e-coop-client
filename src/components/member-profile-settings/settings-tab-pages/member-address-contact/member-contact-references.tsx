import { useState } from 'react'

import {
    PlusIcon,
    PhoneIcon,
    TrashIcon,
    PencilFillIcon,
    NoteIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MemberContactCreateUpdateFormModal } from './member-contact-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberProfileContactReference } from '@/hooks/api-hooks/member/use-member-profile-settings'

import { IMemberContactReference, IMemberProfile } from '@/types'
import EmptyListIndicator from '../empty-list-indicator'

const MemberContactReferenceCard = ({
    reference,
}: {
    reference: IMemberContactReference
}) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteContactReference, isPending: isDeleting } =
        useDeleteMemberProfileContactReference({ showMessage: true })

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border p-4">
            <MemberContactCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Contact Reference"
                description="Modify / Update this contact reference information."
                formProps={{
                    memberProfileId: reference.member_profile_id,
                    defaultValues: reference,
                }}
            />
            <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                    <p className="font-bold">{reference.name}</p>
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
                        hoverVariant="destructive"
                        disabled={isDeleting}
                        onClick={() =>
                            onOpen({
                                title: 'Delete Contact Reference',
                                description:
                                    'Are you sure to delete this contact reference?',
                                onConfirm: () =>
                                    deleteContactReference({
                                        memberProfileId:
                                            reference.member_profile_id,
                                        contactReferenceId: reference.id,
                                    }),
                            })
                        }
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                    >
                        {isDeleting ? (
                            <span className="size-4 animate-spin">
                                <TrashIcon className="size-4" />
                            </span>
                        ) : (
                            <TrashIcon className="size-4" />
                        )}
                    </Button>
                </div>
            </div>
            <Separator className="!my-2" />
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 gap-y-2 py-4 text-sm">
                    <div className="flex gap-x-4">
                        <span className="text-muted-foreground">
                            <PhoneIcon className="mr-2 inline text-muted-foreground" />
                            Phone :
                        </span>
                        <p>
                            {reference.contact_number || (
                                <span className="italic text-muted-foreground/60">
                                    No phone
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-x-4">
                        <span className="text-muted-foreground">
                            <NoteIcon className="mr-2 inline text-muted-foreground" />
                            Description :
                        </span>
                        <p>
                            {reference.description || (
                                <span className="italic text-muted-foreground/60">
                                    No Description
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface Props {
    memberProfile: IMemberProfile
}

const MemberContactReferences = ({ memberProfile }: Props) => {
    const [create, setCreate] = useState(false)

    return (
        <div>
            <MemberContactCreateUpdateFormModal
                open={create}
                onOpenChange={setCreate}
                title="Add Contact Reference"
                description="Add new contact reference information."
                formProps={{
                    memberProfileId: memberProfile.id,
                    defaultValues: { member_profile_id: memberProfile.id },
                }}
            />
            <div className="mb-2 flex items-start justify-between">
                <p>Contact References</p>
                <Button size="sm" onClick={() => setCreate(true)}>
                    Add Contact Reference <PlusIcon className="ml-1" />
                </Button>
            </div>
            <div className="space-y-4">
                {memberProfile.member_contact_number_references?.map(
                    (reference) => (
                        <MemberContactReferenceCard
                            key={reference.id}
                            reference={reference}
                        />
                    )
                )}
                {(!memberProfile.member_contact_number_references ||
                    memberProfile.member_contact_number_references) && (
                    <EmptyListIndicator message="Empty Contact Number References" />
                )}
            </div>
        </div>
    )
}

export default MemberContactReferences
