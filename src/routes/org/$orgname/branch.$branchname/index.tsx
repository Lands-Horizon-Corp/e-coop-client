import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/org/$orgname/branch/$branchname/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Navigate to={'/org/$orgname/branch/$branchname/dashboard' as string} />
    )
}
