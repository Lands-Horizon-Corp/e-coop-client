import { Outlet, createFileRoute } from '@tanstack/react-router'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import TimeMachineTimeStatusBar from '@/modules/user-organization/components/time-machine-time-status-bar'

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
                    <SidebarInset className="ecoop-scroll min-h-screen max-h-[100vh] w-full overflow-y-auto">
                        <UserNav className="sticky top-0 z-50 bg-background" />
                        <main className="flex-1">
                            <Outlet />
                        </main>
                        <TimeMachineTimeStatBar />
                    </SidebarInset>
                </SidebarProvider>
            </OrgBranchUrlGuard>
        </AuthGuard>
    )
}

const TimeMachineTimeStatBar = () => {
    const {
        currentAuth: {
            user_organization: { time_machine_time },
        },
    } = useAuthUserWithOrgBranch()

    if (!time_machine_time) return null

    return (
        <div className="sticky bottom-0 left-0 w-full">
            <div className="absolute w-full top-0.5 z-5 h-16 from-40% -translate-y-full bg-gradient-to-t from-primary/10 to-transparent" />
            <TimeMachineTimeStatusBar
                className="z-10"
                timeMachineTime={time_machine_time}
            />
        </div>
    )
}
