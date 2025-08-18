import { useAuthStore } from '@/store/user-auth-store'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

const NavSignIn = () => {
    const { authStatus } = useAuthStore()

    if (authStatus === 'authorized') return null

    return (
        <Link to={'/auth/sign-in' as string}>
            <Button className="scale-effects rounded-full bg-green-500 text-white hover:bg-green-500">
                Sign-In
            </Button>
        </Link>
    )
}

export default NavSignIn
