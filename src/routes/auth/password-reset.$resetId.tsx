import z from 'zod'
import { useState } from 'react'
import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'

import { GoArrowLeft } from 'react-icons/go'
import { Button } from '@/components/ui/button'

import { KeyIcon } from '@/components/icons'
import GuestGuard from '@/components/wrappers/guest-guard'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import AuthPageWrapper from '@/routes/auth/-components/auth-page-wrapper'
import ResetPasswordForm from '@/components/forms/auth-forms/reset-password-form'

import { useCheckResetId } from '@/hooks/api-hooks/use-auth'

export const PasswordResetPagePathSchema = z.object({
    resetId: z.string({ required_error: 'Missing Reset Link' }),
})

export const Route = createFileRoute('/auth/password-reset/$resetId')({
    component: PasswordResetPage,
    params: {
        parse: (params) => {
            const data = PasswordResetPagePathSchema.parse(params)
            return data
        },
    },
})

function PasswordResetPage() {
    const router = useRouter()
    const pathParams = useParams({ from: '/auth/password-reset/$resetId' })
    const [done, setDone] = useState(false)

    const {
        data: resetEntry,
        isPending,
        isFetching,
    } = useCheckResetId({ resetId: pathParams.resetId })

    return (
        <GuestGuard>
            <div className="flex min-h-full flex-col items-center justify-center">
                <AuthPageWrapper>
                    {isPending && !resetEntry && (
                        <div className="flex flex-col items-center gap-y-2 py-16">
                            <LoadingSpinner />
                            <p className="text-center text-sm text-foreground/50">
                                verifying reset password link
                            </p>
                        </div>
                    )}
                    {!done && !isPending && resetEntry && (
                        <ResetPasswordForm
                            resetId={pathParams.resetId}
                            onSuccess={() => setDone(true)}
                        />
                    )}
                    {!done && !isFetching && !resetEntry && (
                        <div className="flex w-full flex-col gap-y-4 sm:w-[390px]">
                            <div className="flex flex-col items-center gap-y-4 py-4 text-center">
                                <div className="relative p-8">
                                    <KeyIcon className="size-[53px] text-[#FF7E47]" />
                                    <div className="absolute inset-0 rounded-full bg-[#FF7E47]/20" />
                                    <div className="absolute inset-5 rounded-full bg-[#FF7E47]/20" />
                                </div>
                                <p className="text-xl font-medium">
                                    Invalid reset link
                                </p>
                                <p className="text-sm text-foreground/70">
                                    Sorry, but the reset link you have is
                                    invalid
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                className="text-foreground/60"
                                onClick={() => {
                                    router.navigate({
                                        to: '/auth/sign-in',
                                    })
                                }}
                            >
                                <GoArrowLeft className="mr-2" /> Back to Login
                            </Button>
                        </div>
                    )}

                    {done && (
                        <div className="flex w-full flex-col gap-y-4 sm:w-[390px]">
                            <div className="flex flex-col items-center gap-y-4 py-4 text-center">
                                <div className="relative p-8">
                                    <KeyIcon className="size-[53px] text-green-500" />
                                    <div className="absolute inset-0 rounded-full bg-green-500/20" />
                                    <div className="absolute inset-5 rounded-full bg-green-500/20" />
                                </div>
                                <p className="text-xl font-medium">
                                    Password Set
                                </p>
                                <p className="text-sm text-foreground/70">
                                    Your new password has been saved.
                                </p>
                            </div>
                            <Button
                                onClick={() => {
                                    router.navigate({
                                        to: '/auth/sign-in',
                                    })
                                }}
                            >
                                Sign In Now
                            </Button>
                        </div>
                    )}
                </AuthPageWrapper>
            </div>
        </GuestGuard>
    )
}
