import { create } from 'zustand'
import { IMedia } from '@/types'

interface ImagePreviewState {
    isOpen: boolean
    focusIndex: number
    ImagePreviewData: ImagePreviewData
}

export interface ImagePreviewData {
    hideCloseButton?: boolean
    closeButtonClassName?: string
    overlayClassName?: string
    scaleInterval?: number
    className?: string
    Images?: IMedia[]
    title?: string
}

interface ImagePreviewActions {
    setIsOpen: (isOpen: boolean) => void
    setFocusIndex: (index: number) => void
    onOpen: (image: ImagePreviewData) => void
    onClose: () => void
}

interface ImagePreviewProps extends ImagePreviewState, ImagePreviewActions {}

export const useImagePreview = create<ImagePreviewProps>()((set) => ({
    focusIndex: 0,
    isOpen: false,
    ImagePreviewData: {},
    setFocusIndex: (index) =>
        set((state) => ({
            ...state,
            focusIndex: index,
        })),
    onClose: () =>
        set((state) => ({
            ...state,
            isOpen: false,
        })),
    onOpen: (ImagePreviewData) =>
        set({
            ImagePreviewData: ImagePreviewData,
            isOpen: true,
        }),
    setIsOpen: (isOpen) =>
        set((state) => ({
            ...state,
            isOpen: isOpen,
        })),
}))
