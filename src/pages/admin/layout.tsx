import { Outlet } from '@tanstack/react-router'

import AuthGuard from '@/components/wrappers/auth-guard'

const AdminLayout = () => {
    return (
        <AuthGuard allowedAccountTypes={['Admin']}>
            <div className="grid min-h-[100dvh] w-full grid-cols-[1fr] md:grid-cols-[auto_1fr]">
                <Outlet />
            </div>
        </AuthGuard>
    )
}

export default AdminLayout
