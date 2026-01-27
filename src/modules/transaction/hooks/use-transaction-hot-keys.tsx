import { useGetUserSettings } from '@/modules/user-profile'
import { useHotkeys } from 'react-hotkeys-hook'

import { useTransactionContext } from '../context/transaction-context'
import { paymentORResolver } from '../transaction.utils'

export const useHotkeysTransaction = () => {
    const { userOrganization } = useGetUserSettings()

    const {
        navigate,
        form: transactionForm,
        memberScanner,
        selectedMemberId,
        history,
        accountPayment,
        accountPicker,
    } = useTransactionContext()

    useHotkeys(
        'Escape',
        (e) => {
            e.preventDefault()
            navigate.clear()
        },
        { enableOnFormTags: true },
        [navigate.clear]
    )

    useHotkeys(
        'Enter',
        (e) => {
            e.preventDefault()
            if (!selectedMemberId && !memberScanner.open) {
                memberScanner.onOpenChange(true)
            }
        },
        [selectedMemberId, memberScanner.open]
    )
    useHotkeys(
        'Alt + W',
        (e) => {
            e.preventDefault()
            transactionForm.setFocus('reference_number')
        },
        { enableOnFormTags: true },
        [transactionForm]
    )
    useHotkeys(
        'Alt +  E',
        (e) => {
            e.preventDefault()
            const isAuto = !transactionForm.getValues('or_auto_generated')
            transactionForm.setValue('or_auto_generated', isAuto)
            if (isAuto && userOrganization) {
                transactionForm.setValue(
                    'reference_number',
                    paymentORResolver(userOrganization),
                    { shouldDirty: true }
                )
            }
        },
        { enableOnFormTags: true },
        [transactionForm, userOrganization]
    )
    useHotkeys(
        'f12',
        (e) => {
            e.preventDefault()
            if (accountPicker.open || accountPayment.open) return
            history.onOpenChange(!history.open)
        },
        {
            keydown: true,
            enableOnFormTags: true,
        },
        [accountPayment, accountPicker]
    )
}
