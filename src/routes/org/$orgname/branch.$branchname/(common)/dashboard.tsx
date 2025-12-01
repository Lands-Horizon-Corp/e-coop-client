import { createFileRoute } from '@tanstack/react-router'

import { TestGeneratedEntriesViewer } from '@/modules/generated-savings-interest/components/forms/generated-entries-viewer'
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
            <TestGeneratedEntriesViewer />
        </div>
    )
}
