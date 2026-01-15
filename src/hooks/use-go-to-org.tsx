import { useRouter } from '@tanstack/react-router'

import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { useHotkeys } from 'react-hotkeys-hook'

export const useGetIntoBranch = () => {
    const { currentAuth } = useAuthStore()

    const { navigate } = useRouter()

    if (!currentAuth) {
        navigate({ to: '/onboarding' as string })
    }

    const handleGetStarted = () => {
        if (
            !currentAuth.user_organization?.organization ||
            !currentAuth.user_organization?.branch
        ) {
            navigate({ to: '/onboarding' as string })
        } else {
            const orgName = currentAuth.user_organization.organization?.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')

            const branchName = currentAuth.user_organization?.branch.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')

            navigate({
                to: `/org/${orgName}/branch/${branchName}` as string,
            })
        }
    }

    useHotkeys('esc', (e) => {
        e.preventDefault()
        handleGetStarted()
    })

    return { handleGetStarted }
}
