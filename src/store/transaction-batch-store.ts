import { create } from 'zustand'

import { ITransactionBatch, ITransactionBatchMinimal } from '@/types'

interface ITransactionBatchStore {
    data: ITransactionBatch | ITransactionBatchMinimal | null
    setData: (data: ITransactionBatch | ITransactionBatchMinimal | null) => void
    reset: () => void
}

export const useTransactionBatchStore = create<ITransactionBatchStore>(
    (set) => ({
        data: null,
        setData: (newData) => {
            set((state) => ({
                data:
                    newData !== null
                        ? {
                              ...state.data,
                              ...newData,
                          }
                        : newData,
            }))
        },
        reset: () => {
            set({ data: null })
        },
    })
)
