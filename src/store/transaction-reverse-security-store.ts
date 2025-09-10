import { create } from 'zustand'

type ITransactionReverseSecurityStore = {
    isOpen: boolean
    onClose: () => void

    onOpenReverseRequestAction: (
        data: TransactionSecurityModalDataProps
    ) => void
    modalData?: TransactionSecurityModalDataProps
}

type TransactionSecurityModalDataProps = {
    onSuccess: () => void
    title?: string
}

export const useTransactionReverseSecurityStore =
    create<ITransactionReverseSecurityStore>((set) => ({
        isOpen: false,
        modalData: { title: '', onSuccess: () => {} },
        onClose: () => set({ isOpen: false }),
        onOpenReverseRequestAction: (modalData) =>
            set({ isOpen: true, modalData }),
    }))
