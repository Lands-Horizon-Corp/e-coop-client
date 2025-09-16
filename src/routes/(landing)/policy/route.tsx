import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'

import PolicyNav from '../-landing-components/policy-nav'

export const Route = createFileRoute('/(landing)/policy')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageContainer className="bg-gray-100/50 dark:bg-background/80 py-0 mt-16 ">
            <div className="w-full flex  min-h-screen m-w-[calc(50vh-theme(spacing.16))] overflow-x-auto max-w-[90rem] lg:mx-auto px-2 sm:px-6 lg:px-8">
                <PolicyNav />
                <Outlet />
            </div>
        </PageContainer>
    )
}
