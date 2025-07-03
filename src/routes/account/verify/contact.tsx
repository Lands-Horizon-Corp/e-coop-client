import { useState } from 'react'

import { useAuthUser } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import VerifyForm from '@/components/forms/auth-forms/verify-form'
import { BadgeCheckFillIcon, BadgeQuestionFillIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { useOTPVerification } from '@/hooks/api-hooks/use-auth'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IUserBase } from '@/types'

export const Route = createFileRoute('/account/verify/contact')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
        updateCurrentAuth,
    } = useAuthUser()

    useSubscribe<IUserBase>(`user.update.${user.id}`, (newUserData) => {
        updateCurrentAuth({ user: newUserData })
    })

    const [verifying, setVerifying] = useState(false)

    const { mutate: sendcode, isPending } = useOTPVerification({
        verifyMode: 'mobile',
        onSuccess: () => {
            setVerifying(true)
        },
    })

    return (
        <div>
            {user.is_contact_verified && (
                <div>
                    <div className="flex flex-col items-center gap-y-4 py-4 text-center">
                        <div className="relative p-8">
                            <BadgeCheckFillIcon className="size-[53px] text-green-500" />
                            <div className="absolute inset-0 rounded-full bg-green-500/20" />
                            <div className="absolute inset-5 rounded-full bg-green-500/20" />
                        </div>
                        <p className="text-xl font-medium">
                            Contact Number Verified
                        </p>
                        <span className="bg-popoverx rounded-md bg-primary/10 px-2 py-1">
                            {user.contact_number}
                        </span>{' '}
                        <p className="text-sm text-foreground/70">
                            Your contact number has been verified.
                        </p>
                    </div>
                </div>
            )}
            {!user.is_contact_verified && (
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
                                    Contact number verification needed
                                </p>
                                <p className="text-sm text-foreground/70">
                                    Your contact number{' '}
                                    <span className="bg-popoverx rounded-md bg-orange-500/10 px-2 py-1">
                                        {user.contact_number}
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
                                verifyMode="mobile"
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
