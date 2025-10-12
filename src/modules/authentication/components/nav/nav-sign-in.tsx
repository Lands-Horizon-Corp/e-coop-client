import { Link } from '@tanstack/react-router'

import { useAuthStore } from '@/modules/authentication/authgentication.store'

import { FingerPrintIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

const NavSignIn = () => {
    const { authStatus } = useAuthStore()

    if (authStatus === 'authorized') return null

    return (
        <Button asChild className="scale-effects rounded-full cursor-pointer">
            <Link to={'/auth/sign-in' as string}>
                <FingerPrintIcon className="inline mr-1" />
                Sign-In
            </Link>
        </Button>
    )
}

export default NavSignIn
