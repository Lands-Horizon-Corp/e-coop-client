import { useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/user-avatar'

import { useAuthStore } from '@/store/user-auth-store'

const NavGetStarted = () => {
    const { navigate } = useRouter()
    const {
        currentAuth: { user, user_organization },
        authStatus,
    } = useAuthStore()

    if (!user || authStatus !== 'authorized') return null

    return (
        <Button
            onClick={() => {
                if (!user_organization?.organization) {
                    navigate({ to: '/onboarding' as string })
                } else {
                    navigate({
                        to: `/ecoop/${user_organization.organization?.name}` as string,
                    })
                }
            }}
            className="scale-effects gap-x-2 rounded-full px-2"
        >
            <UserAvatar
                src={user.media?.download_url ?? ''}
                fallback={user.user_name.charAt(0) ?? '-'}
                fallbackClassName="bg-secondary text-secondary-foreground"
            />
            <span className="mr-2">Get Started</span>
        </Button>
    )
}

export default NavGetStarted
