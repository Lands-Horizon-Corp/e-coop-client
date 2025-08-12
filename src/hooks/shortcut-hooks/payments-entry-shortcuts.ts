import { useCallback } from 'react'

import { useShortcut } from './use-shorcuts'

type usePaymentsShortcutsTypes = {
    hasSelectedMember: boolean
    openPaymentWithTransactionModal: boolean
    openSuccessModal: boolean
    hasSelectedTransactionId: boolean
    setOpenPaymentWithTransactionModal: (open: boolean) => void
    setFocusTypePayment: (type: 'payment' | 'deposit' | 'withdraw') => void
    handleResetAll: () => void
}

export const useTransactionShortcuts = ({
    hasSelectedMember,
    openPaymentWithTransactionModal,
    openSuccessModal,
    hasSelectedTransactionId,
    setOpenPaymentWithTransactionModal,
    setFocusTypePayment,
    handleResetAll,
}: usePaymentsShortcutsTypes) => {
    const handleF1 = useCallback(
        (e: KeyboardEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (hasSelectedMember) {
                setOpenPaymentWithTransactionModal(true)
                setFocusTypePayment('payment')
            }
        },
        [
            hasSelectedMember,
            setOpenPaymentWithTransactionModal,
            setFocusTypePayment,
        ]
    )

    // New handler for 'F2': Opens the deposit modal.
    const handleF2 = useCallback(() => {
        if (hasSelectedMember) {
            setOpenPaymentWithTransactionModal(true)
            setFocusTypePayment('deposit')
        }
    }, [
        hasSelectedMember,
        setOpenPaymentWithTransactionModal,
        setFocusTypePayment,
    ])

    // New handler for 'F3': Opens the withdraw modal.
    const handleF3 = useCallback(() => {
        if (hasSelectedMember) {
            setOpenPaymentWithTransactionModal(true)
            setFocusTypePayment('withdraw')
        }
    }, [
        hasSelectedMember,
        setOpenPaymentWithTransactionModal,
        setFocusTypePayment,
    ])

    const handleEscape = useCallback(() => {
        if (
            hasSelectedTransactionId &&
            !openSuccessModal &&
            !openPaymentWithTransactionModal
        ) {
            handleResetAll()
        }
    }, [
        openPaymentWithTransactionModal,
        openSuccessModal,
        hasSelectedTransactionId,
        handleResetAll,
    ])

    useShortcut('F1', handleF1, { disableTextInputs: true })
    useShortcut('F2', handleF2, { disableTextInputs: true })
    useShortcut('F3', handleF3, { disableTextInputs: true })
    useShortcut('Escape', handleEscape, {
        disableActiveButton: true,
        disableTextInputs: true,
    })
}
