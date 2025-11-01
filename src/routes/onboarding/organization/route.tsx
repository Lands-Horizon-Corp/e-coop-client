import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/organization')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="w-full">
            <Outlet />
        </div>
    )
}
