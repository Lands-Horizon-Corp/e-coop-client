import { AxiosProgressEvent } from 'axios'

import APIService from './api-service'
import { IMediaResource, TEntityId } from '../types'

export default class MediaService {
    private static readonly BASE_ENDPOINT = '/media'

    public static async upload(
        file: File,
        onProgress?: (progressEvent: AxiosProgressEvent) => void
    ): Promise<IMediaResource> {
        const formData = new FormData()
        formData.append('file', file)
        const response = await APIService.uploadFile<IMediaResource>(
            `${MediaService.BASE_ENDPOINT}/upload`,
            formData,
            {},
            {
                onUploadProgress: onProgress,
            }
        )
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        await APIService.delete(`${MediaService.BASE_ENDPOINT}/${id}`)
    }
}
