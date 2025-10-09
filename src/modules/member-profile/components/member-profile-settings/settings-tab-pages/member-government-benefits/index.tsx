import { forwardRef, useState } from 'react'

import { toReadableDate } from '@/helpers/date-utils'
import {
    IMemberGovernmentBenefit,
    useDeleteMemberGovernmentBenefit,
} from '@/modules/member-government-benefit'
import { IMemberProfile } from '@/modules/member-profile'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    IdCardIcon,
    PencilFillIcon,
    PlusIcon,
    TrashIcon,
    WoodSignsIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextRenderer from '@/components/text-renderer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { MemberGovernmentBenefitCreateUpdateFormModal } from '../../../../../member-government-benefit/components/forms/member-government-benefits-create-update-form'
import EmptyListIndicator from '../empty-list-indicator'

const MemberGovernmentBenefitCard = ({
    benefit,
}: {
    benefit: IMemberGovernmentBenefit
}) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()
    const { mutate: deleteBenefit, isPending: isDeleting } =
        useDeleteMemberGovernmentBenefit()

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-background p-4">
            <MemberGovernmentBenefitCreateUpdateFormModal
                description="Modify / Update this government benefit information."
                formProps={{
                    benefitId: benefit.id,
                    memberProfileId: benefit.member_profile_id,
                    defaultValues: benefit,
                }}
                onOpenChange={setEdit}
                open={edit}
                title="Update Government Benefit"
            />
            <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                    <IdCardIcon className="inline size-6 text-muted-foreground/70" />
                    <p className="font-bold">{benefit.name}</p>
                </div>
                <div className="flex items-center justify-end">
                    <Button
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        disabled={isDeleting}
                        hoverVariant="destructive"
                        onClick={() => setEdit(true)}
                        size="icon"
                        variant="ghost"
                    >
                        <PencilFillIcon className="size-4" />
                    </Button>
                    <Button
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        disabled={isDeleting}
                        hoverVariant="destructive"
                        onClick={() =>
                            onOpen({
                                title: 'Delete Government Benefit',
                                description:
                                    'Are you sure to delete this government benefit?',
                                onConfirm: () =>
                                    deleteBenefit({
                                        memberProfileId:
                                            benefit.member_profile_id,
                                        benefitId: benefit.id,
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
                </div>
            </div>
            <Separator className="!my-2" />
            <div className="mb-4 flex gap-4">
                <div className="flex flex-1 flex-col items-center">
                    <PreviewMediaWrapper media={benefit.front_media}>
                        <ImageDisplay
                            className="h-[200px] w-full rounded-lg border object-cover ring ring-ring/40"
                            src={benefit.front_media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <span className="mt-1 text-xs text-muted-foreground/70">
                        Front
                    </span>
                </div>
                <div className="flex flex-1 flex-col items-center">
                    <PreviewMediaWrapper media={benefit.back_media}>
                        <ImageDisplay
                            className="h-[200px] w-full rounded-lg border object-cover ring ring-ring/40"
                            src={benefit.back_media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <span className="mt-1 text-xs text-muted-foreground/70">
                        Back
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-4 space-y-2 text-sm">
                <div className="space-y-1 font-semibold">
                    <p className="font-thin text-muted-foreground/70">
                        Country
                    </p>{' '}
                    <p>{benefit.country_code}</p>
                </div>
                <div className="space-y-1 font-semibold">
                    <p className="font-thin text-muted-foreground/70">
                        Value / ID No.
                    </p>{' '}
                    <p>{benefit.value}</p>
                </div>
                <div className="space-y-1 font-semibold">
                    <p className="font-thin text-muted-foreground/70">
                        Expiry.
                    </p>{' '}
                    <p>
                        {benefit.expiry_date
                            ? toReadableDate(benefit.expiry_date, 'MMMM-yyyy')
                            : '-'}
                    </p>
                </div>
                <div className="col-span-full space-y-2">
                    <p className="text-muted-foreground/70">Description</p>
                    {benefit?.description ? (
                        <TextRenderer
                            content={benefit.description ?? 'no description'}
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

interface Props {
    memberProfile: IMemberProfile
}

const MemberGovernmentBenefits = forwardRef<HTMLDivElement, Props>(
    ({ memberProfile }, ref) => {
        const [create, setCreate] = useState(false)

        return (
            <div ref={ref}>
                <MemberGovernmentBenefitCreateUpdateFormModal
                    description="Add new government benefit information."
                    formProps={{
                        memberProfileId: memberProfile.id,
                        defaultValues: {
                            member_profile_id: memberProfile.id,
                            branch_id: memberProfile.branch_id,
                            organization_id: memberProfile.organization_id,
                        },
                    }}
                    onOpenChange={setCreate}
                    open={create}
                    title="Create Government Benefit"
                />
                <div className="mb-2 flex items-start justify-between">
                    <p>Government Benefits</p>
                    <Button onClick={() => setCreate(true)} size="sm">
                        Add Benefit <PlusIcon className="ml-1" />
                    </Button>
                </div>
                <div className="space-y-4">
                    {memberProfile.member_government_benefits?.map(
                        (benefit) => (
                            <MemberGovernmentBenefitCard
                                benefit={benefit}
                                key={benefit.id}
                            />
                        )
                    )}
                    {(!memberProfile.member_government_benefits ||
                        memberProfile.member_government_benefits.length ===
                            0) && (
                        <EmptyListIndicator message="No government benefits yet" />
                    )}
                </div>
            </div>
        )
    }
)

MemberGovernmentBenefits.displayName = 'MemberFinancial'

export default MemberGovernmentBenefits
