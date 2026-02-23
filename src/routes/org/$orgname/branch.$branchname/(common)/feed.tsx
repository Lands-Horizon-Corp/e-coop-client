import { createFileRoute } from '@tanstack/react-router'

import FeedPage from '@/modules/feed/components/pages/feed-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/feed'
)({
    component: FeedPage,
})
