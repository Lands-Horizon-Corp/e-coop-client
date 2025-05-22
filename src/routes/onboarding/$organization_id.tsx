import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/$organization_id')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello</div>
}
