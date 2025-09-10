import { ReactNode } from 'react'

import { create } from 'zustand'

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
        // const {
        //     authStatus,
        //     currentAuth: { user },
        // } = useAuthStore.getState()

        // if (authStatus !== 'authorized' || !user) {
        //     toast.warning('User is not authorized/not logged in.')
        //     return
        // }

        set({
            isOpen: true,
            modalData: newModalData,
        })
    },
    onClose: () => set({ isOpen: false }),
}))

export default useActionSecurityStore
