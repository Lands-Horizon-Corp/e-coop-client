import { createFileRoute } from '@tanstack/react-router'

import { InventoryPage } from '@/modules/inventory/pages'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(inventory)/inventory'
)({
    component: InventoryPage,
})
