import { create } from 'zustand'
import { ReactNode } from 'react'

interface IInfoDatas {
    title?: string | ReactNode
    description?: string | ReactNode
    component?: ReactNode | string
    confirmString?: string
    hideConfirm?: boolean
    onConfirm?: () => void
    classNames?: {
        titleClassName?: string
        descriptionClassName?: string
        hideCloseButton?: boolean
        closeButtonClassName?: string
        overlayClassName?: string
        className?: string
    }
}

interface IInfoModalStore {
    isOpen: boolean
    infoDatas: IInfoDatas

    onOpen: (infoData: IInfoDatas) => void

    onClose: () => void
    onConfirm: () => void
}

export const useInfoModalStore = create<IInfoModalStore>((set) => ({
    isOpen: false,
    infoDatas: {},
    onOpen: (infoData) =>
        set({
            isOpen: true,
            infoDatas: {
                ...infoData,
                confirmString: infoData.confirmString ?? 'Confirm',
            },
        }),
    onClose: () => set({ isOpen: false }),
    onConfirm: () =>
        set((state) => {
            if (state.infoDatas?.onConfirm) state.infoDatas.onConfirm()
            return { isOpen: false }
        }),
}))
