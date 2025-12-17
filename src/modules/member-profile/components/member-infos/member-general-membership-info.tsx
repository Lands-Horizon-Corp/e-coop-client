import { forwardRef } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import GeneralStatusBadge from '@/modules/authentication/components/general-status-badge'
import { IMemberJointAccount } from '@/modules/member-joint-account'
import { IMemberRelativeAccount } from '@/modules/member-relative-account'

import CopyTextButton from '@/components/copy-text-button'
import {
    BadgeCheckFillIcon,
    BadgeQuestionFillIcon,
    BuildingBranchIcon,
    CalendarNumberIcon,
    EyeIcon,
    FileFillIcon,
    HandHeartIcon,
    LinkIcon,
    OpenExternalLinkIcon,
    PinLocationIcon,
    QrCodeIcon,
    TextFileFillIcon,
    UserFillIcon,
    UserIcon,
    Users3FillIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { OpenExternalMap } from '@/components/map'
import Modal from '@/components/modals/modal'
import { QrCodeDownloadable } from '@/components/qr-code'
import TextRenderer from '@/components/text-renderer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IBaseProps, TEntityId } from '@/types'

import { IMemberProfile } from '../..'
import { useGetMemberProfileById } from '../../member-profile.service'
import { InfoField } from './info-field'
import { MemberOverallInfoModal, SectionHeader } from './view-member-info'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberGeneralMembershipInfo = forwardRef<HTMLDivElement, Props>(
    ({ profileId, className, defaultData }, ref) => {
        const { data } = useGetMemberProfileById({
            id: profileId,
            options: { initialData: defaultData },
        })

        return (
            <div
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background',
                    className
                )}
                ref={ref}
            >
                <div className="overflow-clip border border-border rounded-xl">
                    <div className="bg-accent/60 p-4">
                        <div>
                            <p className="text-primary flex gap-x-2 items-center font-medium">
                                <UserFillIcon className="inline" /> Membership
                                Information
                            </p>
                        </div>
                        <div className="flex gap-x-4 items-center py-3">
                            <div className="flex items-end gap-x-2">
                                <PreviewMediaWrapper
                                    media={data?.branch?.media}
                                >
                                    <ImageDisplay
                                        className="size-12"
                                        fallbackClassName="size-12"
                                        src={
                                            data?.organization?.media
                                                ?.download_url
                                        }
                                    />
                                </PreviewMediaWrapper>
                                <div className="space-y-1 text-sm font-semibold">
                                    <p className="min-w-0 max-w-[220px] truncate">
                                        {data?.organization?.name ?? '-'}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        organization
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-end gap-x-2">
                                <PreviewMediaWrapper
                                    media={data?.branch?.media}
                                >
                                    <ImageDisplay
                                        className="size-12"
                                        fallbackClassName="size-12"
                                        src={data?.branch?.media?.download_url}
                                    />
                                </PreviewMediaWrapper>
                                <div className="space-y-1 text-sm font-semibold">
                                    <p className="min-w-0 max-w-[220px] truncate">
                                        {data?.branch?.name ?? '-'}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Branch
                                    </p>
                                </div>
                            </div>
                            <div className="flex ml-auto max-w-[300px] items-start gap-x-2">
                                <PinLocationIcon className="size-5" />
                                <div className="flex-1 flex-col flex justify-end">
                                    <p className="text-sm">
                                        {data?.branch?.name
                                            ? `${data?.branch?.name}`
                                            : '-'}
                                    </p>
                                    {data?.branch?.latitude &&
                                        data?.branch?.longitude && (
                                            <OpenExternalMap
                                                className="text-xs text-muted-foreground/40 duration-300 ease-out hover:text-muted-foreground hover:underline"
                                                lat={data?.branch?.latitude}
                                                lon={data?.branch?.longitude}
                                            >
                                                Open Branch Location on Google
                                                Map
                                                <OpenExternalLinkIcon className="ml-1 inline" />
                                            </OpenExternalMap>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 px-6 bg-popover space-y-4">
                        <div className="flex items-end gap-x-4 py-4">
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                    Member Profile ID
                                </p>
                                <p className="text-sm">
                                    {data?.id ? (
                                        <span className="px-1.5 py-1 rounded-md bg-accent/40 text-accent-foreground">
                                            {data?.id}
                                        </span>
                                    ) : (
                                        ''
                                    )}{' '}
                                    {data?.id && (
                                        <CopyTextButton
                                            className="ml-2"
                                            successText="Profile ID coppied"
                                            textContent={data.id}
                                        />
                                    )}
                                </p>
                            </div>
                            <div className="flex text-sm max-w-full items-end gap-x-2">
                                {data?.member_verified_by_employee_user ? (
                                    <p className="text-primary flex items-center gap-x-2">
                                        <BadgeCheckFillIcon className="inline" />{' '}
                                        Verified By Employee
                                    </p>
                                ) : (
                                    <p className="text-warning-foreground flex items-center gap-x-2">
                                        <BadgeQuestionFillIcon /> Not yet
                                        verified
                                    </p>
                                )}
                            </div>
                            <div className="ml-auto">
                                <UserQr memberProfile={data} />
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <InfoField
                                label="First Name"
                                value={data?.first_name}
                            />
                            <InfoField
                                label="Middle Name"
                                value={data?.middle_name}
                            />
                            <InfoField
                                label="Last Name"
                                value={data?.last_name}
                            />
                            <InfoField label="Suffix" value={data?.suffix} />
                            <InfoField
                                label="Passbook Number"
                                value={data?.passbook}
                            />
                            <InfoField
                                label="Member Type"
                                value={data?.member_type?.name}
                            />
                            <InfoField
                                label="Status"
                                value={
                                    <GeneralStatusBadge
                                        generalStatus={
                                            data?.status || 'pending'
                                        }
                                    />
                                }
                            />
                            <InfoField
                                label="Membership Type"
                                value={data?.member_type?.name}
                            />
                            <InfoField
                                label="Membership Classification"
                                value={data?.member_classification?.name}
                            />
                            <InfoField
                                label="Membership Center"
                                value={data?.member_center?.name}
                            />
                            <InfoField
                                label="Member Department"
                                value={data?.member_department?.name}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {data?.is_mutual_fund_member && (
                                <div className="flex bg-primary/10 relative border-primary/20 items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-sm">
                                    <BadgeCheckFillIcon className="size-4 text-primary absolute top-2 right-2" />
                                    <div className="p-2 rounded-full bg-card text-primary">
                                        <HandHeartIcon className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-foreground">
                                            Mutual Fund Member
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Contributes to a pooled
                                            contributions such as
                                            Damayan/Compassion
                                        </p>
                                    </div>
                                </div>
                            )}
                            {data?.is_micro_finance_member && (
                                <div className="flex bg-sky-500/10 border-sky-200 relative dark:border-sky-800 items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-sm">
                                    <BadgeCheckFillIcon className="size-4 text-primary absolute top-2 right-2" />
                                    <div className="p-2 rounded-full bg-card text-sky-400">
                                        <BuildingBranchIcon className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-foreground">
                                            Mutual Fund Member
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Participates in small-scale
                                            financial services.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border border-border bg-popover rounded-xl p-4">
                    <SectionHeader
                        icon={TextFileFillIcon}
                        subtitle="Bio/Short description about member"
                        title="Description"
                    />
                    <TextRenderer
                        className="rounded-md bg-background/20 p-4"
                        content={data?.description ?? '-'}
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <JointAccounts
                        jointAccounts={data?.member_joint_accounts}
                    />
                    <RelativeAccounts
                        relativeAccounts={data?.member_relative_accounts}
                    />
                    <MemberRecruits recruits={data?.recruited_members} />
                </div>
            </div>
        )
    }
)

const MemberRecruits = ({ recruits = [] }: { recruits?: IMemberProfile[] }) => {
    return (
        <div className="rounded-xl bg-popover border border-border">
            <CardContent className="pt-6">
                <SectionHeader
                    icon={Users3FillIcon}
                    subtitle="Recruited members of this member"
                    title="Recruited Members"
                />
                <div className="space-y-3">
                    {recruits.map((recruits, index) => (
                        <MemberRecruitsItem key={index} recruit={recruits} />
                    ))}
                </div>
            </CardContent>
        </div>
    )
}

const MemberRecruitsItem = ({ recruit }: { recruit: IMemberProfile }) => {
    const modalState = useModalState()
    const memberInfoModalState = useModalState()

    return (
        <>
            <div
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/80 transition-colors cursor-pointer"
                onClick={() => modalState.onOpenChange(true)}
            >
                <PreviewMediaWrapper media={recruit?.media}>
                    <ImageDisplay
                        className="size-12"
                        fallbackClassName="size-12"
                        src={recruit?.media?.download_url}
                    />
                </PreviewMediaWrapper>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                        {recruit?.full_name || '-'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Joined:{' '}
                        {recruit.created_at
                            ? `${toReadableDate(recruit.created_at)} - ${dateAgo(recruit.created_at)}`
                            : '-'}
                    </p>
                </div>
                <GeneralStatusBadge
                    generalStatus={recruit?.status || 'pending'}
                />
            </div>

            <Modal
                {...modalState}
                className="bg-popover"
                closeButtonClassName="top-1 right-1"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                        <PreviewMediaWrapper media={recruit?.media}>
                            <ImageDisplay
                                className="size-16"
                                fallbackClassName="size-16"
                                src={recruit?.media?.download_url}
                            />
                        </PreviewMediaWrapper>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground">
                                {recruit.full_name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Passbook: {recruit.passbook || '-'}
                            </p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <DetailRow
                            icon={FileFillIcon}
                            label="Description"
                            value={recruit.description || '—'}
                        />
                    </div>
                    <MemberOverallInfoModal
                        {...memberInfoModalState}
                        overallInfoProps={{ memberProfileId: recruit.id }}
                    />
                    <Button
                        onClick={() => memberInfoModalState.onOpenChange(true)}
                    >
                        <EyeIcon className="inline mr-1" /> See Full
                    </Button>
                </div>
            </Modal>
        </>
    )
}

const RelativeAccounts = ({
    relativeAccounts = [],
}: {
    relativeAccounts?: IMemberRelativeAccount[]
}) => {
    return (
        <div className="rounded-xl bg-popover border border-border">
            <CardContent className="pt-6">
                <SectionHeader
                    icon={Users3FillIcon}
                    subtitle="Registered relative accounts for reference"
                    title="Relative Accounts"
                />
                <div className="space-y-3">
                    {relativeAccounts.map((relative, index) => (
                        <RelativeAccountItem key={index} relative={relative} />
                    ))}
                </div>
            </CardContent>
        </div>
    )
}

const RelativeAccountItem = ({
    relative,
}: {
    relative: IMemberRelativeAccount
}) => {
    const modalState = useModalState()

    return (
        <>
            <div
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/80 transition-colors cursor-pointer"
                onClick={() => modalState.onOpenChange(true)}
            >
                <PreviewMediaWrapper
                    media={relative?.relative_member_profile.media}
                >
                    <ImageDisplay
                        className="size-12"
                        fallbackClassName="size-12"
                        src={
                            relative?.relative_member_profile.media
                                ?.download_url
                        }
                    />
                </PreviewMediaWrapper>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                        {relative.relative_member_profile.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {relative.family_relationship} • Member ID:{' '}
                        {relative.relative_member_profile.id}
                    </p>
                </div>
            </div>

            <Modal
                {...modalState}
                className="bg-popover"
                closeButtonClassName="top-1 right-1"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                        <PreviewMediaWrapper
                            media={relative?.relative_member_profile.media}
                        >
                            <ImageDisplay
                                className="size-16"
                                fallbackClassName="size-16"
                                src={
                                    relative?.relative_member_profile.media
                                        ?.download_url
                                }
                            />
                        </PreviewMediaWrapper>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground">
                                {relative.relative_member_profile.full_name}
                            </h3>
                            <Badge className="mt-1" variant="outline">
                                {relative.family_relationship}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <DetailRow
                            icon={Users3FillIcon}
                            label="Relationship"
                            value={relative.family_relationship}
                        />
                        <DetailRow
                            icon={UserFillIcon}
                            label="Member ID"
                            value={relative.relative_member_profile.id}
                        />
                        <DetailRow
                            icon={UserFillIcon}
                            label="Passbook"
                            value={
                                relative.relative_member_profile.passbook || '-'
                            }
                        />
                        <DetailRow
                            icon={FileFillIcon}
                            label="Description"
                            value={relative.description || '—'}
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}

const JointAccounts = ({
    jointAccounts = [],
}: {
    jointAccounts?: IMemberJointAccount[]
}) => {
    return (
        <div className="rounded-xl bg-popover border border-border">
            <CardContent className="pt-6">
                <SectionHeader
                    icon={LinkIcon}
                    subtitle="Co-owners with access and shared responsibility"
                    title="Joint Accounts"
                />
                <div className="space-y-3">
                    {jointAccounts.map((joint, index) => (
                        <JointAccountItem joint={joint} key={index} />
                    ))}
                </div>
            </CardContent>
        </div>
    )
}

const JointAccountItem = ({ joint }: { joint: IMemberJointAccount }) => {
    const modalState = useModalState()

    return (
        <>
            <div
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/80 transition-colors cursor-pointer"
                // key={index}
                onClick={() => modalState.onOpenChange(true)}
            >
                <PreviewMediaWrapper media={joint?.picture_media}>
                    <ImageDisplay
                        className="size-12"
                        fallbackClassName="size-12"
                        src={joint?.picture_media?.download_url}
                    />
                </PreviewMediaWrapper>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                        {joint.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {joint.family_relationship}
                    </p>
                </div>
            </div>

            <Modal
                {...modalState}
                className="bg-popover"
                closeButtonClassName="top-1 right-1"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                        <PreviewMediaWrapper media={joint?.picture_media}>
                            <ImageDisplay
                                className="size-16"
                                fallbackClassName="size-16"
                                src={joint?.picture_media?.download_url}
                            />
                        </PreviewMediaWrapper>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground">
                                {joint.full_name}
                            </h3>
                            <Badge className="mt-1" variant="outline">
                                {joint.family_relationship}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <DetailRow
                            icon={UserIcon}
                            label="First Name"
                            value={joint.first_name || '—'}
                        />
                        <DetailRow
                            icon={UserIcon}
                            label="Middle Name"
                            value={joint.middle_name || '—'}
                        />
                        <DetailRow
                            icon={UserIcon}
                            label="Last Name"
                            value={joint.last_name || '—'}
                        />
                        <DetailRow
                            icon={UserIcon}
                            label="Suffix"
                            value={joint.suffix || '—'}
                        />
                        <DetailRow
                            icon={CalendarNumberIcon}
                            label="Birthday"
                            value={joint.birthday || '—'}
                        />
                        <DetailRow
                            icon={Users3FillIcon}
                            label="Relationship"
                            value={joint.family_relationship}
                        />
                        <DetailRow
                            icon={TextFileFillIcon}
                            label="Description"
                            value={joint.description || '—'}
                        />
                    </div>

                    <p>Signature</p>
                    <PreviewMediaWrapper media={joint?.signature_media}>
                        <ImageDisplay
                            className="w-full h-[200px] !rounded-md"
                            fallbackClassName="!rounded-md"
                            src={joint?.signature_media?.download_url}
                        />
                    </PreviewMediaWrapper>
                </div>
            </Modal>
        </>
    )
}

const DetailRow = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
}) => (
    <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm text-foreground">{value}</p>
        </div>
    </div>
)

const UserQr = ({ memberProfile }: { memberProfile?: IMemberProfile }) => {
    const modalState = useModalState()

    const qrValue = memberProfile?.qr_code

    return (
        <>
            <div className="flex items-center gap-x-2">
                <div className="rounded border border-border p-0.5">
                    <QrCodeIcon className="size-8" />
                </div>
                <Button
                    onClick={() => {
                        if (!qrValue)
                            return toast.warning('QR Code has no Value')
                        modalState.onOpenChange((val) => !val)
                    }}
                    variant="secondary"
                >
                    See/Download Member QR
                </Button>
            </div>
            <Modal
                className="p-4 pb-8"
                description="QR of member for easy processing/trasaction."
                {...modalState}
                title="Profile QR"
            >
                <QrCodeDownloadable
                    className="size-80 p-3"
                    containerClassName="mx-auto"
                    fileName={`member_profile_${memberProfile?.first_name}_${memberProfile?.last_name}_${memberProfile?.passbook}`}
                    value={memberProfile?.qr_code?.data as string}
                />
            </Modal>
        </>
    )
}

MemberGeneralMembershipInfo.displayName = 'MemberGeneralMembershipInfo'

export default MemberGeneralMembershipInfo
