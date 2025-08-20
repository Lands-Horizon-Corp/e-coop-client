import { Link } from '@tanstack/react-router'

import { useAuthStore } from '@/store/user-auth-store'

import { Button } from '@/components/ui/button'

const NavSignIn = () => {
    const { authStatus } = useAuthStore()

    if (authStatus === 'authorized') return null

    return (
        <Button className="scale-effects rounded-full cursor-pointer" asChild>
            <Link to={'/auth/sign-in' as string}>Sign-In</Link>
        </Button>
    )
}

export default NavSignIn
