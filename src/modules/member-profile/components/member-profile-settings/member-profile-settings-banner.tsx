import { cn } from '@/helpers'

import {
    CheckIcon,
    ClockIcon,
    IdCardIcon,
    PhoneIcon,
    UserIcon,
    XIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import CopyWrapper from '@/components/wrappers/copy-wrapper'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IClassProps } from '@/types'

import { IMemberProfile } from '../..'

interface Props extends IClassProps {
    memberProfile: IMemberProfile
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'pending':
            return {
                label: 'Pending',
                variant: 'outline' as const,
                className:
                    'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/20',
                icon: <ClockIcon className="h-3 w-3" />,
            }
        case 'for review':
            return {
                label: 'For Review',
                variant: 'outline' as const,
                className:
                    'border-blue-500/20 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20',
                icon: <ClockIcon className="h-3 w-3" />,
            }
        case 'verified':
            return {
                label: 'Verified',
                variant: 'default' as const,
                className:
                    'border-green-500/20 bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400 dark:bg-green-500/10 dark:hover:bg-green-500/20',
                icon: <CheckIcon className="h-3 w-3" />,
            }
        case 'not allowed':
            return {
                label: 'Not Allowed',
                variant: 'destructive' as const,
                className:
                    'border-red-500/20 bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-400 dark:bg-red-500/10 dark:hover:bg-red-500/20',
                icon: <XIcon className="h-3 w-3" />,
            }
        default:
            return {
                label: status,
                variant: 'secondary' as const,
                className:
                    'border-muted bg-muted/50 text-muted-foreground hover:bg-muted/80',
                icon: <ClockIcon className="h-3 w-3" />,
            }
    }
}

const MemberProfileSettingsBanner = ({ className, memberProfile }: Props) => {
    const statusConfig = getStatusConfig(memberProfile.status)

    return (
        <Card
            className={cn(
                'mx-auto w-full bg-gradient-to-r from-primary/20 to-card/10 ring-2 ring-card dark:ring-primary/40',
                className,
                memberProfile.is_closed &&
                    'from-destructive/20 !ring-destructive'
            )}
        >
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <PreviewMediaWrapper media={memberProfile.media}>
                            <ImageDisplay
                                src={memberProfile.media?.download_url}
                                fallback={
                                    memberProfile.first_name.charAt(0) ?? '-'
                                }
                                className="size-12"
                            />
                        </PreviewMediaWrapper>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="truncate font-bold">
                                {memberProfile.full_name}
                            </h2>
                            <div className="space-x-2">
                                <Badge variant="outline">
                                    {memberProfile.member_type?.name}
                                </Badge>
                                {memberProfile.is_closed ? (
                                    <Badge variant="destructive">Closed</Badge>
                                ) : (
                                    <Badge className={statusConfig.className}>
                                        {statusConfig.label}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-xs lg:grid-cols-4">
                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Member Profile ID
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="truncate font-mono">
                                        <CopyWrapper>
                                            {memberProfile.id}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Contact Number
                                </h3>
                                <div className="flex items-center gap-2">
                                    <PhoneIcon className="400 size-3" />
                                    <span>
                                        <CopyWrapper>
                                            {memberProfile.contact_number}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Passbook Number
                                </h3>
                                <div className="flex items-center gap-2">
                                    <IdCardIcon className="size-3" />
                                    <span className="font-mono">
                                        <CopyWrapper>
                                            {memberProfile.passbook}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Member Type
                                </h3>
                                <div className="flex items-center gap-2">
                                    <UserIcon className="size-3" />
                                    <span>
                                        <CopyWrapper>
                                            {memberProfile.member_type?.name}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
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
