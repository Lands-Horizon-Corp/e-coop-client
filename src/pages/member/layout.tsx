import { Outlet } from '@tanstack/react-router'

import AuthGuard from '@/components/wrappers/auth-guard'

const MemberLayout = () => {
    return (
        <AuthGuard allowedAccountTypes={['Member']}>
            <div className="grid min-h-[100dvh] w-full grid-cols-[1fr] md:grid-cols-[auto_1fr]">
                <Outlet />
            </div>
        </AuthGuard>
    )
}

export default MemberLayout
