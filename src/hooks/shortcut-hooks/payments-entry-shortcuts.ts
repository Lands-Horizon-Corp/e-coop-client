import { useMemo } from 'react'

import { PaymentsDataStore } from '@/store/transaction/payments-entry-store'

import { IPaymentsEntry } from '@/types'

import { useShortcut } from './use-shorcuts'

type usePaymentsShortcutsTypes = Pick<
    PaymentsDataStore,
    'setSelectedMember' | 'selectedPayments'
> & {
    hadSelectedPayments: boolean
    handleSubmitPayment: (payments: IPaymentsEntry[]) => void
    handleOpenCreateModal: (type: 'payment' | 'deposit' | 'withdraw') => void
    isPendingCreatePayments: boolean
    isPendingCheckClearing: boolean
}

const usePaymentsShortcuts = ({
    hadSelectedPayments,
    setSelectedMember,
    handleSubmitPayment,
    selectedPayments,
    handleOpenCreateModal,
    isPendingCheckClearing,
}: usePaymentsShortcutsTypes) => {
    const handleD = useMemo(
        () => () => {
            if (hadSelectedPayments) {
                setSelectedMember(null)
            }
        },
        [hadSelectedPayments, setSelectedMember]
    )

    const handleS = useMemo(
        () => () => {
            if (
                hadSelectedPayments ||
                hadSelectedPayments ||
                isPendingCheckClearing
            )
                return
            handleSubmitPayment(selectedPayments)
        },
        [
            handleSubmitPayment,
            selectedPayments,
            hadSelectedPayments,
            isPendingCheckClearing,
        ]
    )

    const handleF1 = useMemo(
        () => () => {
            handleOpenCreateModal('payment')
        },
        [handleOpenCreateModal]
    )

    useShortcut('d', handleD, {
        disableTextInputs: true,
        disableActiveButton: true,
    })
    useShortcut('s', handleS, {
        disableTextInputs: true,
        disableActiveButton: true,
    })
    useShortcut('f1', handleF1, {
        disableTextInputs: true,
        disableActiveButton: true,
    })
}

export default usePaymentsShortcuts
