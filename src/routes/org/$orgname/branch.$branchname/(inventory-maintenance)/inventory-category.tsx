import { createFileRoute } from '@tanstack/react-router'

import InventoryCategoryPage from '@/modules/inventory-category/pages/inventory-category'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(inventory-maintenance)/inventory-category'
)({
    component: InventoryCategoryPage,
})
