import { useModalState } from '@/hooks/use-modal-state'

// 1. Define the hook
export const useTransactionModals = () => {
    return {
        paymentSuccess: useModalState(),
        accountPicker: useModalState(),
        memberScanner: useModalState(),
        ledger: useModalState(),
        accountPayment: useModalState(),
        loanPayment: useModalState(),
        othersCollapsible: useModalState(),
        history: useModalState(),
    }
}

export type TTransactionModals = ReturnType<typeof useTransactionModals>
