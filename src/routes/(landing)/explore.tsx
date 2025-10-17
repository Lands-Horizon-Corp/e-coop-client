import { createFileRoute } from '@tanstack/react-router'

import ExplorePage from '@/modules/explore/pages/explore-page'

export const Route = createFileRoute('/(landing)/explore')({
    component: ExplorePage,
})
