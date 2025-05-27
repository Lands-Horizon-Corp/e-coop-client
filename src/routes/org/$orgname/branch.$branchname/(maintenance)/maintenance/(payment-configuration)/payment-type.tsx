import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(payment-configuration)/payment-type'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello, payment type</div>
}
