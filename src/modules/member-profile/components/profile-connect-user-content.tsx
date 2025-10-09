import { IUserOrganization } from '@/modules/user-organization'

import { ArrowDownIcon, ShieldIcon, UserIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IMemberProfile } from '..'

interface Props {
    memberProfile: IMemberProfile
    userOrg: IUserOrganization
}

const ProfileConnectUserModalDisplay = ({ memberProfile, userOrg }: Props) => {
    return (
        <div className="space-y-4">
            <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <PreviewMediaWrapper media={memberProfile.media}>
                            <ImageDisplay
                                className="h-12 w-12 border-2 border-white shadow-sm dark:border-gray-700"
                                fallback={
                                    memberProfile.first_name.charAt(0) ?? '-'
                                }
                                src={
                                    memberProfile.media?.download_url ||
                                    '/placeholder.svg'
                                }
                            />
                        </PreviewMediaWrapper>
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <Badge
                                    className="bg-blue-100 text-xs text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-900"
                                    variant="secondary"
                                >
                                    Member Profile
                                </Badge>
                            </div>
                            <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                                {memberProfile.full_name}
                            </h3>
                            <p className="font-mono text-sm text-muted-foreground">
                                ID: {memberProfile.id}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
                    <ArrowDownIcon className="size-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                        Connecting to
                    </span>
                    <ArrowDownIcon className="size-4 text-gray-600 dark:text-gray-400" />
                </div>
            </div>

            <Card className="border-2 border-dashed border-primary bg-green-50/50 dark:border-primary/70 dark:bg-green-950/50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <PreviewMediaWrapper media={userOrg.user.media}>
                            <ImageDisplay
                                className="h-12 w-12 border-2 border-white shadow-sm dark:border-gray-700"
                                fallback={
                                    userOrg.user.user_name.charAt(0) ?? '-'
                                }
                                src={
                                    userOrg.user.media?.download_url ||
                                    '/placeholder.svg'
                                }
                            />
                        </PreviewMediaWrapper>
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                                <ShieldIcon className="h-4 w-4 text-primary dark:text-primary" />
                                <Badge
                                    className="bg-primary/10 text-xs text-primary/80 hover:bg-primary/10 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/10"
                                    variant="secondary"
                                >
                                    User Account
                                </Badge>
                            </div>
                            <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                                {userOrg.user.full_name}
                            </h3>
                            <p className="font-mono text-sm text-muted-foreground">
                                ID: {userOrg.user.id}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-4 rounded-lg p-3 dark:border-border dark:bg-secondary dark:text-muted-foreground">
                <p className="text-xs leading-relaxed">
                    Once connected, these profiles will be permanently linked.
                    This action cannot be undone without administrator
                    intervention.
                </p>
            </div>
        </div>
    )
}

export default ProfileConnectUserModalDisplay
