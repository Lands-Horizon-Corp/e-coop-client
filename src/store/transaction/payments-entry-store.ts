import { create } from 'zustand'

import { IAccountsRequest, IMemberProfile } from '@/types'

// Payments Data
export interface PaymentsDataStore {
    selectedMember: IMemberProfile | null
    ORNumber: string
    selectedAccounts: IAccountsRequest | null
    focusTypePayment: string | null

    setSelectedMember: (member: IMemberProfile | null) => void
    setORNumber: (orNumber: string) => void
    setSelectedAccounts: (accounts: IAccountsRequest | null) => void
    setFocusTypePayment: (payment: string) => void
}

export const usePaymentsDataStore = create<PaymentsDataStore>((set) => ({
    selectedMember: null,
    selectedAccounts: null,
    ORNumber: '',
    selectedPayments: [],
    focusTypePayment: 'payment',

    setSelectedMember: (member) => set({ selectedMember: member }),
    setORNumber: (orNumber) => set({ ORNumber: orNumber }),

    setSelectedAccounts: (accounts: IAccountsRequest | null) =>
        set({ selectedAccounts: accounts }),
    setFocusTypePayment: (payment) => set({ focusTypePayment: payment }),
}))

// Payments Modal
export interface PaymentsModalStore {
    transactionType: string | null
    openPaymentsEntryModal: boolean
    openCheckClearingFormModal: boolean
    openWithdrawFormModal: boolean
    openDepositCheckClearingFormModal: boolean

    setTransactionType: (paymentType: string) => void
    setOpenPaymentsEntryModal: (open: boolean) => void
    setOpenCheckClearingFormModal: (isOpen: boolean) => void
}

export const usePaymentsModalStore = create<PaymentsModalStore>((set) => ({
    transactionType: 'payment',
    openCheckClearingFormModal: false,
    openWithdrawFormModal: false,
    openDepositCheckClearingFormModal: false,
    openPaymentsEntryModal: false,

    setTransactionType: (paymentType) => set({ transactionType: paymentType }),
    setOpenPaymentsEntryModal: (open) => set({ openPaymentsEntryModal: open }),
    setOpenCheckClearingFormModal: (isOpen) =>
        set({ openCheckClearingFormModal: isOpen }),
}))
