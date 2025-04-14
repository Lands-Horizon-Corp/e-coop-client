import * as htmlToImage from 'html-to-image'
import { useState, useCallback } from 'react'

export interface UseDownloadOptions {
    fileName: string
    fileType: 'jpeg' | 'png' | 'svg'
    onSuccess?: () => void
    onError?: (errorMessage: string) => void
    onDownloadStart?: () => void
}

export const useDownloadElement = () => {
    const [isDownloading, setIsDownloading] = useState(false)

    const download = (
        element: HTMLElement | null,
        options: UseDownloadOptions
    ) => {
        if (!element) {
            options.onError?.('Element not found for download')
            return
        }

        options.onDownloadStart?.()
        setIsDownloading(true)

        let toImageFunction

        switch (options.fileType) {
            case 'png':
                toImageFunction = htmlToImage.toPng
                break
            case 'svg':
                toImageFunction = htmlToImage.toSvg
                break
            default:
                toImageFunction = htmlToImage.toJpeg
        }

        toImageFunction(element, { quality: 0.95 })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = `${options.fileName}.${options.fileType}`
                link.href = dataUrl
                link.click()
                options.onSuccess?.()
            })
            .catch((error) => {
                options.onError?.(error.message || 'Failed to download')
            })
            .finally(() => {
                setIsDownloading(false)
            })
    }

    const getDownloadHandler = useCallback(
        (
            elementRef: React.RefObject<HTMLElement>,
            options: UseDownloadOptions
        ) => {
            return () => download(elementRef.current, options)
        },
        []
    )

    return { download, getDownloadHandler, isDownloading }
}
