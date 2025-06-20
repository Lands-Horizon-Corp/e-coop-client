import { forwardRef, useState } from 'react'

import {
    PlusIcon,
    TrashIcon,
    SchoolIcon,
    CalendarIcon,
    WoodSignsIcon,
    PencilFillIcon,
    GraduationCapIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import RawDescription from '@/components/raw-description'
import { MemberEducationalAttainmentCreateUpdateFormModal } from './member-educational-attainment-create-update-form'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteEducationalAttainment } from '@/hooks/api-hooks/member/use-member-profile-settings'

import {
    IClassProps,
    IMemberProfile,
    IMemberEducationalAttainment,
} from '@/types'
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
        useDeleteEducationalAttainment({ showMessage: true })

    return (
        <div className="space-y-1 rounded-lg border bg-background">
            <MemberEducationalAttainmentCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Educational Attainment"
                description="Modify / Update this educational attainment information."
                formProps={{
                    educationalAttainmentId: educationalAttainment.id,
                    memberProfileId: educationalAttainment.member_profile_id,
                    defaultValues: educationalAttainment,
                }}
            />
            <div className="flex justify-between rounded-b-xl border-b bg-secondary/20 p-4">
                <div className="flex items-center gap-x-2">
                    <GraduationCapIcon className="inline size-6 text-muted-foreground" />
                    <p className="">{educationalAttainment.program_course}</p>
                </div>
                <div className="flex items-center justify-end">
                    <Button
                        onClick={() => setEdit(true)}
                        variant="ghost"
                        size="icon"
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground"
                        disabled={isDeleting}
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
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground"
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
                        <RawDescription
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
                    open={create}
                    onOpenChange={setCreate}
                    formProps={{
                        memberProfileId: memberProfile.id,
                        defaultValues: {
                            member_profile_id: memberProfile.id,
                        },
                    }}
                />
                <div className="mb-2 flex items-start justify-between">
                    <p>Educational Attainments</p>
                    <Button size="sm" onClick={() => setCreate(true)}>
                        Add Education <PlusIcon className="ml-1" />
                    </Button>
                </div>
                <div className="space-y-4">
                    {memberProfile.member_educational_attainments?.map(
                        (educationalAttainmentId) => (
                            <MemberEducationalAttainmentCard
                                key={educationalAttainmentId.id}
                                educationalAttainment={educationalAttainmentId}
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
