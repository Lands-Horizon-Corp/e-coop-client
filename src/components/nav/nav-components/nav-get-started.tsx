import { useRouter } from '@tanstack/react-router'

import { useAuthStore } from '@/modules/authentication/authgentication.store'
import UserAvatar from '@/modules/user/components/user-avatar'

import { Button } from '@/components/ui/button'

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
                if (
                    !user_organization?.organization ||
                    !user_organization?.branch
                ) {
                    navigate({ to: '/onboarding' as string })
                } else {
                    const orgName = user_organization.organization?.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '')

                    const branchName = user_organization?.branch.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '')

                    navigate({
                        to: `/org/${orgName}/branch/${branchName}` as string,
                    })
                }
            }}
            className="scale-effects gap-x-2 cursor-pointer rounded-full px-2"
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
