// import { IUserData } from '@/types/coop-types'

// TODO: Import User Interface and use it here
export const getUsersAccountTypeRedirectPage = (
    currentUser: /*IUserData*/ any
) => {
    const { accountType } = currentUser
    switch (accountType) {
        case 'Admin':
            return '/admin'
        case 'Member':
            return '/member'
        case 'Employee':
            return '/employee'
        case 'Owner':
            return '/owner'
        default:
            return '/'
    }
}

export const isUserUnverified = (userData: /*IUserData*/ any) => {
    return userData.status !== 'Verified'
}

export const isUserHasUnverified = (userData: /*IUserData*/ any) => {
    return (
        userData.status === 'Pending' ||
        !userData.isEmailVerified ||
        !userData.isContactVerified
    )
}
