import { AxiosProgressEvent } from 'axios'

export interface UploadProgressResult {
    progress: number
    etaFormatted: string
}

export const calculateUploadProgress = (
    progressEvent: AxiosProgressEvent,
    startTime: number = Date.now()
): UploadProgressResult | undefined => {
    if (!progressEvent.total) return

    const progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
    )

    const elapsedTime = (Date.now() - startTime) / 1000 // in seconds
    const uploadSpeed = progressEvent.loaded / elapsedTime // bytes per second
    const remainingBytes = progressEvent.total - progressEvent.loaded
    const etaSeconds = uploadSpeed > 0 ? remainingBytes / uploadSpeed : 0

    const minutes = Math.floor(etaSeconds / 60)
    const seconds = Math.round(etaSeconds % 60)
    const etaFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

    return { progress, etaFormatted }
}
