import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/user-auth-store'

const NavSignUp = () => {
    const { authStatus } = useAuthStore()

    if (authStatus === 'authorized') return null

    return (
        <Link to={'/auth/sign-up' as string}>
            <Button variant="outline" className="scale-effects rounded-full">
                Sign-Up
            </Button>
        </Link>
    )
}

export default NavSignUp
