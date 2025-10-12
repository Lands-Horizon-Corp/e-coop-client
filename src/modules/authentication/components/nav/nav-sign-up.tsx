import { Link } from '@tanstack/react-router'

import { useAuthStore } from '@/modules/authentication/authgentication.store'

import { FingerprintScanIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

const NavSignUp = () => {
    const { authStatus } = useAuthStore()

    if (authStatus === 'authorized') return null

    return (
        <Link to="/auth/sign-up">
            <Button
                className="scale-effects cursor-pointer rounded-full"
                variant="outline"
            >
                <FingerprintScanIcon className="inline mr-1" />
                Sign-Up
            </Button>
        </Link>
    )
}

export default NavSignUp
