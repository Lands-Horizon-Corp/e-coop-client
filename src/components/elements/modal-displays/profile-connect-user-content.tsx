import { Badge } from '@/components/ui/badge'
import ImageDisplay from '@/components/image-display'
import { Card, CardContent } from '@/components/ui/card'
import { IMemberProfile, IUserOrganization } from '@/types'
import { UserIcon, ShieldIcon, ArrowDownIcon } from '@/components/icons'

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
                        <ImageDisplay
                            src={
                                memberProfile.media?.download_url ||
                                '/placeholder.svg'
                            }
                            fallback={memberProfile.first_name.charAt(0) ?? '-'}
                            className="h-12 w-12 border-2 border-white shadow-sm dark:border-gray-700"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-xs text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-900"
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

            <Card className="border-2 border-dashed border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <ImageDisplay
                            src={
                                userOrg.user.media?.download_url ||
                                '/placeholder.svg'
                            }
                            fallback={userOrg.user.user_name.charAt(0) ?? '-'}
                            className="h-12 w-12 border-2 border-white shadow-sm dark:border-gray-700"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                                <ShieldIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-xs text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900"
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
