import { useAuthUserWithOrg } from '@/store/user-auth-store'

export const useGetUserSettings = () => {
    const { currentAuth: user } = useAuthUserWithOrg()

    const {
        user_organization: {
            user_setting_used_or: userSettingOR,
            user_setting_number_padding: user_setting_number_padding,
        },
    } = user

    return {
        userSettingOR: userSettingOR
            .toString()
            .padStart(user_setting_number_padding, '0'),
    }
}
