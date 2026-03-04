import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import { useModalState } from '@/hooks/use-modal-state'

export const useGeneralLedgerController = () => {
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()
    //

    const modals = {
        onCreateEditGeneralLedger: useModalState(),
        onAddAccount: useModalState(),
    }

    return {
        ...modals,
        userOrganization: user_organization,
    }
}

export type TGeneralLedgerController = ReturnType<
    typeof useGeneralLedgerController
>
