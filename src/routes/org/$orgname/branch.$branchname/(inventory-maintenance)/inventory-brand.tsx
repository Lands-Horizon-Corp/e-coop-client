import { createFileRoute } from '@tanstack/react-router'

import InventoryBrandPage from '@/modules/inventory-brand/pages/inventory-brand'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(inventory-maintenance)/inventory-brand'
)({
    component: InventoryBrandPage,
})
