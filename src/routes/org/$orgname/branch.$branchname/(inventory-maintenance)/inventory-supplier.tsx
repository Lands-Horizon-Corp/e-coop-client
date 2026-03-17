import { createFileRoute } from '@tanstack/react-router'

import InventorySupplierPage from '@/modules/inventory-supplier/pages/inventory-supplier'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(inventory-maintenance)/inventory-supplier'
)({
    component: InventorySupplierPage,
})
