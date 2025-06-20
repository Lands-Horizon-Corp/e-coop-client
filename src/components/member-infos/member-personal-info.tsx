import { forwardRef } from 'react'
import SectionTitle from './section-title'
import ImageDisplay from '../image-display'
import { Separator } from '../ui/separator'
import RawDescription from '../raw-description'
import AddressesDisplay from './displays/addresses-display'
import ContactNumbersDisplay from './displays/contact-numbers-display'
import { DetailsIcon, NoteIcon, StoreIcon, UserIcon } from '../icons'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

import { IBaseProps, IMemberProfile, TEntityId } from '@/types'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const MemberPersonalInfo = forwardRef<HTMLDivElement, Props>(
    ({ profileId, className, defaultData }, ref) => {
        const { data } = useMemberProfile({
            profileId,
            initialData: defaultData,
        })

        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <SectionTitle title="Personal Info" Icon={UserIcon} />

                <div className="grid grid-cols-2 gap-x-2">
                    <div className="w-full space-y-2">
                        <ImageDisplay
                            className="h-64 w-full rounded-xl"
                            src={data?.media?.download_url}
                        />
                        <p className="text-xs text-muted-foreground/70">
                            Picture
                        </p>
                    </div>
                    <div className="w-full space-y-2">
                        <ImageDisplay
                            className="h-64 w-full rounded-xl"
                            src={data?.signature_media?.download_url}
                        />
                        <p className="text-xs text-muted-foreground/70">
                            Signature
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                        <p>{data ? `${data.first_name}` : '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            First Name
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p>{data?.middle_name ?? '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Middle Name
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p>{data?.last_name ?? '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Last Name{' '}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p>{data?.suffix ?? '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Suffix
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p>{data?.contact_number ?? '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Contact Number
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p>{data?.member_gender?.name ?? 'no gender'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Gender
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p>{data?.civil_status ?? '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Civil Status
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p>{data?.member_occupation?.name ?? '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Occupation
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p>{data?.occupation ?? '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Occupation
                        </p>
                    </div>
                </div>

                <Separator />
                <div className="space-y-4">
                    <SectionTitle
                        Icon={DetailsIcon}
                        title="Description"
                        subTitle="Bio/Short description about member"
                    />
                    <RawDescription
                        className="rounded-xl bg-popover p-4"
                        content={data?.description ?? '-'}
                    />
                </div>

                <Separator />
                <AddressesDisplay addresses={data?.member_addresses} />

                <Separator />
                <ContactNumbersDisplay
                    contactNumbers={data?.member_contact_references}
                />

                <Separator />
                <SectionTitle
                    title="Business"
                    Icon={StoreIcon}
                    subTitle="Business Information"
                />
                <div className="grid grid-cols-5">
                    <div className="w-full space-y-2 text-sm">
                        <p>{data?.business_contact_number ?? '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Business Contact
                        </p>
                    </div>

                    <div className="col-span-3 w-full space-y-2 text-sm">
                        <p>{data?.business_address ?? '-'}</p>
                        <p className="text-xs text-muted-foreground/70">
                            Business Address
                        </p>
                    </div>

                    <div className="w-full space-y-2 text-sm">
                        <p>
                            {data?.created_at
                                ? toReadableDate(data?.created_at)
                                : '-'}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Updated At
                        </p>
                    </div>
                </div>

                <Separator />
                <SectionTitle
                    title="Notes"
                    Icon={NoteIcon}
                    subTitle="Notes About the member"
                />
                <RawDescription
                    className="rounded-xl bg-popover p-4"
                    content={data?.notes ?? '-'}
                />
            </div>
        )
    }
)

MemberPersonalInfo.displayName = 'MemberPersonalInfo'

export default MemberPersonalInfo
