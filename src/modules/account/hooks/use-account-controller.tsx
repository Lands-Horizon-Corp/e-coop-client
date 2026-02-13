import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import { useModalState } from '@/hooks/use-modal-state'

export const useAccountController = () => {
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    const { settings_payment_type_default_value } = user_organization

    const modals = {
        createModal: useModalState(false),
    }

    return {
        ...modals,
        user_organization,
        settings_payment_type_default_value,
    }
}

export type TAccountControllerReturn = ReturnType<typeof useAccountController>
