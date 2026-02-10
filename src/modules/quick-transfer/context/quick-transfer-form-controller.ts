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

    const {
        settings_accounting_withdraw_default_value,
        settings_accounting_deposit_default_value,
        settings_payment_type_default_value_id,
        allow_withdraw_negative_balance,
    } = user_organization

    const modals = {
        memberJointState: useModalState(false),
        accountPickerState: useModalState(false),
        othersState: useModalState(false),
        paymentTypeModalState: useModalState(false),
    }

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

    const isAllowUserReferenceNumberInput =
        user_organization.branch.branch_setting.withdraw_allow_user_input

    const defaultAccount =
        mode === 'withdraw'
            ? settings_accounting_withdraw_default_value
            : settings_accounting_deposit_default_value

    return {
        selectedMember,
        setSelectedMember,
        openMemberPicker,
        setSelectedAccount,
        selectedAccount,
        user_organization,
        finalOR,
        ...modals,
        paymentType,
        modalTransactionReverseState,
        branchSetting: user_organization.branch.branch_setting,
        settings_accounting_withdraw_default_value,
        settings_accounting_deposit_default_value,
        settings_payment_type_default_value_id,
        allow_withdraw_negative_balance,
        allowUserInputreferenceNumber: isAllowUserReferenceNumberInput,
        defaultReferenceNumber: isAllowUserReferenceNumberInput
            ? '000000'
            : finalOR,
        defaultAccount,
    }
}

export type TUseQuickTransferReturn = ReturnType<
    typeof useQuickTransferController
>
