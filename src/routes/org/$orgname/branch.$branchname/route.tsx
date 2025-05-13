import { createFileRoute, Outlet } from '@tanstack/react-router'

import UserNav from '@/components/nav/navs/user-nav'
import AuthGuard from '@/components/wrappers/auth-guard'
import OrgBranchSidebar from '@/components/sidebar/org-branch-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const Route = createFileRoute('/org/$orgname/branch/$branchname')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthGuard>
            <SidebarProvider>
                <OrgBranchSidebar />
                <SidebarInset className="ecoop-scroll max-h-[98vh] w-full overflow-y-auto">
                    <UserNav className="sticky top-0 z-50 bg-background" />
                    <main>
                        <Outlet />
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    )
}
