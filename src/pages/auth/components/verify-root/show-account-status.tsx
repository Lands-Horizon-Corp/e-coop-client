import { useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/user-avatar'
import { WarningCircleIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { HELP_CONTACT } from '@/constants'
import { IUserData } from '@/types'
import { getUsersAccountTypeRedirectPage } from '@/helpers'

interface Props {
    loading: boolean
    userData: IUserData
    onBackSignOut: () => void
}

const ShowAccountStatus = ({ loading, userData, onBackSignOut }: Props) => {
    const router = useRouter()
    if (userData.status === 'Pending')
        return (
            <div className="flex max-w-sm flex-col items-center gap-y-4">
                <p className="text-xl font-medium text-amber-500">
                    Account Pending
                </p>
                <p className="text-center text-foreground/70">
                    <span className="font-medium text-foreground/90">
                        Thank you for joining with us!
                    </span>
                </p>
                <UserAvatar
                    className="my-8 size-28"
                    src={userData?.media?.downloadURL ?? ''}
                    fallback={userData?.username?.charAt(0) ?? '-'}
                />
                <p className="text-center text-foreground/90">
                    <span>
                        Please allow 1 to 7 business days for account
                        validation. You will receive an email notification once
                        your account has been activated and is ready for use.
                        <br />
                    </span>
                </p>
                <p className="px-4 text-center">
                    Your ID is{' '}
                    <span className="font-medium text-green-500">
                        {userData.id}
                    </span>
                </p>
                <Button
                    disabled={loading}
                    variant="secondary"
                    onClick={onBackSignOut}
                    className="mt-6 w-full"
                >
                    {loading ? <LoadingSpinner /> : 'Back to Sign In'}
                </Button>
            </div>
        )

    if (userData.status === 'Not Allowed')
        return (
            <div className="flex max-w-sm flex-col items-center gap-y-4">
                <p className="text-xl font-medium text-[#ED6E6E]">
                    Account Canceled
                </p>
                <div className="relative my-8 rounded-full border-4 border-[#ED6E6E]">
                    <UserAvatar
                        className="size-28"
                        src={userData?.media?.downloadURL ?? ''}
                        fallback={userData?.username?.charAt(0) ?? '-'}
                    />
                    <WarningCircleIcon className="absolute -bottom-1 -right-1 size-6 text-[#ED6E6E]" />
                </div>
                <p className="text-center text-foreground/80">
                    Your account has been canceled. Please contact the number
                    below for assistance.
                </p>

                <p className="text-center font-medium">{HELP_CONTACT}</p>
                <Button
                    disabled={loading}
                    onClick={onBackSignOut}
                    className="w-full"
                >
                    {loading ? <LoadingSpinner /> : 'Back to Sign In'}
                </Button>
            </div>
        )

    if (userData.status === 'Verified') {
        return (
            <div className="flex max-w-sm flex-col items-center gap-y-4">
                <p className="text-xl font-medium text-primary">
                    You are all set
                </p>
                <div className="relative my-8 rounded-full border-4 border-primary">
                    <UserAvatar
                        className="size-28"
                        src={userData?.media?.downloadURL ?? ''}
                        fallback={userData?.username?.charAt(0) ?? '-'}
                    />
                </div>
                <p className="text-center text-foreground/80">
                    Your account is verified, you can now proceed
                </p>

                <Button
                    onClick={() => {
                        const redirectUrl =
                            getUsersAccountTypeRedirectPage(userData)
                        router.navigate({ to: redirectUrl })
                    }}
                    className="w-full"
                >
                    Proceed
                </Button>
            </div>
        )
    }

    return (
        <p className="text-center">
            Sorry, couldn&apos;t identify your account status
        </p>
    )
}

export default ShowAccountStatus
