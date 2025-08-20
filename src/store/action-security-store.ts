import { ReactNode } from 'react'
import { toast } from 'sonner'

import { create } from 'zustand'

import { useAuthStore } from '../modules/authentication/authgentication.store.ts'

interface IConfirmModalOnOpenData {
    title: string | ReactNode
    description?: string | ReactNode
    onSuccess: () => void
}

interface IConfirmModalStore {
    isOpen: boolean
    modalData: IConfirmModalOnOpenData
    onOpenSecurityAction: (newModalData: IConfirmModalOnOpenData) => void
    onClose: () => void
}

const useActionSecurityStore = create<IConfirmModalStore>((set) => ({
    isOpen: false,
    modalData: { title: '', description: '', onSuccess: () => {} },
    onOpenSecurityAction: (newModalData) => {
        const {
            authStatus,
            currentAuth: { user },
        } = useAuthStore.getState()

        if (authStatus !== 'authorized' || !user) {
            toast.warning('User is not authorized/not logged in.')
            return
        }

        set({
            isOpen: true,
            modalData: newModalData,
        })
    },
    onClose: () => set({ isOpen: false }),
}))

export default useActionSecurityStore
