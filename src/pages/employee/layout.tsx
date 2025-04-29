import { Outlet } from '@tanstack/react-router'

import UserNav from '@/components/nav/navs/user-nav'
import AuthGuard from '@/components/wrappers/auth-guard'
import EmployeeSidebar from './components/employee-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const OwnerLayout = () => {
    return (
        <AuthGuard allowedAccountTypes={['Employee']}>
            <SidebarProvider>
                <EmployeeSidebar />
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

export default OwnerLayout
