import VerifyNotice from './verify-notice'
import AccountSettings from './account-settings'
import AccountSecurity from './account-security'
import AccountTransactions from './account-transactions'
import AccountProfileBanner from './account-profile-banner'
import AccountModeOfPayment from './account-mode-of-payment'
import AccountProfileNavigation from './account-profile-navigation'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { useUserAuthStore } from '@/store/user-auth-store'

const AccountProfile = ({ className }: IClassProps) => {
    const { currentUser, setCurrentUser } = useUserAuthStore()

    if (!currentUser) return <span>Unauthorized</span>

    return (
        <div
            className={cn(
                'flex w-full max-w-full flex-1 flex-col gap-y-4 pb-6 sm:max-w-4xl',
                className
            )}
        >
            <AccountProfileBanner
                currentUser={currentUser}
                updateUserData={setCurrentUser}
            />

            <AccountProfileNavigation currentUser={currentUser} />

            <VerifyNotice
                currentUser={currentUser}
                onSuccess={(newUserData) => setCurrentUser(newUserData)}
            />

            <AccountSettings
                currentUser={currentUser}
                onSave={(newUserData) => setCurrentUser(newUserData)}
            />
            <AccountSecurity />
            <AccountTransactions />
            <AccountModeOfPayment />
        </div>
    )
}

export default AccountProfile
