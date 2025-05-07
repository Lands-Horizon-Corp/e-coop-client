import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/org/$orgname/branch/$branchname')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/organization/$orgname/branch/$branchname"! Layout</div>
}
