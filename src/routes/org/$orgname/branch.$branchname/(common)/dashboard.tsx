import { createFileRoute } from '@tanstack/react-router'

import { AccountViewerModal } from '@/modules/account/components/account-viewer/account-viewer'
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
            <AccountViewerModal
                // accountId="67de5b0e-bc25-4a11-bfc3-4847bb8fe80b"
                accountId="6a66c0cb-0aee-48c2-a888-56623edccf17"
                // accountId="3b6cfc8c-751f-4d9a-aa14-5f4ed559b6c3"
                // accountId="62fc5be4-c5ae-4822-a80d-81bcd51cd756"
                open={true}
            />
        </div>
    )
}
