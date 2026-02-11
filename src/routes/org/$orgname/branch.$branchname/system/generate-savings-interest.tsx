import { createFileRoute } from '@tanstack/react-router'

import GeneratedSavingsInterestPage from '@/modules/generated-savings-interest/components/pages/generated-savings-interest-page'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/system/generate-savings-interest'
)({
    component: GeneratedSavingsInterestPage,
})
