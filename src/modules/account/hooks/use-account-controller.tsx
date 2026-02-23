import { useEffect, useState } from 'react'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import { useModalState } from '@/hooks/use-modal-state'

import { useGetAllAccount } from '../account.service'
import { IAccount } from '../account.types'

export const useAccountController = () => {
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    const [accounts, setAccounts] = useState<IAccount[]>([])

    const { settings_payment_type_default_value } = user_organization

    const getAllAccounts = useGetAllAccount({
        mode: 'all',
    })

    useEffect(() => {
        if (!getAllAccounts || !getAllAccounts.data) return
        if (getAllAccounts.data) {
            setAccounts(getAllAccounts.data)
        }
    }, [getAllAccounts, setAccounts])

    const modals = {
        createModal: useModalState(false),
        openEdit: useModalState(false),
    }

    return {
        ...modals,
        user_organization,
        settings_payment_type_default_value,
        accountsQuery: getAllAccounts,
        setAccounts,
        accounts,
    }
}

export type TAccountControllerReturn = ReturnType<typeof useAccountController>
