import { Button } from '@/components/ui/button'
import { useUserAuthStore } from '@/store/user-auth-store'
import { Link } from '@tanstack/react-router'

const NavSignIn = () => {
    const { authStatus } = useUserAuthStore()

    if (authStatus === 'authorized') return null

    return (
        <Link to="/auth/sign-in">
            <Button className="scale-effects rounded-full bg-green-500 text-white hover:bg-green-500">
                Sign-In
            </Button>
        </Link>
    )
}

export default NavSignIn
