import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

import PolicyNav from '../-landing-components/policy-nav'

export const Route = createFileRoute('/(landing)/site-policy')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="w-full bg-gray-100/50 dark:bg-background/80 flex min-h-screen overflow-x-auto max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <PolicyNav />
            <Outlet />
        </div>
    )
}
