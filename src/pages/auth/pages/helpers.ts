import { toast } from 'sonner'
import { TAccountStatus } from '@/types/coop-types'

export const toastAccountStatus = (accountStatus: TAccountStatus) => {
    switch (accountStatus) {
        case 'Pending':
            return toast.warning('Account pending')
        case 'Verified':
            return toast.success('Account Verified')
        case 'Not Allowed':
            return toast.error(
                'Account canceled, You are not allowed to sign in.'
            )
        default:
            return toast.error('Could not identify accountr status')
    }
}
