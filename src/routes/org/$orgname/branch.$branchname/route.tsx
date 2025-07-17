import { Outlet, createFileRoute } from '@tanstack/react-router'

import UserNav from '@/components/nav/navs/user-nav'
import OrgBranchSidebar from '@/components/sidebar/org-branch-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AuthGuard from '@/components/wrappers/auth-guard'
import OrgBranchUrlGuard from '@/components/wrappers/org-branch-guard'

export const Route = createFileRoute('/org/$orgname/branch/$branchname')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthGuard>
            <OrgBranchUrlGuard>
                <SidebarProvider>
                    <OrgBranchSidebar />
                    <SidebarInset className="ecoop-scroll max-h-[98vh] w-full overflow-y-auto">
                        <UserNav className="sticky top-0 z-50 bg-background" />
                        <main>
                            <Outlet />
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </OrgBranchUrlGuard>
        </AuthGuard>
    )
}
