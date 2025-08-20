import { toReadableDateTime } from '@/helpers/date-utils'
import { FootprintsIcon } from 'lucide-react'

import { UserTypeBadge } from '@/components/badges/user-type-badge'
import { RunningIcon, TextFileFillIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Map from '@/components/map'
import { Separator } from '@/components/ui/separator'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { IFootstep } from '../footstep.types'

type Props = {
    footstep: IFootstep
}

export default function FootstepDetail({ footstep }: Props) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <p className="text-xl">
                    <FootprintsIcon className="text-primary -rotate-12 inline" />{' '}
                    Footstep Details
                </p>
                <p className="text-sm text-muted-foreground/70">
                    Full overview of the user footstep and metadata.
                </p>
                <div className="text-xs text-muted-foreground/70">
                    <CopyWrapper
                        textToCopy={footstep.id}
                        copyMsg="Copied Footstep ID"
                    >
                        <span className="inline text-muted-foreground/70 group-hover/copy:text-muted-foreground truncate">
                            Copy ID
                        </span>
                    </CopyWrapper>
                </div>
            </div>
            <div className="w-full py-4 space-y-4 mt-4">
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Module</p>
                    <p className="text-sm px-2 rounded-md py-1 bg-secondary w-fit">
                        <TextFileFillIcon className="inline mr-1 text-muted-foreground" />{' '}
                        {footstep.module}
                    </p>

                    <p className="text-sm text-muted-foreground">Activity</p>
                    <p className="text-sm bg-secondary px-2 py-1 rounded-md w-fit">
                        <RunningIcon className="inline mr-1 text-muted-foreground" />{' '}
                        {footstep.activity}
                    </p>

                    {footstep.description && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground/70">
                                Description
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {footstep.description}
                            </p>
                        </div>
                    )}
                </div>

                <Separator />

                <div className="space-y-4 text-sm">
                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">Time</p>
                        <p className="text-xs">
                            {toReadableDateTime(
                                footstep.created_at,
                                "MMM dd yyyy '•' hh:mm a"
                            )}
                        </p>
                    </div>
                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">Branch</p>
                        <div className="text-xs text-muted-foreground/70">
                            <CopyWrapper>
                                <span className="inline text-muted-foreground/70 group-hover/copy:text-muted-foreground truncate">
                                    {footstep.branch_id}
                                </span>
                            </CopyWrapper>
                        </div>
                    </div>

                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">
                            User Type
                        </p>

                        {footstep.user_type ? (
                            <UserTypeBadge
                                showIcon
                                size="sm"
                                userType={footstep.user_type}
                            />
                        ) : (
                            <p className="text-xs">...</p>
                        )}
                    </div>

                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">
                            IP Address
                        </p>
                        <p className="text-xs">
                            {footstep.ip_address?.trim() ? (
                                footstep.ip_address
                            ) : (
                                <span className="text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">
                            User Agent
                        </p>
                        <p className="text-xs break-words">
                            {footstep.user_agent?.trim() ? (
                                footstep.user_agent
                            ) : (
                                <span className="text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">Referer</p>
                        <p className="text-sm break-words">
                            {footstep.referer?.trim() ? (
                                footstep.referer
                            ) : (
                                <span className="text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">
                            Language
                        </p>
                        <p className="text-sm break-words">
                            {footstep.accept_language?.trim() ? (
                                footstep.accept_language
                            ) : (
                                <span className="text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center w-full justify-between">
                        <p className="text-muted-foreground text-xs">
                            Location
                        </p>
                        <p className="text-sm break-words">
                            {footstep.location?.trim() ? (
                                footstep.location
                            ) : (
                                <span className="text-muted-foreground">
                                    ...
                                </span>
                            )}
                        </p>
                    </div>

                    {!!footstep.latitude && !!footstep.longitude && (
                        <div className="h-64">
                            <Map
                                viewOnly
                                center={[footstep.latitude, footstep.longitude]}
                                zoom={13}
                                className="mb-4 size-full"
                            />
                        </div>
                    )}
                </div>
                <Separator />

                <div className="flex items-center gap-3">
                    <ImageDisplay
                        className="size-12"
                        src={footstep?.user?.media?.download_url}
                    />
                    <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-muted-foreground/80">
                            Action By
                        </p>
                        <p>{footstep.user?.full_name ?? 'Unknown User'}</p>

                        <div className="text-xs text-muted-foreground/70">
                            <CopyWrapper
                                textToCopy={footstep.user_id}
                                copyMsg="Copied User ID"
                            >
                                <span className="inline text-muted-foreground/70 group-hover/copy:text-muted-foreground truncate">
                                    Copy User ID
                                </span>
                            </CopyWrapper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
