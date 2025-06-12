import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/organization')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="w-full pt-10">
            <h1 className="w-full text-center text-3xl font-semibold">
                Join Organization
            </h1>
            <Outlet />
        </div>
    )
}
