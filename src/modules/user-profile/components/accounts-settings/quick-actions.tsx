'use client'

import { useRouter } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

import { useSignOut } from '@/modules/authentication'
import { useAuthUser } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    DoorExitIcon,
    LinkIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'

export const QuickActions = () => {
    const router = useRouter()
    const { resetAuth } = useAuthUser()
    const { onOpen } = useConfirmModalStore()

    const { mutate: handleSignout, isPending: isSigningOut } = useSignOut({
        options: {
            onSuccess: () => {
                resetAuth()
                router.navigate({ to: '/auth/sign-in' as string })
            },
        },
    })

    const handleSignOutClick = () => {
        if (isSigningOut) return

        onOpen({
            title: 'Sign Out',
            description: 'Are you sure you want to sign out?',
            onConfirm: () => handleSignout(),
        })
    }

    return (
        <div className="space-y-1">
            <p className="font-medium text-muted-foreground uppercase tracking-wide mb-1">
                <LinkIcon className="size-5 inline mr-2" />
                Actions
            </p>

            <div className="space-y-0.5">
                <Link
                    to="/onboarding"
                    className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent"
                >
                    <span>Onboarding</span>
                    <ArrowRightIcon className="size-3" />
                </Link>

                <button
                    onClick={handleSignOutClick}
                    disabled={isSigningOut}
                    className="flex items-center gap-1.5 px-2 py-1 text-destructive hover:text-destructive/80 transition-colors duration-200 disabled:opacity-50 rounded-md hover:bg-accent w-full text-left"
                >
                    <span>Sign Out</span>
                    {isSigningOut ? (
                        <LoadingSpinner className="size-3" />
                    ) : (
                        <DoorExitIcon className="size-3" />
                    )}
                </button>

                <button
                    onClick={() => router.history.back()}
                    className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-accent w-full text-left"
                >
                    <span>Back</span>
                    <ArrowLeftIcon className="size-3" />
                </button>
            </div>
        </div>
    )
}
