import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import VerifyForm from '@/components/forms/auth-forms/verify-form'
import { BadgeCheckFillIcon, BadgeQuestionFillIcon } from '@/components/icons'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useAuthUser } from '@/store/user-auth-store'
import { useOTPVerification } from '@/hooks/api-hooks/use-auth'

import { IUserBase } from '@/types'

export const Route = createFileRoute('/account/verify/email')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        updateCurrentAuth,
        currentAuth: { user },
    } = useAuthUser()

    useSubscribe<IUserBase>(`user.update.${user.id}`, (newUserData) => {
        updateCurrentAuth({ user: newUserData })
    })

    const [verifying, setVerifying] = useState(false)

    const { mutate: sendcode, isPending } = useOTPVerification({
        verifyMode: 'email',
        onSuccess: () => {
            setVerifying(true)
        },
    })

    return (
        <div>
            {user.is_email_verified && (
                <div>
                    <div className="flex flex-col items-center gap-y-4 py-4 text-center">
                        <div className="relative p-8">
                            <BadgeCheckFillIcon className="size-[53px] text-green-500" />
                            <div className="absolute inset-0 rounded-full bg-green-500/20" />
                            <div className="absolute inset-5 rounded-full bg-green-500/20" />
                        </div>
                        <p className="text-xl font-medium">Email Verified</p>
                        <span className="bg-popoverx rounded-md bg-primary/10 px-2 py-1">
                            {user.email}
                        </span>{' '}
                        <p className="text-sm text-foreground/70">
                            Your email has been verified.
                        </p>
                    </div>
                </div>
            )}
            {!user.is_email_verified && (
                <>
                    {!verifying ? (
                        <>
                            <div className="flex flex-col items-center gap-y-4 py-4 text-center">
                                <div className="relative size-fit p-8">
                                    <BadgeQuestionFillIcon className="size-[53px] text-orange-500" />
                                    <div className="absolute inset-0 rounded-full bg-orange-500/20" />
                                    <div className="absolute inset-5 rounded-full bg-orange-500/20" />
                                </div>
                                <p className="text-xl font-medium">
                                    Email verification needed
                                </p>
                                <p className="text-sm text-foreground/70">
                                    Your email address{' '}
                                    <span className="bg-popoverx rounded-md bg-orange-500/10 px-2 py-1">
                                        {user.email}
                                    </span>{' '}
                                    is not yet verified.
                                </p>
                                <Button
                                    disabled={isPending}
                                    onClick={() => sendcode()}
                                >
                                    {isPending ? (
                                        <>
                                            Sending OTP{' '}
                                            <LoadingSpinner className="ml-2" />
                                        </>
                                    ) : (
                                        'Send OTP Verification'
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <VerifyForm
                                verifyMode="email"
                                onSuccess={(data) =>
                                    updateCurrentAuth({ user: data })
                                }
                            />
                        </>
                    )}
                </>
            )}
        </div>
    )
}
