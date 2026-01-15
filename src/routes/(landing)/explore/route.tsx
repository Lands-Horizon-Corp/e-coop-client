import { createFileRoute } from '@tanstack/react-router'

import ExplorePage from '@/modules/explore/pages/explore-page'

type organizationSearch = {
    organization_id?: string
}

export const Route = createFileRoute('/(landing)/explore')({
    validateSearch: (search: Record<string, unknown>): organizationSearch => {
        return {
            organization_id: String(search?.organization_id ?? ''),
        }
    },
    component: ExplorePage,
})
