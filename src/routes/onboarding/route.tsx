import { createFileRoute } from '@tanstack/react-router'

import { Onboarding } from '@/modules/organization'

type organizationSearch = {
    organization_id?: string
}

export const Route = createFileRoute('/onboarding')({
    validateSearch: (search: Record<string, unknown>): organizationSearch => {
        return {
            organization_id: String(search?.organization_id ?? ''),
        }
    },
    component: Onboarding,
})
