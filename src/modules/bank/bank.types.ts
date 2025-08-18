import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '../common'
import { IMedia } from '../media/media.types'

export interface IBankRequest {
    name: string
    media_id?: TEntityId
    description: string
}

export interface IBank extends IBaseEntityMeta {
    id: TEntityId
    name: string
    media_id?: TEntityId
    media?: IMedia
    description: string
}

export interface IBankPaginated extends IPaginatedResult<IBank> {}
