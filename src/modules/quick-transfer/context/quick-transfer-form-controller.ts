import { useState } from 'react'

import { IAccount } from '@/modules/account'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { IMemberProfile } from '@/modules/member-profile'
import { useGetAllPaymentType } from '@/modules/payment-type'
import { quickPaymentORResolver } from '@/modules/transaction/transaction.utils'
import { useTransactionReverseSecurityStore } from '@/store/transaction-reverse-security-store'

import { useModalState } from '@/hooks/use-modal-state'

import { TPaymentMode } from '../quick-transfer.types'

interface QuickTransferControllerProps {
    mode: Omit<TPaymentMode, 'payment'>
}
export const useQuickTransferController = ({
    mode,
}: QuickTransferControllerProps) => {
    const openMemberPicker = useModalState()
    const {
        currentAuth: { user_organization },
    } = useAuthUserWithOrgBranch()

    const memberJointModalState = useModalState(false)
    const accountPickerModalState = useModalState(false)
    const paymentTypeModalState = useModalState(false)
    const othersState = useModalState(false)

    const modalTransactionReverseState = useTransactionReverseSecurityStore()

    const [selectedMember, setSelectedMember] = useState<IMemberProfile | null>(
        null
    )
    const [selectedAccount, setSelectedAccount] = useState<IAccount | null>(
        null
    )

    const { data: paymentType } = useGetAllPaymentType()

    const finalOR = quickPaymentORResolver({
        type: mode,
        userOrg: user_organization,
    })

    return {
        selectedMember,
        setSelectedMember,
        openMemberPicker,
        setSelectedAccount,
        selectedAccount,
        user_organization,
        finalOR,
        memberJointModalState,
        accountPickerModalState,
        paymentType,
        paymentTypeModalState,
        othersState,
        modalTransactionReverseState,
    }
}

export type TUseQuickTransferReturn = ReturnType<
    typeof useQuickTransferController
>
