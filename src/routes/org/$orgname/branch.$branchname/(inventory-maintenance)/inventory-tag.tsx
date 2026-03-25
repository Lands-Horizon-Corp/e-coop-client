import { createFileRoute } from '@tanstack/react-router'

import InventoryTagPage from '@/modules/inventory-tag/pages/inventory-tag'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(inventory-maintenance)/inventory-tag'
)({
    component: InventoryTagPage,
})
