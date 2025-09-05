import { Outlet, createFileRoute } from '@tanstack/react-router'
import z from 'zod'

import AuthGuard from '@/components/wrappers/auth-guard'
import UserOrgGuard from '@/components/wrappers/user-org-guard'

const paramsSchema = z.object({
    orgname: z.string().min(1, 'Organization name is required'),
})

export const Route = createFileRoute('/org/$orgname')({
    params: {
        parse: (params) => paramsSchema.parse(params),
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthGuard>
            <UserOrgGuard>
                <Outlet />
            </UserOrgGuard>
        </AuthGuard>
    )
}
