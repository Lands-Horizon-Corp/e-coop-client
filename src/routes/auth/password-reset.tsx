import z from 'zod'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const PasswordResetPagePathSchema = z.object({
    resetId: z.string({ required_error: 'Missing Reset Link' }),
})

export const Route = createFileRoute('/auth/password-reset')({
    component: () => <Outlet />,
})
