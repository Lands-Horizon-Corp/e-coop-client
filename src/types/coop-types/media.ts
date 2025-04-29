import { ITimeStamps, TEntityId } from '../common'

export interface IMedia extends ITimeStamps {
    id: TEntityId
    fileName: string
    fileSize: number
    fileType: string
    storageKey: string
    url: string
    bucketName: string
    downloadURL: string
    // TODO: Reference User Here
}

export interface IMediaRequest {
    id?: TEntityId
    fileName: string
    fileSize: number
    fileType: string
    storageKey: string
    key?: string
    url?: string
    bucketName?: string

    userId?: TEntityId
    // TODO: user?: IUserResource
}
