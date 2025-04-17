import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useUserAuthStore } from '@/store/user-auth-store'

const NavSignUp = () => {
    const { authStatus } = useUserAuthStore()

    if (authStatus === 'authorized') return null

    return (
        <Link to="/auth/sign-up">
            <Button variant="outline" className="scale-effects rounded-full">
                Sign-Up
            </Button>
        </Link>
    )
}

export default NavSignUp
