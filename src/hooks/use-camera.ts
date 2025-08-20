import { useCallback, useRef } from 'react'

import { dataUrlToFile } from '@/helpers/common-helper'
import { format } from 'date-fns'
import Webcam from 'react-webcam'

export const useCamera = () => {
    const camRef = useRef<Webcam>(null)

    const captureImage = useCallback(() => {
        if (!camRef.current) return null
        const imageSrc = camRef.current.getScreenshot()
        return imageSrc
    }, [camRef])

    const captureImageToFile = useCallback(
        ({
            captureFileName,
            onCaptureError,
            onCaptureSuccess,
        }: {
            captureFileName?: string
            onCaptureSuccess?: (image: File) => void
            onCaptureError?: () => void
        } = {}) => {
            const imageSrc: string | null = captureImage() ?? ''
            const convertedImageToData = dataUrlToFile(
                imageSrc,
                captureFileName ??
                    `ECOOP_CAPTURE_IMG_${format(new Date(), 'yyyyMMdd_HHmmss')}`
            )

            if (convertedImageToData) onCaptureSuccess?.(convertedImageToData)
            else onCaptureError?.()

            return convertedImageToData
        },
        [captureImage]
    )

    return { camRef, captureImage, captureImageToFile }
}
