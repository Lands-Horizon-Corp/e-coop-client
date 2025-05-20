import { useState } from 'react'

import {
    PlusIcon,
    NoteIcon,
    PhoneIcon,
    TrashIcon,
    PencilFillIcon,
} from '@/components/icons'
import { Table, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MemberContactCreateUpdateFormModal } from './member-contact-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteMemberProfileContactReference } from '@/hooks/api-hooks/member/use-member-profile-settings'

import { IMemberProfile } from '@/types'

const MemberContactReferences = ({
    memberProfile,
}: {
    memberProfile: IMemberProfile
}) => {
    const [create, setCreate] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteContactReference, isPending: isDeleting } =
        useDeleteMemberProfileContactReference({ showMessage: true })
    const [editId, setEditId] = useState<string | null>(null)

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
            {editId && (
                <MemberContactCreateUpdateFormModal
                    open={!!editId}
                    onOpenChange={() => setEditId(null)}
                    title="Update Contact Reference"
                    description="Modify / Update this contact reference information."
                    formProps={{
                        memberProfileId: memberProfile.id,
                        defaultValues:
                            memberProfile.member_contact_number_references?.find(
                                (r) => r.id === editId
                            ) || {},
                    }}
                />
            )}
            <div className="mb-2 flex items-start justify-between">
                <p>Contact References</p>
                <Button size="sm" onClick={() => setCreate(true)}>
                    Add Contact Reference <PlusIcon className="ml-1" />
                </Button>
            </div>
            <div className="rounded-xl border bg-background">
                <Table>
                    <TableBody>
                        {memberProfile.member_contact_number_references &&
                        memberProfile.member_contact_number_references.length >
                            0 ? (
                            memberProfile.member_contact_number_references.map(
                                (reference) => (
                                    <TableRow key={reference.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">
                                                    {reference.name || '-'}
                                                </span>
                                                <span className="text-xs text-muted-foreground/70">
                                                    Name
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="flex items-center gap-1 font-semibold">
                                                    <PhoneIcon className="inline size-4 text-muted-foreground" />
                                                    {reference.contact_number || (
                                                        <span className="italic text-muted-foreground/60">
                                                            No phone
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-xs text-muted-foreground/70">
                                                    Contact Number
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="flex items-center gap-1 font-semibold">
                                                    <NoteIcon className="inline size-4 text-muted-foreground" />
                                                    {reference.description || (
                                                        <span className="italic text-muted-foreground/60">
                                                            No Description
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-xs text-muted-foreground/70">
                                                    Description
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
                                                        setEditId(reference.id)
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
                                                            title: 'Delete Contact Reference',
                                                            description:
                                                                'Are you sure to delete this contact reference?',
                                                            onConfirm: () =>
                                                                deleteContactReference(
                                                                    {
                                                                        memberProfileId:
                                                                            reference.member_profile_id,
                                                                        contactReferenceId:
                                                                            reference.id,
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
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <div className="py-6 text-center text-muted-foreground">
                                        Empty Contact Number References
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

export default MemberContactReferences
