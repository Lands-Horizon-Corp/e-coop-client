import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAuthStore } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { Button } from '@/components/ui/button'

import { useSignOut } from '../../authentication.service'

const NavSignOut = () => {
    const router = useRouter()
    const { onOpen } = useConfirmModalStore()
    const {
        authStatus,
        currentAuth: { user },
        resetAuth,
    } = useAuthStore()

    const { mutate: handleSignout, isPending: isSigningOut } = useSignOut({
        options: {
            onSuccess: () => {
                resetAuth()
                router.navigate({ to: '/auth/sign-in' as string })
                toast.success('Signed out')
            },
        },
    })

    if (authStatus === 'unauthorized' || !user) return null

    return (
        <Button
            variant="outline"
            disabled={isSigningOut}
            onClick={() =>
                onOpen({
                    title: 'Sign Out',
                    description: 'Are you sure you want to sign out?',
                    onConfirm: () => handleSignout(),
                })
            }
            className="scale-effects rounded-full cursor-pointer"
        >
            Sign-Out
        </Button>
    )
}

export default NavSignOut
