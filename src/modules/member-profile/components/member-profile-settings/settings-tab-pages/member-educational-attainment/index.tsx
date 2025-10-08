import { forwardRef, useState } from 'react'

import { toast } from 'sonner'

import {
    IMemberEducationalAttainment,
    useDeleteEducationalAttainment,
} from '@/modules/member-educational-attainment'
import { MemberEducationalAttainmentCreateUpdateFormModal } from '@/modules/member-educational-attainment/components/forms/member-educational-attainment-create-update-form'
import { IMemberProfile } from '@/modules/member-profile'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    CalendarIcon,
    GraduationCapIcon,
    PencilFillIcon,
    PlusIcon,
    SchoolIcon,
    TrashIcon,
    WoodSignsIcon,
} from '@/components/icons'
import TextRenderer from '@/components/text-renderer'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'

import EmptyListIndicator from '../empty-list-indicator'

interface MemberEducationalAttainmentCard {
    educationalAttainment: IMemberEducationalAttainment
}

const MemberEducationalAttainmentCard = ({
    educationalAttainment,
}: MemberEducationalAttainmentCard) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteEducationalAttainment, isPending: isDeleting } =
        useDeleteEducationalAttainment({
            options: {
                onSettled: () =>
                    toast.success('Educational Attainment Deleted'),
            },
        })

    return (
        <div className="space-y-1 rounded-lg border bg-background">
            <MemberEducationalAttainmentCreateUpdateFormModal
                description="Modify / Update this educational attainment information."
                formProps={{
                    educationalAttainmentId: educationalAttainment.id,
                    memberProfileId: educationalAttainment.member_profile_id,
                    defaultValues: educationalAttainment,
                }}
                onOpenChange={setEdit}
                open={edit}
                title="Update Educational Attainment"
            />
            <div className="flex justify-between rounded-b-xl border-b bg-secondary/20 p-4">
                <div className="flex items-center gap-x-2">
                    <GraduationCapIcon className="inline size-6 text-muted-foreground" />
                    <p className="">{educationalAttainment.program_course}</p>
                </div>
                <div className="flex items-center justify-end">
                    <Button
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground"
                        disabled={isDeleting}
                        onClick={() => setEdit(true)}
                        size="icon"
                        variant="ghost"
                    >
                        <PencilFillIcon className="size-4" />
                    </Button>
                    <Button
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground"
                        disabled={isDeleting}
                        hoverVariant="destructive"
                        onClick={() =>
                            onOpen({
                                title: 'Delete Educational Attainment',
                                description:
                                    'Are you sure to delete this educational attainment?',
                                onConfirm: () =>
                                    deleteEducationalAttainment({
                                        memberProfileId:
                                            educationalAttainment.member_profile_id,
                                        educationalAttainmentId:
                                            educationalAttainment.id,
                                    }),
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
                </div>
            </div>
            <div className="space-y-4 px-4 pb-4 text-sm">
                <div className="grid grid-cols-2 gap-4 py-4">
                    <span className="text-muted-foreground">
                        <SchoolIcon className="mr-2 inline text-muted-foreground" />
                        School
                    </span>
                    <p>{educationalAttainment.school_name ?? '-'}</p>

                    <span className="text-muted-foreground">
                        <CalendarIcon className="mr-2 inline text-muted-foreground" />
                        Year
                    </span>
                    <p>{educationalAttainment.school_year ?? '-'}</p>

                    <span className="text-muted-foreground">
                        <GraduationCapIcon className="mr-2 inline text-muted-foreground" />
                        Educational Attainment
                    </span>
                    <p className="capitalize">
                        {educationalAttainment.educational_attainment ?? '-'}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-muted-foreground/70">Description</p>
                    {educationalAttainment?.description ? (
                        <TextRenderer
                            content={
                                educationalAttainment.description ??
                                'no description'
                            }
                        />
                    ) : (
                        <p className="text-sm italic text-muted-foreground/60">
                            No Description{' '}
                            <WoodSignsIcon className="ml-1 inline" />
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

interface Props extends IClassProps {
    memberProfile: IMemberProfile
}

const MemberEducationalAttainment = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        const [create, setCreate] = useState(false)

        return (
            <div ref={ref}>
                <MemberEducationalAttainmentCreateUpdateFormModal
                    formProps={{
                        memberProfileId: memberProfile.id,
                        defaultValues: {
                            member_profile_id: memberProfile.id,
                        },
                    }}
                    onOpenChange={setCreate}
                    open={create}
                />
                <div className="mb-2 flex items-start justify-between">
                    <p>Educational Attainments</p>
                    <Button onClick={() => setCreate(true)} size="sm">
                        Add Education <PlusIcon className="ml-1" />
                    </Button>
                </div>
                <div className="space-y-4">
                    {memberProfile.member_educational_attainments?.map(
                        (educationalAttainmentId) => (
                            <MemberEducationalAttainmentCard
                                educationalAttainment={educationalAttainmentId}
                                key={educationalAttainmentId.id}
                            />
                        )
                    )}
                    {(!memberProfile.member_educational_attainments ||
                        memberProfile.member_assets?.length) && (
                        <EmptyListIndicator message="Empty Educational Attainment" />
                    )}
                </div>
            </div>
        )
    }
)

MemberEducationalAttainment.displayName = 'MemberEducationalAttainment'

export default MemberEducationalAttainment
