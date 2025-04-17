import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

import { useSignOut } from '@/hooks/api-hooks/use-auth'
import { useUserAuthStore } from '@/store/user-auth-store'
import useConfirmModalStore from '@/store/confirm-modal-store'

const NavSignOut = () => {
    const router = useRouter()
    const { onOpen } = useConfirmModalStore()
    const { authStatus, currentUser, setCurrentUser } = useUserAuthStore()

    const { mutate: handleSignout, isPending: isSigningOut } = useSignOut({
        onSuccess: () => {
            setCurrentUser(null)
            router.navigate({ to: '/auth/sign-in' })
            toast.success('Signed out')
        },
    })

    if (authStatus === 'unauthorized' || !currentUser) return null

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
            className="scale-effects rounded-full"
        >
            Sign-Out
        </Button>
    )
}

export default NavSignOut
