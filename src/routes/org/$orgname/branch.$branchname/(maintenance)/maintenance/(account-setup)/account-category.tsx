import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(account-setup)/account-category'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello, Account category</div>
}
