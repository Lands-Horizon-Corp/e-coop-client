import { useAuthUser } from '@/store/user-auth-store'

import ImageDisplay from '../image-display'

const AccountSettingsUserBanner = () => {
    const {
        currentAuth: { user },
    } = useAuthUser()
    return (
        <div className="flex items-center gap-x-4 rounded-2xl p-4">
            <ImageDisplay
                className="size-12 rounded-full sm:size-16"
                fallbackClassName=""
                src={user.media?.download_url}
            />
            <div className="space-y-0.5">
                <div className="flex gap-x-2">
                    <p className="text-2xl font-medium">{user.user_name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Manage Account Settings
                </p>
            </div>
        </div>
    )
}

export default AccountSettingsUserBanner
