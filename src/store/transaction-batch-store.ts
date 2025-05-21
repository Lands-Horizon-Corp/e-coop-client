import { ITransactionBatch, ITransactionBatchMinimal } from '@/types'
import { create } from 'zustand'

interface ITransactionBatchStore {
    data: ITransactionBatch | ITransactionBatchMinimal | null
    setData: (data: ITransactionBatch | ITransactionBatchMinimal) => void
    reset: () => void
}

export const useTransactionBatchStore = create<ITransactionBatchStore>(
    (set) => ({
        data: null,
        setData: (newData) => {
            set((state) => ({
                data: {
                    ...state.data,
                    ...newData,
                },
            }))
        },
        reset: () => {
            set({ data: null })
        },
    })
)
