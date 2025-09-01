import { createFileRoute } from '@tanstack/react-router'

import MainSettingsPage from '@/modules/settings/components/pages/settings'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/(settings)/settings'
)({
    component: MainSettingsPage,
})
