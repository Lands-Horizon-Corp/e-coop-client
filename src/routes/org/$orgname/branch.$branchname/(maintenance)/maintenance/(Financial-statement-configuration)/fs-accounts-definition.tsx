import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(Financial-statement-configuration)/fs-accounts-definition'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello, fs account definition</div>
}
