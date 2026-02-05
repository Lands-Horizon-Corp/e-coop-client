import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'

export const useGetUserSettings = () => {
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrg()
    const OR = '0'
    return {
        ...user_organization,
        userOrganization: user_organization,
        ORWithPadding: OR.padStart(user_organization.payment_padding, '0'),
    }
}
export default useGetUserSettings
