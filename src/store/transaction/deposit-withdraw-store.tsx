import { Dispatch, SetStateAction } from 'react'

import { IAccount } from '@/types/coop-types/accounts/account'
import { create } from 'zustand'

import { IMemberProfile } from '@/types'

export interface DepositWithdrawStore {
    selectedMember: IMemberProfile | null
    openMemberPicker: boolean
    selectedAccount?: IAccount
    setOpenMemberPicker: Dispatch<SetStateAction<boolean>>
    setSelectedMember: (member: IMemberProfile | null) => void
    setSelectedAccount: (accountId?: IAccount) => void
}

export const useDepositWithdrawStore = create<DepositWithdrawStore>(
    (set, get) => ({
        selectedMember: null,
        openMemberPicker: false,
        selectedAccount: undefined,
        setSelectedMember: (member) => set({ selectedMember: member }),
        setOpenMemberPicker: (open) =>
            set({
                openMemberPicker:
                    typeof open === 'function'
                        ? open(get().openMemberPicker)
                        : open,
            }),
        setSelectedAccount: (account) =>
            set({
                selectedAccount: account,
            }),
    })
)
