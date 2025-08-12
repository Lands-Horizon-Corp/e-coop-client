import { create } from 'zustand'

import { IMemberProfile, TPaymentMode } from '@/types'

// Payments Data
export interface PaymentsDataStore {
    focusTypePayment: TPaymentMode
    setSelectedMember: (member: IMemberProfile | null) => void
    selectedMember: IMemberProfile | null
    openPaymentsEntryModal: boolean
    setFocusTypePayment: (payment: TPaymentMode) => void
    setOpenPaymentsEntryModal: (open: boolean) => void
}

export const usePaymentsDataStore = create<PaymentsDataStore>((set) => ({
    focusTypePayment: 'payment',
    selectedMember: null,
    openPaymentsEntryModal: false,
    setSelectedMember: (member) => set({ selectedMember: member }),
    setOpenPaymentsEntryModal: (open) => set({ openPaymentsEntryModal: open }),
    setFocusTypePayment: (payment) => set({ focusTypePayment: payment }),
}))
