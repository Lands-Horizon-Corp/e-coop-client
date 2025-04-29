import { IUserData } from '@/types'
import VerifyContactBar from './verify-contact-bar'
import { useRouterState } from '@tanstack/react-router'

interface Props {
    currentUser: IUserData
    onSuccess: (newUserData: IUserData) => void
}

const VerifyNotice = ({ currentUser, onSuccess }: Props) => {
    const hash = useRouterState({
        select: ({ location: { hash } }) => hash,
    })

    if (!currentUser || hash === 'security') return null

    return (
        <>
            {!currentUser.isEmailVerified && !currentUser.isEmailVerified && (
                <VerifyContactBar
                    key="verify-bar-email"
                    verifyMode="email"
                    onSuccess={onSuccess}
                />
            )}
            {!currentUser.isContactVerified && currentUser.isEmailVerified && (
                <VerifyContactBar
                    key="verify-bar-mobile"
                    verifyMode="mobile"
                    onSuccess={onSuccess}
                />
            )}
        </>
    )
}

export default VerifyNotice
