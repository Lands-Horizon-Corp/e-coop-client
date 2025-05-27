import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(general-ledger-management)/gl-accounts-grouping'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            Hello
            "/org/$orgname/branch/$branchname/(maintenance)/maintenance/(general-ledger-management)/general-ledger-accounts-grouping"!
        </div>
    )
}
