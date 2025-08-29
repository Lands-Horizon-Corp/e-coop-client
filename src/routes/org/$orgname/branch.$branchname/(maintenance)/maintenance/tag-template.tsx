import { createFileRoute } from '@tanstack/react-router'

import TagTemplatePage from '@/modules/tag-template/components/pages/tag-template'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/tag-template'
)({
    component: TagTemplatePage,
})
