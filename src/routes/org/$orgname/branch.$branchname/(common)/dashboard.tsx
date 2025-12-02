import { createFileRoute } from '@tanstack/react-router'

import Heartbeat from '@/modules/heartbeat/components/heartbeat'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/dashboard'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            <Heartbeat />
        </div>
    )
}
