import { IJournalVoucherEntryRequest } from '@/modules/journal-voucher-entry'
import { create } from 'zustand'

import { TEntityId } from '@/types'

export interface IJournalVoucherStore {
    selectedJournalVoucherEntry: IJournalVoucherEntryRequest[]
    journalVoucherEntriesDeleted?: TEntityId[]
    setSelectedJournalVoucherEntry: (
        entry: IJournalVoucherEntryRequest[]
    ) => void
    setJournalVoucherEntriesDeleted: (id: TEntityId) => void
    resetJournalVoucherDeleted: () => void
}

export const useJournalVoucherStore = create<IJournalVoucherStore>((set) => ({
    selectedJournalVoucherEntry: [],
    setSelectedJournalVoucherEntry: (entry) =>
        set({ selectedJournalVoucherEntry: entry }),
    setJournalVoucherEntriesDeleted: (id) =>
        set((state) => ({
            journalVoucherEntriesDeleted: [
                ...(state.journalVoucherEntriesDeleted ?? []),
                id,
            ],
        })),
    resetJournalVoucherDeleted: () => set({ journalVoucherEntriesDeleted: [] }),
}))
