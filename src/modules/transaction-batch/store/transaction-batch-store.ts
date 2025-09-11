import {
    ITransactionBatch,
    ITransactionBatchMinimal,
} from '@/modules/transaction-batch'
import { create } from 'zustand'

interface ITransactionBatchStore {
    data: ITransactionBatch | ITransactionBatchMinimal | null
    hasNoTransactionBatch: boolean
    setData: (data: ITransactionBatch | ITransactionBatchMinimal | null) => void
    reset: () => void
}

export const useTransactionBatchStore = create<ITransactionBatchStore>(
    (set) => ({
        data: null,
        hasNoTransactionBatch: false,

        setData: (newData) => {
            set((state) => {
                if (newData !== null) {
                    return {
                        data: {
                            ...state.data,
                            ...newData,
                        },
                        hasNoTransactionBatch: true,
                    }
                }
                return { data: null, hasNoTransactionBatch: false }
            })
        },

        reset: () => {
            set({ data: null, hasNoTransactionBatch: false })
        },
    })
)
