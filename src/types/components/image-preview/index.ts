import { MutableRefObject } from 'react'
import { IMediaResource } from '@/types/coop-types'

export interface ImagePreviewProps {
    hideCloseButton?: boolean
    closeButtonClassName?: string
    overlayClassName?: string
    Images: IMediaResource[]
    scaleInterval?: number
}

export interface ImageContainerProps extends Partial<DownloadProps> {
    media: IMediaResource
    scale: number
    rotateDegree: number
    flipScale: string
}

export interface ImagePreviewActionProps extends Partial<DownloadProps> {
    handleZoomIn: () => void
    handleZoomOut: () => void
    handleRotateLeft: () => void
    handleRotateRight: () => void
    handleResetActionState: () => void
    handleFlipHorizontal: () => void
    handleFlipVertical: () => void
    downloadImage: DownloadProps
    className: string
}

export interface ImagePreviewPanelProps {
    Images: IMediaResource[]
    focusIndex: number
    scrollToIndex: (index: number) => void
}

export interface DownloadProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    fileUrl?: string
    fileName: string
    fileType: string
    imageRef?: MutableRefObject<HTMLImageElement | null>
    name?: string
}

export interface ImagePreviewButtonActionProps {
    onClick: () => void
    className?: string
    Icon?: React.ReactNode
    name?: string
    iconClassName?: string
}
