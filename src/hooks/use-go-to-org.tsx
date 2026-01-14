import { useRouter } from '@tanstack/react-router'

import { useAuthUser } from '@/modules/authentication/authgentication.store'

export const useGoToOrg = () => {
    const {
        currentAuth: { user_organization },
    } = useAuthUser()

    const { navigate } = useRouter()

    const handleGetStarted = () => {
        if (!user_organization?.organization || !user_organization?.branch) {
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
    }
    return { handleGetStarted }
}
