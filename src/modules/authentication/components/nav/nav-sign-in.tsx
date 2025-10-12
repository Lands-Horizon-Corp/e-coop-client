import { Link } from '@tanstack/react-router'

import { useAuthStore } from '@/modules/authentication/authgentication.store'

import { FingerPrintIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

const NavSignIn = () => {
    const { authStatus } = useAuthStore()

    if (authStatus === 'authorized') return null

    return (
        <Link to="/auth/sign-in">
            <Button
                asChild
                className="scale-effects rounded-full cursor-pointer"
            >
                <FingerPrintIcon className="inline mr-1" />
                Sign-In
            </Button>
        </Link>
    )
}

export default NavSignIn
