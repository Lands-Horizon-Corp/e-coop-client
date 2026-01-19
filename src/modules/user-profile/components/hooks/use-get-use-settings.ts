import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'

export const useGetUserSettings = () => {
    const { currentAuth: user } = useAuthUserWithOrg()

    return {
        ...user.user_organization,
        userOrganization: user.user_organization,
    }
}
export default useGetUserSettings
