import { toReadableDate } from '@/helpers/date-utils'

import { EmailIcon, PhoneIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Card, CardContent } from '@/components/ui/card'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { TEntityId } from '@/types'

import { useGetById } from '../user.service'
import { IUserBase } from '../user.types'

type Props = {
    userId: TEntityId
    defaultValue?: IUserBase
}

const HoveruserInfo = ({ userId, defaultValue }: Props) => {
    const { data: user, isPending } = useGetById({
        id: userId,
        options: {
            initialData: defaultValue,
        },
    })

    return (
        <Card className="w-full max-w-sm rounded-2xl bg-popover text-white">
            <CardContent className="p-4">
                {!user && isPending && <LoadingSpinner />}

                {user !== undefined && (
                    <div className="min-w-56 gap-4">
                        <div className="flex items-center justify-between gap-x-2">
                            <PreviewMediaWrapper media={user?.media}>
                                <ImageDisplay
                                    className="size-16 border-2 border-gray-700"
                                    fallback={
                                        user?.full_name !== undefined
                                            ? user?.full_name.charAt(0)
                                            : '-'
                                    }
                                    src={user?.media?.download_url}
                                />
                            </PreviewMediaWrapper>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="truncate font-semibold text-white">
                                        {user.full_name}
                                    </h3>
                                    {user.is_email_verified && (
                                        <div
                                            className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"
                                            title="Verified"
                                        />
                                    )}
                                </div>
                                <p className="mb-3 text-sm text-muted-foreground/50">
                                    @{user.user_name}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 min-w-0 space-y-2">
                            <div className="space-y-2 text-sm text-muted-foreground/70">
                                <div className="flex items-center gap-2">
                                    <EmailIcon className="size-4 flex-shrink-0" />
                                    <span className="truncate">
                                        {user.email}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <PhoneIcon className="size-4 flex-shrink-0" />
                                    <span>{user.contact_number}</span>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground/60">
                                <span>
                                    Joined{' '}
                                    {user?.created_at
                                        ? toReadableDate(user.created_at)
                                        : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default HoveruserInfo
