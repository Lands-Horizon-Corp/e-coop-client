import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IMedia } from '../media/media.types'

export interface IVoucherPayToRequest {
    name?: string
    media_id?: TEntityId
    description?: string
}

export interface IVoucherPayTo extends IBaseEntityMeta {
    id: TEntityId
    name: string
    media_id?: TEntityId
    media?: IMedia
    description: string
}
