import { create } from 'zustand'

export interface GeneralLedgerAccountsGroupingStore {
    generalLedgerAccountsGroupingId: string | null

    setGeneralLedgerAccountsGroupingId: (paymentType: string) => void
}
export const useGeneralLedgerStore = create<GeneralLedgerAccountsGroupingStore>(
    (set) => ({
        generalLedgerAccountsGroupingId: null,

        setGeneralLedgerAccountsGroupingId: (paymentType) =>
            set({ generalLedgerAccountsGroupingId: paymentType }),
    })
)
