import { useState } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import {
    IMemberContactReference,
    useDeleteMemberProfileContactReference,
} from '@/modules/member-contact-reference'
import { MemberContactCreateUpdateFormModal } from '@/modules/member-contact-reference/components/forms/member-contact-create-update-form'
import { IMemberProfile } from '@/modules/member-profile'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    NoteIcon,
    PencilFillIcon,
    PhoneIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
        useDeleteMemberProfileContactReference({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted',
                }),
            },
        })

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-background p-4">
            <MemberContactCreateUpdateFormModal
                description="Modify / Update this contact reference information."
                formProps={{
                    memberProfileId,
                    defaultValues: reference,
                    contactReferenceId: reference.id,
                }}
                onOpenChange={setEdit}
                open={edit}
                title="Update Contact Reference"
            />
            <div className="flex justify-between">
                <div>
                    <p className="font-bold">{reference.name || '-'}</p>
                    <span className="text-xs text-muted-foreground/70">
                        Name
                    </span>
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
                        size="icon"
                        variant="ghost"
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
                description="Add new contact reference information."
                formProps={{
                    memberProfileId: memberProfile.id,
                    defaultValues: { member_profile_id: memberProfile.id },
                }}
                onOpenChange={setCreate}
                open={create}
                title="Add Contact Reference"
            />

            <div className="mb-2 flex items-start justify-between">
                <p>Contact References</p>
                <Button onClick={() => setCreate(true)} size="sm">
                    Add Contact Reference <PlusIcon className="ml-1" />
                </Button>
            </div>
            <div className="space-y-4">
                {contactReferences.length > 0 ? (
                    contactReferences.map((reference) => (
                        <MemberContactReferenceCard
                            key={reference.id}
                            memberProfileId={memberProfile.id}
                            reference={reference}
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
