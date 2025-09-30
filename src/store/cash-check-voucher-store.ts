import { ICashCheckVoucherEntryRequest } from '@/modules/cash-check-voucher-entry'
import { create } from 'zustand'

import { TEntityId } from '@/types'

export interface ICashCheckVoucherStore {
    selectedCashCheckVoucherEntry: ICashCheckVoucherEntryRequest[]
    cashCheckVoucherEntriesDeleted?: TEntityId[]
    setSelectedCashCheckVoucherEntry: (
        entry: ICashCheckVoucherEntryRequest[]
    ) => void
    setCashCheckVoucherEntriesDeleted: (id: TEntityId) => void
    resetCashCheckVoucherDeleted: () => void
}

export const useCashCheckVoucherStore = create<ICashCheckVoucherStore>(
    (set) => ({
        selectedCashCheckVoucherEntry: [],
        cashCheckVoucherEntriesDeleted: [],
        setSelectedCashCheckVoucherEntry: (entry) =>
            set({ selectedCashCheckVoucherEntry: entry }),
        setCashCheckVoucherEntriesDeleted: (id) =>
            set((state) => ({
                cashCheckVoucherEntriesDeleted: [
                    ...(state.cashCheckVoucherEntriesDeleted ?? []),
                    id,
                ],
            })),
        resetCashCheckVoucherDeleted: () =>
            set({ cashCheckVoucherEntriesDeleted: [] }),
    })
)
