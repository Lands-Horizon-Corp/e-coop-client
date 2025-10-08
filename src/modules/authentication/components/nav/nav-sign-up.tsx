import { Link } from '@tanstack/react-router'

import { useAuthStore } from '@/modules/authentication/authgentication.store'

import { Button } from '@/components/ui/button'

const NavSignUp = () => {
    const { authStatus } = useAuthStore()

    if (authStatus === 'authorized') return null

    return (
        <Link to={'/auth/sign-up' as string}>
            <Button
                className="scale-effects cursor-pointer rounded-full"
                variant="outline"
            >
                Sign-Up
            </Button>
        </Link>
    )
}

export default NavSignUp
