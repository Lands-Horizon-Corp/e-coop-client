import { useCallback } from 'react'

import { useShortcut } from '@/hooks/use-shorcuts'

type PaymentType = 'payment' | 'deposit' | 'withdraw'

type UsePaymentsShortcutsTypes = {
    hasSelectedMember: boolean
    openPaymentWithTransactionModal: boolean
    openSuccessModal: boolean
    hasSelectedTransactionId: boolean
    setOpenPaymentWithTransactionModal: (open: boolean) => void
    setOpenMemberPicker: (open: boolean) => void
    setFocusTypePayment: (type: PaymentType) => void
    handleResetAll: () => void
    setSelectedMember: () => void
    isMediaOpen: boolean
    hasFocusedGeneralLedger: boolean
}

export const useTransactionShortcuts = (props: UsePaymentsShortcutsTypes) => {
    const {
        hasSelectedMember,
        openPaymentWithTransactionModal,
        openSuccessModal,
        hasSelectedTransactionId,
        setOpenPaymentWithTransactionModal,
        setFocusTypePayment,
        handleResetAll,
        setOpenMemberPicker,
        setSelectedMember,
        isMediaOpen,
        hasFocusedGeneralLedger,
    } = props

    const canOpenPaymentModal = useCallback(
        (type: PaymentType) => {
            if (!hasSelectedMember) return
            setOpenPaymentWithTransactionModal(true)
            setFocusTypePayment(type)
        },
        [
            hasSelectedMember,
            setOpenPaymentWithTransactionModal,
            setFocusTypePayment,
        ]
    )

    const canResetAll = useCallback(() => {
        if (
            hasSelectedTransactionId &&
            openSuccessModal &&
            openPaymentWithTransactionModal &&
            isMediaOpen &&
            hasFocusedGeneralLedger
        )
            return
        handleResetAll()
    }, [
        hasSelectedTransactionId,
        openSuccessModal,
        openPaymentWithTransactionModal,
        handleResetAll,
        isMediaOpen,
        hasFocusedGeneralLedger,
    ])

    const canSelectMember = useCallback(() => {
        if (
            hasSelectedTransactionId ||
            openSuccessModal ||
            openPaymentWithTransactionModal ||
            hasSelectedMember ||
            isMediaOpen
        )
            return
        setOpenMemberPicker(true)
    }, [
        hasSelectedTransactionId,
        openSuccessModal,
        openPaymentWithTransactionModal,
        hasSelectedMember,
        isMediaOpen,
        setOpenMemberPicker,
    ])

    const canUnselectMember = useCallback(() => {
        if (
            openSuccessModal ||
            openPaymentWithTransactionModal ||
            isMediaOpen ||
            hasSelectedTransactionId
        )
            return
        setSelectedMember()
    }, [
        openSuccessModal,
        openPaymentWithTransactionModal,
        setSelectedMember,
        hasSelectedTransactionId,
        isMediaOpen,
    ])

    useShortcut('F1', (e) => {
        e.preventDefault()
        canOpenPaymentModal('payment')
    })
    useShortcut('F2', () => canOpenPaymentModal('deposit'))
    useShortcut('F3', (e) => {
        e.preventDefault()
        canOpenPaymentModal('withdraw')
    })
    useShortcut('enter', canSelectMember, {
        disableTextInputs: true,
        disableActiveButton: true,
    })
    useShortcut('Escape', canResetAll, {
        disableActiveButton: true,
        disableTextInputs: true,
    })
    useShortcut(
        'd',
        (e) => {
            e.preventDefault()
            canUnselectMember()
        },
        { disableActiveButton: true, disableTextInputs: true }
    )
}
export default useTransactionShortcuts
