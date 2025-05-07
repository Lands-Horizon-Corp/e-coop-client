import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/user-avatar'
import { WarningCircleIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { IUserBase } from '@/types'

interface Props {
    loading: boolean
    userData: IUserBase
    onBackSignOut: () => void
}

const ShowAccountStatus = ({ loading, userData, onBackSignOut }: Props) => {
    if (userData.type === 'ban')
        return (
            <div className="flex max-w-sm flex-col items-center gap-y-4">
                <p className="text-xl font-medium text-[#ED6E6E]">
                    Account Banned
                </p>
                <div className="relative my-8 rounded-full border-4 border-[#ED6E6E]">
                    <UserAvatar
                        className="size-28"
                        src={userData?.media?.download_url ?? ''}
                        fallback={userData?.user_name?.charAt(0) ?? '-'}
                    />
                    <WarningCircleIcon className="absolute -bottom-1 -right-1 size-6 text-[#ED6E6E]" />
                </div>
                <p className="text-center text-foreground/80">
                    Your account has been banned. If you think this is a
                    mistake, call/contact your coop administration.
                </p>

                <Button
                    disabled={loading}
                    onClick={onBackSignOut}
                    className="w-full"
                >
                    {loading ? <LoadingSpinner /> : 'Back to Sign In'}
                </Button>
            </div>
        )

    return null
}

export default ShowAccountStatus
