import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { IOperationCallbacks } from './types'
import { IMediaResource } from '@/server/types'
import { serverRequestErrExtractor } from '@/helpers'
import MediaService from '@/server/api-service/media-service'

export const useSinglePictureUpload = ({
    onError,
    onSuccess,
    onUploadETAChange,
    onUploadProgressChange,
}: {
    onUploadProgressChange?: (progress: number) => void
    onUploadETAChange?: (eta: string) => void
} & IOperationCallbacks<IMediaResource, string>) => {
    return useMutation<IMediaResource, string, File>({
        mutationKey: ['upload-media-photo'],
        mutationFn: async (fileImage) => {
            if (!fileImage) {
                const errorMessage = 'No valid File Image to upload'
                toast.warning(errorMessage)
                throw errorMessage
            }

            onUploadProgressChange?.(0)

            const startTime = Date.now()

            const [error, data] = await withCatchAsync(
                MediaService.upload(fileImage, (progressEvent) => {
                    if (!progressEvent.total) return

                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )

                    onUploadProgressChange?.(progress)

                    const elapsedTime = (Date.now() - startTime) / 1000
                    const uploadSpeed = progressEvent.loaded / elapsedTime
                    const remainingBytes =
                        progressEvent.total - progressEvent.loaded
                    const etaSeconds =
                        uploadSpeed > 0 ? remainingBytes / uploadSpeed : 0
                    const minutes = Math.floor(etaSeconds / 60)
                    const seconds = Math.round(etaSeconds % 60)
                    const etaFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

                    onUploadETAChange?.(etaFormatted)
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
    })
}
