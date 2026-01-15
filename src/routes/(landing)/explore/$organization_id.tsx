import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(landing)/explore/$organization_id')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(landing)/explore/$organization_id"!</div>
}
