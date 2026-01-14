import { forwardRef } from 'react'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'

import CopyTextButton from '@/components/copy-text-button'
import {
    BarcodeScanIcon,
    BriefCaseIcon,
    BuildingBranchIcon,
    CalendarNumberIcon,
    EmailIcon,
    FileFillIcon,
    GendersIcon,
    GraduationCapIcon,
    LocationPinIcon,
    MapIcon,
    MapMarkedIcon,
    NavigationIcon,
    ParkIcon,
    PhoneIcon,
    PinLocationIcon,
    SignatureLightIcon,
    TextFileFillIcon,
    TreeCityIcon,
    Users3FillIcon,
    VillageIcon,
    WoodSignsIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MapView from '@/components/map'
import {
    constructGoogleMapsViewUrl,
    redirectToGoogleMapsDirection,
    redirectToGoogleMapsView,
} from '@/components/map/map.utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IBaseProps, TEntityId } from '@/types'

import { IMemberProfile } from '../..'
import { useGetMemberProfileById } from '../../member-profile.service'
import { InfoField } from './info-field'
import { SectionCard } from './section-card'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberPersonalInfo = forwardRef<HTMLDivElement, Props>(
    ({ profileId, className, defaultData }, ref) => {
        const { data: memberData } = useGetMemberProfileById({
            id: profileId,
            options: {
                initialData: defaultData,
            },
        })

        return (
            <div
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background ',
                    className
                )}
                ref={ref}
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-accent/70 p-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-label">
                            Profile Picture
                        </p>
                        <div className="flex justify-center">
                            <PreviewMediaWrapper media={memberData?.media}>
                                <ImageDisplay
                                    className="h-96 w-full rounded-md"
                                    fallbackClassName="h-96 w-full rounded-md"
                                    src={memberData?.media?.download_url}
                                />
                            </PreviewMediaWrapper>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-accent/70 p-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-label">
                            Signature
                        </p>
                        {memberData?.signature_media ? (
                            <PreviewMediaWrapper
                                media={memberData?.signature_media}
                            >
                                <ImageDisplay
                                    className="h-96 w-full rounded-md"
                                    fallbackClassName="h-96 w-full rounded-md"
                                    src={
                                        memberData?.signature_media
                                            ?.download_url
                                    }
                                />
                            </PreviewMediaWrapper>
                        ) : (
                            <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                                <div className="text-center text-muted-foreground">
                                    <SignatureLightIcon className="mx-auto mb-2 h-10 w-10" />
                                    <p className="text-sm">
                                        No signature uploaded
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoField
                            label="First Name"
                            value={memberData?.first_name}
                        />
                        <InfoField
                            label="Middle Name"
                            value={memberData?.middle_name}
                        />
                        <InfoField
                            label="Last Name"
                            value={memberData?.last_name}
                        />
                        <InfoField label="Suffix" value={memberData?.suffix} />

                        <InfoField
                            icon={<PhoneIcon className="size-4" />}
                            label="Contact Number"
                            value={memberData?.contact_number}
                        />
                        <InfoField
                            icon={<EmailIcon className="size-4" />}
                            label="Email"
                            value={memberData?.user?.email}
                        />
                        <InfoField
                            icon={<CalendarNumberIcon className="size-4" />}
                            label="Birthday"
                            value={
                                memberData?.birthdate
                                    ? toReadableDate(memberData?.birthdate)
                                    : undefined
                            }
                        />
                        <InfoField
                            icon={<GendersIcon className="size-4" />}
                            label="Gender"
                            value={memberData?.member_gender?.name}
                        />

                        <InfoField
                            label="Civil Status"
                            value={memberData?.civil_status}
                        />
                        <InfoField
                            icon={<BriefCaseIcon className="size-4" />}
                            label="Occupation"
                            value={memberData?.occupation}
                        />
                    </div>
                </div>

                <SectionCard
                    icon={<FileFillIcon className="h-5 w-5" />}
                    subtitle="Bio/Short description about member"
                    title="Description"
                >
                    <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-sm text-foreground">
                            {memberData?.description}
                        </p>
                    </div>
                </SectionCard>

                <SectionCard
                    icon={<PinLocationIcon className="h-5 w-5" />}
                    subtitle="Member address information"
                    title="Addresses"
                >
                    <div className="space-y-4">
                        {memberData?.member_addresses?.map((addr) => (
                            <div
                                className="rounded-lg relative border border-border"
                                key={addr.id}
                            >
                                {addr.id && addr.latitude && addr.longitude && (
                                    <div className="absolute top-0 right-0 z-0 w-[60%] ml-auto inset-0">
                                        <div className="relative size-full overflow-clip shrink-0">
                                            <MapView
                                                locations={[
                                                    {
                                                        title:
                                                            addr?.label || '',
                                                        lat: addr?.latitude,
                                                        lng: addr?.longitude,
                                                    },
                                                ]}
                                                viewOnly
                                            />
                                            <div className="absolute pointer-events-none inset-0 bg-gradient-to-l from-transparent to-card" />
                                        </div>
                                    </div>
                                )}
                                <div className="z-40 relative mr-[40%] col-span-4 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <Badge
                                            className="font-medium"
                                            variant="outline"
                                        >
                                            {addr.label}
                                        </Badge>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <InfoField
                                            icon={<VillageIcon />}
                                            label="Barangay"
                                            value={addr.barangay}
                                        />
                                        <InfoField
                                            icon={<TreeCityIcon />}
                                            label="City"
                                            value={addr.city}
                                        />
                                        <InfoField
                                            icon={<WoodSignsIcon />}
                                            label="Province/State"
                                            value={addr.province_state}
                                        />
                                        <InfoField
                                            icon={<BarcodeScanIcon />}
                                            label="Postal Code"
                                            value={addr.postal_code}
                                        />
                                        <InfoField
                                            icon={<MapIcon />}
                                            label="Country"
                                            value={addr.country_code}
                                        />
                                        {addr.landmark && (
                                            <InfoField
                                                icon={<ParkIcon />}
                                                label="Landmark"
                                                value={addr.landmark}
                                            />
                                        )}
                                        <InfoField
                                            className="col-span-full"
                                            icon={<LocationPinIcon />}
                                            label="Address"
                                            value={addr.address}
                                        />
                                    </div>
                                </div>
                                {addr.id && addr.latitude && addr.longitude && (
                                    <div className="p-2 absolute top-1 right-1 flex gap-x-2 bg-muted/80 hover:bg-muted/60  duration-200 backdrop-blur-md rounded-xl border border-border z-50">
                                        <CopyTextButton
                                            className="inline text-foreground text-xs px-2 py-1 bg-secondary rounded-md"
                                            iconClassName="size-3 text-foreground"
                                            textContent={constructGoogleMapsViewUrl(
                                                addr.latitude as number,
                                                addr.longitude as number
                                            )}
                                        >
                                            Share Direction
                                        </CopyTextButton>
                                        <Button
                                            className="w-fit cursor-pointer"
                                            onClick={() =>
                                                redirectToGoogleMapsView(
                                                    addr.latitude as number,
                                                    addr.longitude as number,
                                                    true
                                                )
                                            }
                                            size="xs"
                                            type="button"
                                            variant="secondary"
                                        >
                                            <MapMarkedIcon /> View in Maps
                                        </Button>
                                        <Button
                                            className="w-fit cursor-pointer"
                                            onClick={() =>
                                                redirectToGoogleMapsDirection(
                                                    addr.latitude as number,
                                                    addr.longitude as number,
                                                    true
                                                )
                                            }
                                            size="xs"
                                            type="button"
                                            variant="secondary"
                                        >
                                            <NavigationIcon /> Get Direction
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard
                    icon={<Users3FillIcon className="h-5 w-5" />}
                    subtitle="Emergency contacts and references"
                    title="Contact References"
                >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {memberData?.member_contact_references?.map((ref) => (
                            <div
                                className="rounded-lg border border-border bg-card p-4"
                                key={ref.id}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="font-medium text-foreground">
                                        {ref.name}
                                    </p>
                                    <Badge
                                        className="text-xs"
                                        variant="secondary"
                                    >
                                        {ref.description}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <PhoneIcon className="size-3.5" />
                                    <span>{ref.contact_number}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard
                    icon={<GraduationCapIcon className="h-5 w-5" />}
                    subtitle="Academic background and qualifications"
                    title="Educational Attainments"
                >
                    <div className="grid grid-cols-2 gap-4">
                        {memberData?.member_educational_attainments?.map(
                            (edu) => (
                                <div
                                    className="rounded-lg border border-border bg-card p-4"
                                    key={edu.id}
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="font-medium text-foreground">
                                            {edu.school_name}
                                        </p>
                                        <Badge
                                            className="font-medium"
                                            variant="outline"
                                        >
                                            {edu.educational_attainment}
                                        </Badge>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <InfoField
                                            label="Program/Course"
                                            value={edu.program_course}
                                        />
                                        <InfoField
                                            label="Year"
                                            value={edu.school_year?.toString()}
                                        />
                                        {edu.description && (
                                            <InfoField
                                                label="Description"
                                                value={edu.description}
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </SectionCard>

                <SectionCard
                    icon={<BuildingBranchIcon className="h-5 w-5" />}
                    subtitle="Business Information"
                    title="Business"
                >
                    <div className="grid gap-6 sm:grid-cols-3">
                        <InfoField
                            icon={<PhoneIcon className="size-4" />}
                            label="Business Contact"
                            value={memberData?.business_contact_number}
                        />
                        <InfoField
                            icon={<PinLocationIcon className="size-4" />}
                            label="Business Address"
                            value={memberData?.business_address}
                        />
                        <InfoField
                            icon={<CalendarNumberIcon className="size-4" />}
                            label="Updated At"
                            value={
                                memberData?.updated_at
                                    ? toReadableDate(memberData?.updated_at)
                                    : undefined
                            }
                        />
                    </div>
                </SectionCard>

                <SectionCard
                    icon={<TextFileFillIcon className="h-5 w-5" />}
                    subtitle="Notes about the member"
                    title="Notes"
                >
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-4">
                        <p className="text-sm text-foreground">
                            {memberData?.notes}
                        </p>
                    </div>
                </SectionCard>
            </div>
        )
    }
)

MemberPersonalInfo.displayName = 'MemberPersonalInfo'

export default MemberPersonalInfo
