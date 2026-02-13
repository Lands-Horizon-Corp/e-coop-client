import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import { useModalState } from '@/hooks/use-modal-state'

import { useGetAllAccount } from '../account.service'

export const useAccountController = () => {
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    const { settings_payment_type_default_value } = user_organization
    const getAllAccounts = useGetAllAccount({
        mode: 'all',
    })

    const modals = {
        createModal: useModalState(false),
    }

    return {
        ...modals,
        user_organization,
        settings_payment_type_default_value,
        accountsQuery: getAllAccounts,
    }
}

export type TAccountControllerReturn = ReturnType<typeof useAccountController>
