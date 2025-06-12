import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/dashboard'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello !</div>
}
