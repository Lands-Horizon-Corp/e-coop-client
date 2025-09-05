import { createFileRoute } from '@tanstack/react-router'

import { OrganizationDetails } from '@/modules/organization'

export const Route = createFileRoute(
    '/onboarding/organization/$organization_id'
)({
    component: () => {
        return <OrganizationDetails />
    },
})
