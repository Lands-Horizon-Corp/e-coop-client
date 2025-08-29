import { createFileRoute } from '@tanstack/react-router'

import PermissionTemplatePage from '@/modules/permission-template/components/pages/permission-template'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(employees)/permission-template'
)({
    component: PermissionTemplatePage,
})
