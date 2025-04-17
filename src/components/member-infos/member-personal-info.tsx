import SectionTitle from './section-title'
import ImageDisplay from '../image-display'
import { Separator } from '../ui/separator'
import RawDescription from './displays/raw-description'
import AddressesDisplay from './displays/addresses-display'
import ContactNumbersDisplay from './displays/contact-numbers-display'
import { DetailsIcon, NoteIcon, StoreIcon, UserIcon } from '../icons'

import { cn } from '@/lib'
import { IBaseProps } from '@/types'
import { toReadableDate } from '@/utils'
import { IMemberProfileResource, TEntityId } from '@/server'
import { useMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfileResource
}

const MemberPersonalInfo = ({ profileId, className, defaultData }: Props) => {
    const { data } = useMemberProfile({
        profileId,
        initialData: defaultData,
    })

    return (
        <div
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
                        src={data?.media?.downloadURL}
                    />
                    <p className="text-xs text-muted-foreground/70">Picture</p>
                </div>
                <div className="w-full space-y-2">
                    <ImageDisplay
                        className="h-64 w-full rounded-xl"
                        src={data?.signatureMedia?.downloadURL}
                    />
                    <p className="text-xs text-muted-foreground/70">
                        Signature
                    </p>
                </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                    <p>{data ? `${data.firstName}` : '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        First Name
                    </p>
                </div>

                <div className="space-y-2">
                    <p>{data?.middleName ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        Middle Name
                    </p>
                </div>

                <div className="space-y-2">
                    <p>{data?.lastName ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        Last Name{' '}
                    </p>
                </div>

                <div className="space-y-2">
                    <p>{data?.suffix ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">Suffix</p>
                </div>

                <div className="space-y-2">
                    <p>{data?.contactNumber ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        Contact Number
                    </p>
                </div>

                <div className="space-y-2">
                    <p>{data?.memberGender?.name ?? 'no gender'}</p>
                    <p className="text-xs text-muted-foreground/70">Gender</p>
                </div>

                <div className="space-y-2">
                    <p>{data?.civilStatus ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        Civil Status
                    </p>
                </div>

                <div className="space-y-2">
                    <p>{data?.memberEducationalAttainment?.name ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        Educational Attainment
                    </p>
                </div>

                <div className="space-y-2">
                    <p>{data?.occupation?.name ?? '-'}</p>
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
            <AddressesDisplay addresses={data?.memberAddresses} />

            <Separator />
            <ContactNumbersDisplay
                contactNumbers={data?.memberContactNumberReferences}
            />

            <Separator />
            <SectionTitle
                title="Business"
                Icon={StoreIcon}
                subTitle="Business Information"
            />
            <div className="grid grid-cols-5">
                <div className="w-full space-y-2">
                    <p>{data?.businessContact ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        Business Contact
                    </p>
                </div>

                <div className="col-span-3 w-full space-y-2">
                    <p>{data?.businessAddress ?? '-'}</p>
                    <p className="text-xs text-muted-foreground/70">
                        Business Address
                    </p>
                </div>

                <div className="w-full space-y-2">
                    <p>
                        {data?.updatedAt
                            ? toReadableDate(data?.updatedAt)
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

export default MemberPersonalInfo
