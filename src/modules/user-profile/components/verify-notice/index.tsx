import { useLocation } from '@tanstack/react-router'

import { useAuthUser } from '@/modules/authentication/authgentication.store'

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
                    onSuccess={(newUserData) =>
                        updateCurrentAuth({ user: newUserData })
                    }
                    verifyMode="email"
                />
            )}
            {!user.is_contact_verified && (
                <VerifyContactBar
                    key="verify-bar-mobile"
                    onSuccess={(newUserData) =>
                        updateCurrentAuth({ user: newUserData })
                    }
                    verifyMode="mobile"
                />
            )}
        </>
    )
}

export default VerifyNotice
