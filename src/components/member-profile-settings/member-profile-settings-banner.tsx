import ImageDisplay from '../image-display'

import { cn } from '@/lib'

import { IClassProps, IMemberProfile } from '@/types'
import CopyTextButton from '../copy-text-button'
import { Skeleton } from '../ui/skeleton'

interface Props extends IClassProps {
    memberProfile: IMemberProfile
}

const MissingValue = ({ fullDescription }: { fullDescription?: string }) => {
    return (
        <span className="text-xs italic text-muted-foreground/40">
            {fullDescription ?? 'missing'}
        </span>
    )
}

const MemberProfileSettingsBanner = ({ className, memberProfile }: Props) => {
    return (
        <div className={cn('max-w-[280px] p-2 [&_*]:truncate', className)}>
            <div className="flex gap-x-2">
                <ImageDisplay
                    src={memberProfile.media?.download_url}
                    className="block size-20 rounded-lg"
                />
                <div>
                    <div className="space-y-2">
                        <p className="text-lg">
                            {memberProfile.full_name ?? <MissingValue />}
                        </p>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                <span className="opacity-40">PB No : </span>
                                {memberProfile.passbook ? (
                                    <>
                                        <CopyTextButton
                                            className="mr-1.5"
                                            successText="Passbook Copied"
                                            textContent={memberProfile.passbook}
                                        />
                                        {memberProfile.passbook}
                                    </>
                                ) : (
                                    <MissingValue />
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="opacity-40">
                                    Profile No :{' '}
                                </span>
                                {memberProfile.id ? (
                                    <>
                                        <CopyTextButton
                                            className="mr-1.5"
                                            successText="Profile ID Copied"
                                            textContent={memberProfile.passbook}
                                        />
                                        {memberProfile.id}
                                    </>
                                ) : (
                                    <MissingValue />
                                )}
                            </p>
                            {/* <p className="text-sm text-muted-foreground">
                                <span className="opacity-40">
                                    Member Type : {' '}
                                </span>
                                {memberProfile.member_type?.name ?? (
                                    <MissingValue />
                                )}
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const MemberProfileSettingsBannerSkeleton = () => {
    return (
        <div className="flex w-full gap-x-2">
            <Skeleton className="size-20" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
            </div>
        </div>
    )
}

export default MemberProfileSettingsBanner
