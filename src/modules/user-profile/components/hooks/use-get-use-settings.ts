import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'

export const useGetUserSettings = () => {
    const { currentAuth: user } = useAuthUserWithOrg()
    const OR = '0'
    return {
        ...user.user_organization,
        userOrganization: user.user_organization,
        ORWithPadding: OR.padStart(user.user_organization.payment_padding, '0'),
    }
}
export default useGetUserSettings
