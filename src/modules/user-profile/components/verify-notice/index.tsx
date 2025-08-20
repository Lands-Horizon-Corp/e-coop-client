import { useLocation } from '@tanstack/react-router'

import { useAuthUser } from '@/store/user-auth-store'

import VerifyContactBar from './verify-contact-bar'

const VerifyNotice = () => {
    const { pathname } = useLocation()

    const {
        updateCurrentAuth,
        currentAuth: { user },
    } = useAuthUser()

    if (pathname.startsWith('/account/verify')) return

    return (
        <>
            {!user.is_email_verified && (
                <VerifyContactBar
                    key="verify-bar-email"
                    verifyMode="email"
                    onSuccess={(newUserData) =>
                        updateCurrentAuth({ user: newUserData })
                    }
                />
            )}
            {!user.is_contact_verified && (
                <VerifyContactBar
                    key="verify-bar-mobile"
                    verifyMode="mobile"
                    onSuccess={(newUserData) =>
                        updateCurrentAuth({ user: newUserData })
                    }
                />
            )}
        </>
    )
}

export default VerifyNotice
