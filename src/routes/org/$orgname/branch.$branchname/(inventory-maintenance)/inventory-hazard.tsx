import { createFileRoute } from '@tanstack/react-router'

import InventoryHazardPage from '@/modules/inventory-hazard/pages/inventory-hazard'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(inventory-maintenance)/inventory-hazard'
)({
    component: InventoryHazardPage,
})
