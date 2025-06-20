import { useState } from 'react'

import {
    PlusIcon,
    NoteIcon,
    PhoneIcon,
    TrashIcon,
    PencilFillIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MemberContactCreateUpdateFormModal } from './member-contact-create-update-form'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberProfileContactReference } from '@/hooks/api-hooks/member/use-member-profile-settings'
import { IMemberProfile, IMemberContactReference } from '@/types'
import EmptyListIndicator from '../empty-list-indicator'

const MemberContactReferenceCard = ({
    reference,
    memberProfileId,
    onDeleted,
}: {
    reference: IMemberContactReference
    memberProfileId: string
    onDeleted?: () => void
}) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteContactReference, isPending: isDeleting } =
        useDeleteMemberProfileContactReference({ showMessage: true })

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-background p-4">
            <MemberContactCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Contact Reference"
                description="Modify / Update this contact reference information."
                formProps={{
                    memberProfileId,
                    defaultValues: reference,
                    contactReferenceId: reference.id,
                }}
            />
            <div className="flex justify-between">
                <div>
                    <p className="font-bold">{reference.name || '-'}</p>
                    <span className="text-xs text-muted-foreground/70">
                        Name
                    </span>
                </div>
                <fieldset
                    disabled={isDeleting}
                    className="flex items-center justify-end gap-1"
                >
                    <Button
                        size="icon"
                        variant="ghost"
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        onClick={() => setEdit(true)}
                    >
                        <PencilFillIcon className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        hoverVariant="destructive"
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        onClick={() =>
                            onOpen({
                                title: 'Delete Contact Reference',
                                description:
                                    'Are you sure to delete this contact reference?',
                                onConfirm: () =>
                                    deleteContactReference(
                                        {
                                            memberProfileId,
                                            contactReferenceId: reference.id,
                                        },
                                        {
                                            onSuccess: onDeleted,
                                        }
                                    ),
                            })
                        }
                    >
                        {isDeleting ? (
                            <span className="size-4 animate-spin">
                                <TrashIcon className="size-4" />
                            </span>
                        ) : (
                            <TrashIcon className="size-4" />
                        )}
                    </Button>
                </fieldset>
            </div>
            <Separator className="!my-2" />
            <div className="space-y-2">
                <div>
                    <PhoneIcon className="mr-2 inline size-5 text-muted-foreground" />
                    {reference.contact_number ? (
                        <span>{reference.contact_number}</span>
                    ) : (
                        <span className="italic text-muted-foreground/60">
                            No phone
                        </span>
                    )}
                    <span className="ml-2 text-xs text-muted-foreground/70">
                        Contact Number
                    </span>
                </div>
                <div>
                    <NoteIcon className="mr-2 inline size-5 text-muted-foreground" />
                    {reference.description ? (
                        <span>{reference.description}</span>
                    ) : (
                        <span className="italic text-muted-foreground/60">
                            No Description
                        </span>
                    )}
                    <span className="ml-2 text-xs text-muted-foreground/70">
                        Description
                    </span>
                </div>
            </div>
        </div>
    )
}

const MemberContactReferences = ({
    memberProfile,
}: {
    memberProfile: IMemberProfile
}) => {
    const [create, setCreate] = useState(false)
    const contactReferences = memberProfile.member_contact_references || []

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
                {contactReferences.length > 0 ? (
                    contactReferences.map((reference) => (
                        <MemberContactReferenceCard
                            key={reference.id}
                            reference={reference}
                            memberProfileId={memberProfile.id}
                        />
                    ))
                ) : (
                    <EmptyListIndicator message="No Contact References yet" />
                )}
            </div>
        </div>
    )
}

export default MemberContactReferences
