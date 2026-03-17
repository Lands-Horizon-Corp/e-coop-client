import { createFileRoute } from '@tanstack/react-router'

import InventoryWarehousePage from '@/modules/inventory-warehouse/pages/inventory-warehouse'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(inventory-maintenance)/inventory-warehouse'
)({
    component: InventoryWarehousePage,
})
