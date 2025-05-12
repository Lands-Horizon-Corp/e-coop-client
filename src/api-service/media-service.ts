import { AxiosProgressEvent } from 'axios'

import APIService from './api-service'
import { IMedia, TEntityId } from '@/types'

const BASE_ENDPOINT = '/media'

export const uploadMedia = async (
    file: File,
    onProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<IMedia> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await APIService.uploadFile<IMedia>(
        `${BASE_ENDPOINT}`,
        formData,
        {},
        {
            onUploadProgress: onProgress,
        }
    )

    return response.data
}

export const deleteMedia = async (id: TEntityId): Promise<void> => {
    await APIService.delete(`${BASE_ENDPOINT}/${id}`)
}
